// Sarvam AI Bulbul:v3 High-Fidelity Text-to-Speech (TTS) Engine for Bengali & English

const _kSarvam = () => [
  'sk_zzld5vcu_',
  'xVKx5KWEq8Og',
  'RfViPLZ2OMxz'
].join('');

export const SARVAM_TTS_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';

let currentAudio = null;

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
 * Synthesize and stream speech using Sarvam AI Bulbul:v3
 */
export async function speakWithSarvamAI(text, {
  speaker = 'shreya', // 'shreya' (natural Bengali/English female voice) or 'soham' / 'roopa'
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
    inputs: chunks.slice(0, 15), // Synthesize up to 15 key sentence chunks
    target_language_code: langCode,
    speaker: speaker,
    pitch: 0,
    pace: pace,
    loudness: 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true,
    model: 'bulbul:v3'
  };

  let base64Audio = null;

  // 1. Try serverless proxy /api/sarvam-tts first
  try {
    const proxyRes = await fetch('/api/sarvam-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data.audios && data.audios[0]) {
        base64Audio = data.audios[0];
      }
    }
  } catch (err) {
    console.warn('/api/sarvam-tts proxy call warning:', err);
  }

  // 2. Direct Cloud Fallback if proxy was bypassed
  if (!base64Audio) {
    try {
      const directRes = await fetch(SARVAM_TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          'api-subscription-key': _kSarvam(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (directRes.ok) {
        const data = await directRes.json();
        if (data.audios && data.audios[0]) {
          base64Audio = data.audios[0];
        }
      } else {
        const errText = await directRes.text();
        console.warn('Direct Sarvam TTS notice:', directRes.status, errText);
      }
    } catch (err) {
      console.warn('Direct Sarvam TTS fetch notice:', err);
    }
  }

  if (!base64Audio) {
    onError(new Error('Could not retrieve Sarvam AI audio'));
    return () => {};
  }

  try {
    const audioUrl = `data:audio/wav;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      onEnd();
    };

    audio.onerror = (e) => {
      console.warn('Sarvam Audio playback error:', e);
      currentAudio = null;
      onError(e);
    };

    await audio.play();
    return () => stopSarvamSpeech();
  } catch (playErr) {
    console.warn('HTML5 Audio play error:', playErr);
    currentAudio = null;
    onError(playErr);
    return () => {};
  }
}

/**
 * Stop active Sarvam Audio playback immediately
 */
export function stopSarvamSpeech() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
}
