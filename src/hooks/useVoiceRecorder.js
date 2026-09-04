import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Clean Voice Audio Recorder Hook (Pure Whisper Audio Capture)
 * Records raw microphone audio stream via MediaRecorder without any local speech engine
 */
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const resolvePromiseRef = useRef(null);

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
    audioChunksRef.current = [];
    setDuration(0);
    setVolumeLevel(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone audio recording is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });
      streamRef.current = stream;

      // Audio analysis for volume wave animation
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('AudioContext analysis not available:', err);
      }

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (resolvePromiseRef.current) {
          resolvePromiseRef.current({ audioBlob });
          resolvePromiseRef.current = null;
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      // Duration counter
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Start volume animation
      if (analyserRef.current) {
        animFrameRef.current = requestAnimationFrame(updateVolume);
      }
    } catch (err) {
      cleanupResources();
      setError(err.message || 'Microphone access was denied or is unavailable.');
      setIsRecording(false);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        cleanupResources();
        setIsRecording(false);
        resolve({ audioBlob: null });
        return;
      }

      resolvePromiseRef.current = resolve;
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error during mediaRecorder stop:', e);
      }

      cleanupResources();
      setIsRecording(false);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    cleanupResources();
    setIsRecording(false);
    audioChunksRef.current = [];
    resolvePromiseRef.current = null;
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
