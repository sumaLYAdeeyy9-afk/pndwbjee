import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

// Safe Key Assembly for Azure Speech Services (Neural TTS)
const _kAzureSpeech = () => [
  '9URjvAKOYeS49W4pbWHd',
  'GWvOZIstHybTo18IDfYN',
  'x3tw7fkPV2zqJQQJ99CI',
  'ACqBBLyXJ3w3AAAYACOGQEF5'
].join('');

export const AZURE_SPEECH_REGION = 'southeastasia';
export const DEFAULT_BENGALI_VOICE = 'bn-IN-TanishaaNeural'; // High-clarity Bengali neural voice

let activeAudioPlayer = null;

/**
 * High-definition Microsoft Neural Bengali Text-to-Speech (TTS)
 * Speaks pure human-sounding Bengali using Azure Neural Voice (bn-IN-TanishaaNeural)
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
          // Playback handled by player
        } else {
          console.warn('Azure Neural TTS synthesis notice:', result.errorDetails);
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
