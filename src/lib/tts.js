// Bulletproof Text-to-Speech (TTS) Engine with Microsoft Azure Neural Bengali Voice & Browser Fallback
import { speakAzureNeuralTts, stopAzureNeuralTts } from './azureSpeech';

let cachedVoices = [];
let keepAliveTimer = null;
let currentQueue = [];
let isQueuePlaying = false;
let currentOnEnd = null;
let currentOnError = null;

// Preload voices immediately and listen for changes
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {}
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Unlock / Prime the speech synthesizer within a synchronous user gesture
 * Call this on button clicks (mic click, stop, send, listen) to bypass browser autoplay policies
 */
export function unlockSpeech() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0.01;
    silent.rate = 2.0;
    window.speechSynthesis.speak(silent);
  } catch (e) {
    console.warn('Speech unlock notice:', e);
  }
}

export function getAvailableVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  if (!cachedVoices || cachedVoices.length === 0) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {}
  }
  return cachedVoices;
}

export function isBengaliText(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Find best voice with prioritized Bengali match and graceful fallback
 */
export function findBestVoice(voices, isBengali) {
  if (!voices || voices.length === 0) return null;

  if (isBengali) {
    // 1. Bengali specific voices (bn-IN, bn-BD, bengali, etc.)
    const bengaliVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.includes('bn') || l.includes('ben') || n.includes('bengali') || n.includes('bangla') || n.includes('tanishaa') || n.includes('bashkar');
    });
    if (bengaliVoice) return bengaliVoice;

    // 2. Indian English / Multilingual accent
    const indianVoice = voices.find(v => {
      const l = (v.lang || '').toLowerCase();
      const n = (v.name || '').toLowerCase();
      return l.includes('en-in') || n.includes('india') || n.includes('neerja') || n.includes('prabhat');
    });
    if (indianVoice) return indianVoice;
  }

  // 3. High quality natural English voices
  const naturalEn = voices.find(v => {
    const n = (v.name || '').toLowerCase();
    const l = (v.lang || '').toLowerCase();
    return (l.startsWith('en') && (n.includes('natural') || n.includes('online') || n.includes('google') || n.includes('samantha')));
  });
  if (naturalEn) return naturalEn;

  // 4. Default voice
  return voices.find(v => v.default) || voices[0] || null;
}

/**
 * Split text into small sentence chunks (<120 characters)
 */
export function splitIntoSentenceChunks(text, maxChunkLen = 120) {
  if (!text) return [];

  // Strip markdown symbols and URLs for clean speech
  const cleanText = text
    .replace(/[#*_`~>\[\]\(\)]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return [];

  const rawSentences = cleanText.split(/([।!?\n]+|\.\s+)/);
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
      const words = s.split(/(\s+|,|;|:|-)/);
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

function startKeepAlive() {
  stopKeepAlive();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    keepAliveTimer = setInterval(() => {
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch (e) {}
    }, 4500);
  }
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

function processNextBrowserQueueItem() {
  if (currentQueue.length === 0) {
    isQueuePlaying = false;
    stopKeepAlive();
    if (currentOnEnd) currentOnEnd();
    return;
  }

  const { chunk, isBengali, voice } = currentQueue.shift();
  const utterance = new SpeechSynthesisUtterance(chunk);
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || (isBengali ? 'bn-IN' : 'en-US');
  } else {
    utterance.lang = isBengali ? 'bn-IN' : 'en-US';
  }

  utterance.rate = isBengali ? 0.95 : 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    processNextBrowserQueueItem();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Utterance speech warning:', e.error);
    }
    processNextBrowserQueueItem();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis speak error:', err);
    processNextBrowserQueueItem();
  }
}

function speakWithBrowserFallback(text, { onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError(new Error('SpeechSynthesis is not supported on this device.'));
    return;
  }

  const chunks = splitIntoSentenceChunks(text);
  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  const isBengali = isBengaliText(text);
  const voices = getAvailableVoices();
  const bestVoice = findBestVoice(voices, isBengali);

  currentQueue = chunks.map(chunk => ({
    chunk,
    isBengali,
    voice: bestVoice
  }));

  currentOnEnd = onEnd;
  currentOnError = onError;
  isQueuePlaying = true;

  if (onStart) onStart();
  startKeepAlive();
  processNextBrowserQueueItem();
}

/**
 * Speak text smoothly with Microsoft Azure Neural Bengali Voice & Browser Fallback
 */
export function speakText(text, options = {}) {
  const {
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  } = options;

  stopSpeech();

  if (!text || !text.trim()) {
    onEnd();
    return () => {};
  }

  // 1. Try Microsoft Azure Neural Bengali Voice (SwiftKey / Azure Neural TTS)
  try {
    speakAzureNeuralTts(text, {
      onStart,
      onEnd,
      onError: (err) => {
        console.warn('Azure Neural TTS notice, switching to browser TTS:', err);
        speakWithBrowserFallback(text, { onStart, onEnd, onError });
      }
    });
  } catch (e) {
    speakWithBrowserFallback(text, { onStart, onEnd, onError });
  }

  return () => stopSpeech();
}

/**
 * Stop any active audio speech
 */
export function stopSpeech() {
  stopAzureNeuralTts();
  stopKeepAlive();
  currentQueue = [];
  isQueuePlaying = false;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}
