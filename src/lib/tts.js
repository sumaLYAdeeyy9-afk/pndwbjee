// Bulletproof Text-to-Speech (TTS) Engine with Bengali & English Sentence-Queueing & User-Gesture Unlocking

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
    // 1. Look for native Bengali voices
    const bengaliVoice = voices.find(v => 
      (v.lang && (v.lang.toLowerCase().startsWith('bn') || v.lang.toLowerCase().includes('bengali'))) ||
      (v.name && (
        v.name.toLowerCase().includes('bangla') || 
        v.name.toLowerCase().includes('bengali') || 
        v.name.includes('বাংলা') || 
        v.name.toLowerCase().includes('bashkar') || 
        v.name.toLowerCase().includes('tanisha')
      ))
    );
    if (bengaliVoice) return bengaliVoice;
  }

  // 2. Fallback: Indian English natural voice
  const inVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-in'));
  if (inVoice) return inVoice;

  // 3. Fallback: Standard English voice
  const enVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (enVoice) return enVoice;

  return voices[0] || null;
}

/**
 * Clean markdown, tables, bullets, and emojis for natural human-like speech
 */
export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '') // strip code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\|[^\n]+\|/g, ' ') // strip table rows
    .replace(/[-*#_~>]/g, ' ') // markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/[🎙️⚡🧠✅📌🚀⚠️🔍🤖🔊💡❌💬]/gu, '') // emojis
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into small sentence chunks (<120 chars) to prevent Chromium TTS freeze
 */
function splitIntoSentenceChunks(text) {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  // Split on Bengali dāṛi (।), full stops, newlines, question/exclamation marks, colons
  const rawSegments = cleaned.split(/([|।!?\n:]+)/);
  const chunks = [];
  let buffer = '';

  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i];
    if (!segment) continue;

    if (buffer.length + segment.length < 120) {
      buffer += segment;
    } else {
      if (buffer.trim()) chunks.push(buffer.trim());
      buffer = segment;
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());

  return chunks.filter(c => c.length > 0 && c.length < 300);
}

function startKeepAlive() {
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 3500);
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
    utterance.lang = voice.lang || (isBengali ? 'bn-IN' : 'en-US');
  } else {
    utterance.lang = isBengali ? 'bn-IN' : 'en-US';
  }

  utterance.rate = isBengali ? 0.92 : 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    processNextQueueItem();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Utterance speech warning:', e.error);
    }
    processNextQueueItem();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis speak error:', err);
    processNextQueueItem();
  }
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

  // Cancel any ongoing speech
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
