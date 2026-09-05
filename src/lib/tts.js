// Exclusive Sarvam AI (Bulbul:v3) Text-to-Speech (TTS) Engine
// ALL OTHER TTS ENGINES HAVE BEEN REMOVED PER EXPLICIT DIRECTIVE.
import { speakWithSarvamAI, stopSarvamSpeech } from './sarvamTts';

/**
 * Unlock / Prime audio playback on user gesture
 */
export function unlockSpeech() {
  // Primed for HTML5 Audio playback on iOS/Chrome/Safari
}

/**
 * Speak text exclusively using Sarvam AI Bulbul:v3
 */
export function speakText(text, options = {}) {
  const {
    speaker = 'shreya', // 'shreya' (natural Bengali female voice) or 'soham' (Bengali male voice)
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  } = options;

  stopSpeech();

  if (!text || !text.trim()) {
    onEnd();
    return () => {};
  }

  console.log('[TTS Engine] Triggering Sarvam AI (Bulbul:v3)...');

  // Exclusively call Sarvam AI. No browser or third-party fallback.
  speakWithSarvamAI(text, {
    speaker,
    onStart: () => {
      console.log('[TTS Engine] Sarvam AI audio is now PLAYING.');
      onStart();
    },
    onEnd: () => {
      console.log('[TTS Engine] Sarvam AI audio FINISHED.');
      onEnd();
    },
    onError: (err) => {
      console.error('[TTS Engine] Sarvam AI synthesis failed:', err);
      onError(err);
    }
  });

  return () => stopSpeech();
}

/**
 * Stop any active Sarvam AI speech
 */
export function stopSpeech() {
  stopSarvamSpeech();
}
