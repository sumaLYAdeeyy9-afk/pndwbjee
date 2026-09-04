import { useState, useRef, useEffect, useCallback } from 'react';
import { WavAudioRecorder } from '../lib/audioRecorder';

/**
 * Clean Voice Audio Recorder Hook
 * Generates 16kHz 16-bit Mono WAV audio for pristine Whisper AI transcription
 */
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);

  const wavRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (wavRecorderRef.current) {
      wavRecorderRef.current.cancel();
      wavRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const updateVolume = () => {
    if (!analyserRef.current || !isRecording) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));

    animFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const startRecording = useCallback(async () => {
    setError(null);
    setDuration(0);
    setVolumeLevel(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio recording is not supported on this browser.');
      }

      // 1. Start Studio 16kHz WAV Recorder
      const recorder = new WavAudioRecorder();
      wavRecorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);

      // 2. Setup visual volume analyzer
      if (recorder.audioContext && recorder.sourceNode) {
        try {
          const analyser = recorder.audioContext.createAnalyser();
          analyser.fftSize = 64;
          recorder.sourceNode.connect(analyser);
          analyserRef.current = analyser;
          animFrameRef.current = requestAnimationFrame(updateVolume);
        } catch (e) {}
      }

      // 3. Duration timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (err) {
      cleanupResources();
      setError(err.message || 'Microphone access was denied or is unavailable.');
      setIsRecording(false);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!wavRecorderRef.current || !isRecording) {
      cleanupResources();
      setIsRecording(false);
      return { audioBlob: null };
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    try {
      const audioBlob = await wavRecorderRef.current.stop();
      wavRecorderRef.current = null;
      setIsRecording(false);
      return { audioBlob };
    } catch (e) {
      cleanupResources();
      setIsRecording(false);
      return { audioBlob: null };
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    cleanupResources();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    duration,
    volumeLevel,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  };
}
