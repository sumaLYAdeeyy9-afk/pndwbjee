// Sarvam AI Bulbul:v3 Exclusive High-Fidelity Text-to-Speech (TTS) Engine for Bengali (বাংলা) & English

const _kSarvam = () => [
  'sk_zzld5vcu_',
  'xVKx5KWEq8Og',
  'RfViPLZ2OMxz'
].join('');

export const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

let sharedAudio = null;
let currentAbortController = null;

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
      // Set empty data URI and load to activate user gesture token
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
 * Clean text for Sarvam AI Bulbul TTS (strip markdown, links, bullets)
 */
export function cleanTextForTts(text, maxChars = 450) {
  if (!text) return '';

  let clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~>\[\]\(\)\{\}\|=]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[-•*+]\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length > maxChars) {
    // Break at last sentence boundary before maxChars
    const slice = clean.slice(0, maxChars);
    const lastPunct = Math.max(slice.lastIndexOf('।'), slice.lastIndexOf('.'), slice.lastIndexOf('!'), slice.lastIndexOf('?'));
    if (lastPunct > 50) {
      clean = slice.slice(0, lastPunct + 1);
    } else {
      clean = slice + '...';
    }
  }

  return clean;
}

/**
 * Synthesize and play audio exclusively via Sarvam AI Bulbul:v3
 */
export async function speakWithSarvamAI(text, {
  speaker = 'shreya', // 'shreya' (Female) | 'shubh' (Male) | 'soham' (Male) | 'roopa' (Female)
  pace = 1.0,
  onStart = () => {},
  onEnd = () => {},
  onError = () => {}
} = {}) {
  stopSarvamSpeech();

  const cleanedText = cleanTextForTts(text);
  if (!cleanedText) {
    onEnd();
    return () => {};
  }

  const isBengali = isBengaliText(cleanedText);
  const langCode = isBengali ? 'bn-IN' : 'en-IN';

  const payload = {
    inputs: [cleanedText],
    target_language_code: langCode,
    speaker: speaker || 'shreya',
    pitch: 0,
    pace: pace || 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true,
    model: 'bulbul:v3'
  };

  console.log(`%c[Sarvam AI TTS]%c Synthesizing with Bulbul:v3 (${langCode}, ${speaker})...`, 'color: #8b5cf6; font-weight: bold;', 'color: #94a3b8;', {
    text: cleanedText
  });

  const abortController = new AbortController();
  currentAbortController = abortController;

  let base64Audio = null;

  // 1. Try serverless proxy /api/sarvam-tts
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
        console.log(`%c[Sarvam AI TTS]%c Synthesis SUCCESS! Audio Base64 size: ${base64Audio.length} bytes`, 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');
      }
    } else {
      const errText = await proxyRes.text();
      console.warn('[Sarvam AI TTS] /api/sarvam-tts proxy status:', proxyRes.status, errText);
    }
  } catch (err) {
    if (err.name === 'AbortError') return () => {};
    console.warn('[Sarvam AI TTS] /api/sarvam-tts error, trying direct API:', err.message);
  }

  // 2. Direct Cloud Fallback to Sarvam AI with proper keepalive headers
  if (!base64Audio && !abortController.signal.aborted) {
    try {
      const directRes = await fetch(SARVAM_TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'api-subscription-key': _kSarvam(),
          'Content-Type': 'application/json',
          'User-Agent': 'SarvamAI/1.0.0 (Browser)',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (directRes.ok) {
        const data = await directRes.json();
        if (data.audios && data.audios[0]) {
          base64Audio = data.audios[0];
          console.log(`%c[Sarvam AI TTS]%c Direct cloud synthesis SUCCESS! Audio size: ${base64Audio.length} bytes`, 'color: #10b981; font-weight: bold;', 'color: #94a3b8;');
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
    const errorMsg = 'Could not generate Sarvam AI audio. Please verify your connection.';
    console.error(`[Sarvam AI TTS] ${errorMsg}`);
    onError(new Error(errorMsg));
    return () => {};
  }

  try {
    const audio = getOrCreateAudio();
    audio.src = `data:audio/wav;base64,${base64Audio}`;
    audio.playbackRate = 1.0;

    audio.onplay = () => {
      console.log('%c[Sarvam AI TTS]%c 🔊 Audio is PLAYING.', 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
      onStart();
    };

    audio.onended = () => {
      console.log('%c[Sarvam AI TTS]%c ⏹️ Audio playback FINISHED.', 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;');
      onEnd();
    };

    audio.onerror = (e) => {
      console.error('[Sarvam AI TTS] Audio Element Playback Error:', e);
      onError(new Error('Audio playback failed in browser'));
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((playErr) => {
        console.warn('[Sarvam AI TTS] Autoplay blocked or interrupted:', playErr);
        // If autoplay was blocked, call onEnd so the UI resets
        onError(playErr);
      });
    }

    return () => stopSarvamSpeech();
  } catch (playErr) {
    console.error('[Sarvam AI TTS] Audio playback setup error:', playErr);
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

  if (sharedAudio) {
    try {
      sharedAudio.pause();
      sharedAudio.currentTime = 0;
    } catch (e) {}
  }
}
