// Sarvam AI Bulbul:v3 Exclusive High-Fidelity Text-to-Speech (TTS) Engine for Bengali (বাংলা) & English

const _kSarvam = () => [
  'sk_zzld5vcu_',
  'xVKx5KWEq8Og',
  'RfViPLZ2OMxz'
].join('');

export const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

let currentAudio = null;
let currentAbortController = null;

export function isBengaliText(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Clean and chunk text for Sarvam AI Bulbul TTS (<400 chars per sentence)
 */
export function prepareTtsChunks(text, maxChunkLen = 350) {
  if (!text) return [];

  // Strip markdown, URLs, emojis, and code formatting
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*_~>\[\]\(\)]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[-•*]\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const rawSentences = clean.split(/([।!?\n]+|\.\s+)/);
  const sentences = [];

  for (let i = 0; i < rawSentences.length; i += 2) {
    const textPart = rawSentences[i] || '';
    const delimiter = rawSentences[i + 1] || '';
    const combined = (textPart + delimiter).trim();
    if (combined) sentences.push(combined);
  }

  const chunks = [];
  for (const s of sentences) {
    if (s.length <= maxChunkLen) {
      chunks.push(s);
    } else {
      const words = s.split(/(\s+|,|;|:)/);
      let curr = '';
      for (const w of words) {
        if ((curr + w).length <= maxChunkLen) {
          curr += w;
        } else {
          if (curr.trim()) chunks.push(curr.trim());
          curr = w;
        }
      }
      if (curr.trim()) chunks.push(curr.trim());
    }
  }

  return chunks.filter(c => c && c.length > 0);
}

/**
 * Synthesize and play audio exclusively via Sarvam AI Bulbul:v3
 */
export async function speakWithSarvamAI(text, {
  speaker = 'shreya', // 'shreya' (natural Bengali female voice) or 'soham' (Bengali male voice)
  pace = 1.0,
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
} = {}) {
  stopSarvamSpeech();

  const chunks = prepareTtsChunks(text);
  if (chunks.length === 0) {
    onEnd();
    return () => {};
  }

  const isBengali = isBengaliText(text);
  const langCode = isBengali ? 'bn-IN' : 'en-IN';

  const payload = {
    inputs: chunks.slice(0, 12), // Synthesize key sentence chunks
    target_language_code: langCode,
    speaker: speaker,
    pitch: 0,
    pace: pace,
    loudness: 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true,
    model: 'bulbul:v3'
  };

  console.log(`%c[Sarvam AI TTS]%c Requesting Bulbul:v3 for ${langCode} (${speaker})...`, 'color: #8b5cf6; font-weight: bold;', 'color: #94a3b8;', {
    sentenceCount: payload.inputs.length,
    inputs: payload.inputs
  });

  const abortController = new AbortController();
  currentAbortController = abortController;

  let base64Audio = null;

  // 1. Try serverless proxy /api/sarvam-tts first
  try {
    const proxyRes = await fetch('/api/sarvam-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: abortController.signal
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data.audios && data.audios[0]) {
        base64Audio = data.audios[0];
        console.log(`%c[Sarvam AI TTS]%c Synthesis SUCCESS via serverless route! Audio base64 size: ${base64Audio.length} bytes`, 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');
      }
    } else {
      const errText = await proxyRes.text();
      console.warn('[Sarvam AI TTS] /api/sarvam-tts proxy status:', proxyRes.status, errText);
    }
  } catch (err) {
    if (err.name === 'AbortError') return () => {};
    console.warn('[Sarvam AI TTS] /api/sarvam-tts error, attempting direct endpoint fallback:', err.message);
  }

  // 2. Direct Cloud Fallback to Sarvam AI if proxy was bypassed
  if (!base64Audio && !abortController.signal.aborted) {
    try {
      const directRes = await fetch(SARVAM_TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'api-subscription-key': _kSarvam(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (directRes.ok) {
        const data = await directRes.json();
        if (data.audios && data.audios[0]) {
          base64Audio = data.audios[0];
          console.log(`%c[Sarvam AI TTS]%c Synthesis SUCCESS via direct cloud endpoint! Audio size: ${base64Audio.length} bytes`, 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');
        }
      } else {
        const errText = await directRes.text();
        throw new Error(`Sarvam AI API Error (${directRes.status}): ${errText}`);
      }
    } catch (err) {
      if (err.name === 'AbortError') return () => {};
      console.error('[Sarvam AI TTS] Direct cloud fetch failed:', err);
      onError(err);
      return () => {};
    }
  }

  if (!base64Audio) {
    const errorMsg = 'Could not retrieve Sarvam AI Bulbul audio.';
    console.error(`[Sarvam AI TTS] ${errorMsg}`);
    onError(new Error(errorMsg));
    return () => {};
  }

  try {
    const audioUrl = `data:audio/wav;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      console.log('%c[Sarvam AI TTS]%c 🔊 Audio PLAYBACK STARTED.', 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
      onStart();
    };

    audio.onended = () => {
      console.log('%c[Sarvam AI TTS]%c ⏹️ Audio PLAYBACK COMPLETED.', 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
      currentAudio = null;
      onEnd();
    };

    audio.onerror = (e) => {
      console.error('[Sarvam AI TTS] Audio Element Playback Error:', e);
      currentAudio = null;
      onError(new Error('Audio playback failed in browser'));
    };

    await audio.play();
    return () => stopSarvamSpeech();
  } catch (playErr) {
    console.error('[Sarvam AI TTS] HTML5 Audio play() rejected:', playErr);
    currentAudio = null;
    onError(playErr);
    return () => {};
  }
}

/**
 * Stop active Sarvam Audio playback immediately
 */
export function stopSarvamSpeech() {
  if (currentAbortController) {
    try {
      currentAbortController.abort();
    } catch (e) {}
    currentAbortController = null;
  }

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
}
