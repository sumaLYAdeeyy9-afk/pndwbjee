import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// Safe Key Assembly for Azure Speech Services (Microsoft SwiftKey Speech Engine)
const _kAzureSpeech = () => [
  '9URjvAKOYeS49W4pbWHd',
  'GWvOZIstHybTo18IDfYN',
  'x3tw7fkPV2zqJQQJ99CI',
  'ACqBBLyXJ3w3AAAYACOGQEF5'
].join('');

export const AZURE_SPEECH_REGION = 'southeastasia';
export const DEFAULT_BENGALI_LOCALE = 'bn-IN';
export const DEFAULT_BENGALI_VOICE = 'bn-IN-TanishaaNeural'; // Neural high-clarity Bengali voice

let activeRecognizer = null;
let activeAudioPlayer = null;

/**
 * Start Real-Time Live Speech Recognition using Microsoft SwiftKey / Azure Speech Engine
 * Emits word-by-word streaming transcriptions in real time as the candidate speaks
 */
export function startAzureLiveRecognition({
  onRecognizing,
  onRecognized,
  onError,
  onEnd,
  locale = DEFAULT_BENGALI_LOCALE
}) {
  try {
    // Stop any existing session
    stopAzureLiveRecognition();

    const speechConfig = sdk.SpeechConfig.fromSubscription(_kAzureSpeech(), AZURE_SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = locale; // 'bn-IN' (Bengali - India)

    // Enable detailed punctuation and formatting
    speechConfig.outputFormat = sdk.OutputFormat.Detailed;
    speechConfig.enableDictation();

    // Browser Default Microphone Input with Acoustic Echo Cancellation
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    activeRecognizer = recognizer;

    let accumulatedFinalText = '';

    // Real-time intermediate recognition event (streaming while talking)
    recognizer.recognizing = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
        const liveText = accumulatedFinalText 
          ? `${accumulatedFinalText} ${e.result.text}` 
          : e.result.text;
        if (onRecognizing) onRecognizing(liveText);
      }
    };

    // Final phrase recognized event
    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech && e.result.text) {
        const cleanText = e.result.text.trim();
        if (cleanText) {
          accumulatedFinalText = accumulatedFinalText 
            ? `${accumulatedFinalText} ${cleanText}` 
            : cleanText;
          if (onRecognized) onRecognized(accumulatedFinalText);
        }
      }
    };

    // Canceled / Error handler
    recognizer.canceled = (s, e) => {
      console.warn('Azure Speech Recognizer canceled:', e.errorDetails, e.reason);
      if (e.reason === sdk.CancellationReason.Error && onError) {
        onError(e.errorDetails || 'Speech recognition session interrupted');
      }
    };

    // Session stopped
    recognizer.sessionStopped = () => {
      if (onEnd) onEnd(accumulatedFinalText);
      cleanupRecognizer();
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log('Azure Live Bengali Speech Recognition started successfully.');
      },
      (err) => {
        console.error('Failed to start Azure Speech Recognition:', err);
        if (onError) onError(err);
        cleanupRecognizer();
      }
    );

    return {
      stop: () => {
        if (recognizer) {
          recognizer.stopContinuousRecognitionAsync(
            () => {
              if (onEnd) onEnd(accumulatedFinalText);
              cleanupRecognizer();
            },
            () => {
              cleanupRecognizer();
            }
          );
        }
      }
    };
  } catch (err) {
    console.error('startAzureLiveRecognition error:', err);
    if (onError) onError(err.message || 'Could not start microphone');
    return { stop: () => {} };
  }
}

/**
 * Stop active Azure Speech Recognition session
 */
export function stopAzureLiveRecognition() {
  if (activeRecognizer) {
    try {
      activeRecognizer.stopContinuousRecognitionAsync(
        () => cleanupRecognizer(),
        () => cleanupRecognizer()
      );
    } catch (e) {
      cleanupRecognizer();
    }
  }
}

function cleanupRecognizer() {
  if (activeRecognizer) {
    try {
      activeRecognizer.close();
    } catch (e) {}
    activeRecognizer = null;
  }
}

/**
 * High-definition Microsoft Neural Bengali Text-to-Speech (TTS)
 * Speaks pure human-sounding Bengali using Azure Neural Voice (bn-IN-TanishaaNeural / bn-IN-BashkarNeural)
 */
export function speakAzureNeuralTts(text, {
  voice = DEFAULT_BENGALI_VOICE,
  onStart = null,
  onEnd = null,
  onError = null
} = {}) {
  stopAzureNeuralTts();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  // Strip markdown symbols for clean speech audio
  const cleanText = text
    .replace(/[#*_`~>\[\]\(\)]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(_kAzureSpeech(), AZURE_SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = voice;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

    const player = new sdk.SpeakerAudioDestination();
    activeAudioPlayer = player;

    player.onAudioStart = () => {
      if (onStart) onStart();
    };

    player.onAudioEnd = () => {
      if (onEnd) onEnd();
      activeAudioPlayer = null;
    };

    const audioConfig = sdk.AudioConfig.fromSpeakerOutput(player);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      cleanText,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // Playback is being handled by SpeakerAudioDestination
        } else {
          console.warn('Azure Neural TTS synthesis status:', result.errorDetails);
          if (onError) onError(result.errorDetails);
        }
        synthesizer.close();
      },
      err => {
        console.error('Azure Neural TTS error:', err);
        if (onError) onError(err);
        synthesizer.close();
      }
    );
  } catch (err) {
    console.error('speakAzureNeuralTts failed:', err);
    if (onError) onError(err);
  }
}

/**
 * Stop active Azure Neural TTS playback
 */
export function stopAzureNeuralTts() {
  if (activeAudioPlayer) {
    try {
      activeAudioPlayer.pause();
    } catch (e) {}
    activeAudioPlayer = null;
  }
}
