import { useState, useRef, useEffect, useCallback } from 'react';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const resolvePromiseRef = useRef(null);

  // Browser live speech recognition ref
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

  const startRecording = useCallback(async (preferredLang = 'bn-IN') => {
    setError(null);
    audioChunksRef.current = [];
    liveTranscriptRef.current = '';
    setLiveTranscript('');
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

      // Initialize SpeechRecognition with user's selected language (bn-IN for Bengali)
      try {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionClass) {
          const recognition = new SpeechRecognitionClass();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = preferredLang || 'bn-IN';

          recognition.onresult = (event) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            liveTranscriptRef.current = current;
            setLiveTranscript(current);
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
        resolve({ audioBlob: null, liveTranscript: liveTranscriptRef.current.trim() });
        return;
      }

      resolvePromiseRef.current = resolve;
      try {
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.stop();
        }
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
    setLiveTranscript('');
    audioChunksRef.current = [];
    resolvePromiseRef.current = null;
  }, []);

  return {
    isRecording,
    duration,
    volumeLevel,
    liveTranscript,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  };
}
