import { useState, useRef, useEffect, useCallback } from 'react';

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

  // Browser live speech recognition ref for zero-latency fallback
  const speechRecognitionRef = useRef(null);
  const liveTranscriptRef = useRef('');

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
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      speechRecognitionRef.current = null;
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
    liveTranscriptRef.current = '';
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
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // Initialize speech recognition if supported
      try {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionClass) {
          const recognition = new SpeechRecognitionClass();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            liveTranscriptRef.current = current;
          };

          recognition.onerror = (e) => {
            console.warn('SpeechRecognition notice:', e.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        }
      } catch (e) {
        console.warn('Browser SpeechRecognition not active:', e);
      }

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
          resolvePromiseRef.current({
            audioBlob,
            liveTranscript: liveTranscriptRef.current.trim()
          });
          resolvePromiseRef.current = null;
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      if (analyserRef.current) {
        animFrameRef.current = requestAnimationFrame(updateVolume);
      }

    } catch (err) {
      cleanupResources();
      setIsRecording(false);
      let message = err.message || 'Could not access microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Microphone permission was denied. Please allow microphone access in your browser.';
      }
      setError(message);
      throw new Error(message);
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }

      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        const transcript = liveTranscriptRef.current.trim();
        cleanupResources();
        setIsRecording(false);
        resolve({ audioBlob: null, liveTranscript: transcript });
        return;
      }

      resolvePromiseRef.current = resolve;
      mediaRecorderRef.current.stop();
      cleanupResources();
      setIsRecording(false);
      setVolumeLevel(0);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    cleanupResources();
    setIsRecording(false);
    audioChunksRef.current = [];
    liveTranscriptRef.current = '';
    setVolumeLevel(0);
    setDuration(0);
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
