// Bulletproof Text-to-Speech (TTS) Engine with Bengali & English Sentence-Queueing

let cachedVoices = [];
let keepAliveTimer = null;
let currentQueue = [];
let isQueuePlaying = false;
let currentOnEnd = null;
let currentOnError = null;

// Preload voices immediately and listen for changes
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function getAvailableVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  if (!cachedVoices || cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
  return cachedVoices;
}

export function isBengaliText(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

function findBestVoice(voices, isBengali) {
  if (!voices || voices.length === 0) return null;

  if (isBengali) {
    const bengaliVoice = voices.find(v => 
      (v.lang && (v.lang.toLowerCase().startsWith('bn') || v.lang.toLowerCase().includes('bengali'))) ||
      (v.name && (v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali') || v.name.includes('বাংলা') || v.name.includes('Bashkar') || v.name.includes('Tanisha')))
    );
    if (bengaliVoice) return bengaliVoice;
  }

  // Fallback: Indian English or general natural voice
  const inVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-in'));
  if (inVoice) return inVoice;

  const defaultVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  return defaultVoice || voices[0] || null;
}

export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*~_>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[🎙️⚡🧠✅📌🚀⚠️🔍🤖🔊]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into small sentence chunks (<160 chars) to prevent Chromium TTS freeze bug
 */
function splitIntoSentenceChunks(text) {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  // Split on Bengali dāṛi (।), periods, newlines, exclamation, questions
  const rawSegments = cleaned.split(/([|।!?\n]+)/);
  const chunks = [];
  let buffer = '';

  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i];
    if (!segment) continue;

    if (buffer.length + segment.length < 160) {
      buffer += segment;
    } else {
      if (buffer.trim()) chunks.push(buffer.trim());
      buffer = segment;
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());

  return chunks.filter(c => c.length > 0);
}

function startKeepAlive() {
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 5000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

function processNextQueueItem() {
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
  }
  utterance.lang = isBengali ? (voice?.lang || 'bn-IN') : (voice?.lang || 'en-IN');
  utterance.rate = isBengali ? 0.95 : 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    processNextQueueItem();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Utterance speech notice:', e.error);
    }
    processNextQueueItem();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak text smoothly using chunked Web Speech Synthesis
 */
export function speakText(text, options = {}) {
  const {
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  } = options;

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onError(new Error('SpeechSynthesis is not supported on this device.'));
    return () => {};
  }

  // Cancel existing
  stopSpeech();

  const chunks = splitIntoSentenceChunks(text);
  if (chunks.length === 0) {
    onEnd();
    return () => {};
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

  onStart();
  startKeepAlive();
  processNextQueueItem();

  return () => stopSpeech();
}

/**
 * Stop any active audio speech
 */
export function stopSpeech() {
  stopKeepAlive();
  currentQueue = [];
  isQueuePlaying = false;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}
