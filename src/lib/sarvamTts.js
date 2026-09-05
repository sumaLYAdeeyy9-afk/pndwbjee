// Sarvam AI Bulbul:v3 Exclusive High-Fidelity Text-to-Speech (TTS) Engine for Bengali (বাংলা) & English
// Supports full-length continuous audio playback across long responses

const _kSarvam = () => [
  'sk_zzld5vcu_',
  'xVKx5KWEq8Og',
  'RfViPLZ2OMxz'
].join('');

export const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

let sharedAudio = null;
let currentAbortController = null;
let activeSessionId = 0;

// Initialize & prime shared Audio object
function getOrCreateAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
  }
  return sharedAudio;
}

/**
 * Prime audio element inside user click gesture to bypass mobile/desktop autoplay restrictions
 */
export function primeAudio() {
  if (typeof window === 'undefined') return;
  try {
    const audio = getOrCreateAudio();
    if (audio) {
      if (!audio.src) {
        audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';
      }
      audio.load();
    }
  } catch (e) {
    console.warn('Audio priming notice:', e);
  }
}

export function isBengaliText(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Clean and segment full-length text into batches of max 3 chunks (each <= 450 chars)
 * for Sarvam AI Bulbul:v3 API validation compliance.
 */
export function prepareTtsBatches(text, maxChunkChars = 450) {
  if (!text) return [];

  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~>\[\]\(\)\{\}\|=]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[-•*+]\s+/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (!clean) return [];

  // Split by natural punctuation sentence delimiters
  const sentences = clean.split(/(?<=[।!?\n])|(?<=\.\s+)/).map(s => s.trim()).filter(Boolean);
  if (sentences.length === 0) return [];

  const chunks = [];
  let currentChunk = '';

  for (const s of sentences) {
    if ((currentChunk + ' ' + s).trim().length <= maxChunkChars) {
      currentChunk = (currentChunk + ' ' + s).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (s.length > maxChunkChars) {
        // Slice very long sentences into maxChunkChars segments
        for (let j = 0; j < s.length; j += maxChunkChars) {
          const piece = s.slice(j, j + maxChunkChars).trim();
          if (piece) chunks.push(piece);
        }
        currentChunk = '';
      } else {
        currentChunk = s;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  // Group into batches of at most 3 items per Sarvam API call
  const batches = [];
  for (let i = 0; i < chunks.length; i += 3) {
    batches.push(chunks.slice(i, i + 3));
  }

  return batches;
}

/**
 * Fetch a single audio batch from Sarvam AI
 */
async function fetchBatchAudio(batchChunks, langCode, speaker, pace, abortSignal) {
  const payload = {
    inputs: batchChunks,
    target_language_code: langCode,
    speaker: speaker || 'shreya',
    pitch: 0,
    pace: pace || 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true,
    model: 'bulbul:v3'
  };

  // 1. Try serverless proxy /api/sarvam-tts first
  try {
    const proxyRes = await fetch('/api/sarvam-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abortSignal
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data.audios && data.audios[0]) {
        return data.audios[0];
      }
    } else {
      const errText = await proxyRes.text();
      console.warn('[Sarvam AI TTS] /api/sarvam-tts status:', proxyRes.status, errText);
    }
  } catch (err) {
    if (err.name === 'AbortError') return null;
    console.warn('[Sarvam AI TTS] /api/sarvam-tts error, attempting direct endpoint fallback:', err.message);
  }

  // 2. Direct Cloud Fallback to Sarvam AI
  if (!abortSignal.aborted) {
    const directRes = await fetch(SARVAM_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-subscription-key': _kSarvam(),
        'Content-Type': 'application/json',
        'User-Agent': 'SarvamAI/1.0.0 (Browser)',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: abortSignal
    });

    if (directRes.ok) {
      const data = await directRes.json();
      if (data.audios && data.audios[0]) {
        return data.audios[0];
      }
    } else {
      const errText = await directRes.text();
      throw new Error(`Sarvam AI API Error (${directRes.status}): ${errText}`);
    }
  }

  return null;
}

/**
 * Synthesize and play complete full-length audio sequentially via Sarvam AI Bulbul:v3
 */
export async function speakWithSarvamAI(text, {
  speaker = 'shreya', // 'shreya' (Female) | 'shubh' (Male) | 'soham' (Male) | 'roopa' (Female)
  pace = 1.0,
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
} = {}) {
  stopSarvamSpeech();

  const sessionId = ++activeSessionId;
  const batches = prepareTtsBatches(text);

  if (batches.length === 0) {
    onEnd();
    return () => {};
  }

  const isBengali = isBengaliText(text);
  const langCode = isBengali ? 'bn-IN' : 'en-IN';

  console.log(`%c[Sarvam AI TTS]%c Synthesizing full message: ${batches.length} batch(es) for ${langCode} (${speaker})...`, 'color: #8b5cf6; font-weight: bold;', 'color: #94a3b8;', {
    totalBatches: batches.length,
    batches
  });

  const abortController = new AbortController();
  currentAbortController = abortController;

  const audio = getOrCreateAudio();
  let hasTriggeredStart = false;

  // Background audio pre-fetch map: batchIndex -> Promise<base64Audio>
  const prefetchMap = new Map();

  const getAudioForBatch = (batchIndex) => {
    if (batchIndex >= batches.length) return Promise.resolve(null);
    if (!prefetchMap.has(batchIndex)) {
      prefetchMap.set(
        batchIndex,
        fetchBatchAudio(batches[batchIndex], langCode, speaker, pace, abortController.signal)
      );
    }
    return prefetchMap.get(batchIndex);
  };

  // Pre-fetch the first two batches immediately
  getAudioForBatch(0);
  if (batches.length > 1) {
    getAudioForBatch(1);
  }

  // Play batches sequentially from 0 to N-1
  const playBatch = async (batchIndex) => {
    if (activeSessionId !== sessionId || abortController.signal.aborted) {
      return;
    }

    if (batchIndex >= batches.length) {
      console.log('%c[Sarvam AI TTS]%c ⏹️ Full message audio playback FINISHED.', 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');
      onEnd();
      return;
    }

    try {
      console.log(`[Sarvam AI TTS] Loading audio for batch ${batchIndex + 1}/${batches.length}...`);
      const base64Audio = await getAudioForBatch(batchIndex);

      if (activeSessionId !== sessionId || abortController.signal.aborted) return;

      if (!base64Audio) {
        throw new Error(`Failed to synthesize audio for batch ${batchIndex + 1}`);
      }

      // Pre-fetch the next batch while this one is about to play
      if (batchIndex + 1 < batches.length) {
        getAudioForBatch(batchIndex + 1);
      }

      audio.src = `data:audio/wav;base64,${base64Audio}`;
      audio.playbackRate = 1.0;

      audio.onplay = () => {
        if (!hasTriggeredStart) {
          hasTriggeredStart = true;
          console.log('%c[Sarvam AI TTS]%c 🔊 Full message audio is PLAYING.', 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
          onStart();
        }
      };

      audio.onended = () => {
        // Seamlessly proceed to next batch
        playBatch(batchIndex + 1);
      };

      audio.onerror = (e) => {
        console.error(`[Sarvam AI TTS] Audio error at batch ${batchIndex}:`, e);
        // Attempt next batch or end
        if (batchIndex + 1 < batches.length) {
          playBatch(batchIndex + 1);
        } else {
          onError(new Error('Audio playback interrupted'));
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((playErr) => {
          console.warn('[Sarvam AI TTS] Autoplay interrupted:', playErr);
          onError(playErr);
        });
      }
    } catch (err) {
      if (err.name === 'AbortError' || activeSessionId !== sessionId) return;
      console.error(`[Sarvam AI TTS] Error in batch ${batchIndex}:`, err);
      onError(err);
    }
  };

  // Start sequential playback from batch 0
  playBatch(0);

  return () => stopSarvamSpeech();
}

/**
 * Stop active Sarvam Audio playback immediately and clear queue
 */
export function stopSarvamSpeech() {
  activeSessionId++;
  if (currentAbortController) {
    try {
      currentAbortController.abort();
    } catch (e) {}
    currentAbortController = null;
  }

  if (sharedAudio) {
    try {
      sharedAudio.pause();
      sharedAudio.currentTime = 0;
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
    } catch (e) {}
  }
}
