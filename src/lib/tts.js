// Text-to-Speech (TTS) Engine with Bengali and English Support

let activeUtterance = null;

/**
 * Get available system voices with preference for Bengali and natural speech
 */
export function getAvailableVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Detect if text contains Bengali characters
 */
export function isBengaliText(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Find the most suitable voice for given language
 */
function findBestVoice(voices, isBengali) {
  if (!voices || voices.length === 0) return null;

  if (isBengali) {
    // Look for Bengali voices
    const bengaliVoice = voices.find(v => 
      (v.lang && (v.lang.toLowerCase().startsWith('bn') || v.lang.toLowerCase().includes('bengali'))) ||
      (v.name && (v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali') || v.name.includes('বাংলা')))
    );
    if (bengaliVoice) return bengaliVoice;
  }

  // Fallback: Look for Indian English or standard natural voice
  const inVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-in'));
  if (inVoice) return inVoice;

  const defaultVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  return defaultVoice || voices[0] || null;
}

/**
 * Clean markdown and symbols for natural audio speech
 */
export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#*~_>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[🎙️⚡🧠✅📌🚀⚠️🔍]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speak text using browser speech synthesis with Bengali & chunking support
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

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    onEnd();
    return () => {};
  }

  const isBengali = isBengaliText(cleaned);
  const voices = getAvailableVoices();
  const voice = findBestVoice(voices, isBengali);

  const utterance = new SpeechSynthesisUtterance(cleaned);
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = isBengali ? (voice?.lang || 'bn-IN') : 'en-IN';
  utterance.rate = isBengali ? 0.95 : 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    onEnd();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('SpeechSynthesis error:', e);
      onError(e);
    }
    activeUtterance = null;
    onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);

  return () => stopSpeech();
}

/**
 * Stop any active audio speech
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
