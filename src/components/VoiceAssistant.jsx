import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, Copy, Check, Sparkles, 
  RotateCcw, Loader2, Bot, User, Radio, Cpu, Settings2, Globe, Zap
} from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { transcribeAudio, askPdfAssistant, getSavedApiKey, getSavedModel } from '../lib/openai';
import { transcribeWithDeepgram } from '../lib/deepgram';
import { speakText, stopSpeech, unlockSpeech } from '../lib/tts';

const STARTER_QUESTIONS = [
  'Who is eligible for Common Online Decentralised Counselling?',
  'ডিসি ফেজ ১ এ ভর্তি হলে কি রিপ্লেসমেন্ট কোটা শেষ হবে?',
  'Can already-admitted students participate without losing their seat?',
  'What is the Fee Refund Policy if a student changes college?',
  'ক্যাটেগরি ১ থেকে ৫ এর নিয়মগুলি সহজ ভাষায় বুঝিয়ে বলুন',
  'How does Round 2 Upgradation work in each Phase?',
  'ডকুমেন্ট ভেরিফিকেশনে কী কী কারণে বাতিল হতে পারে?'
];

const STORAGE_KEY = 'wbjee_voice_chat_memory_v1';
const STT_MODE_KEY = 'wbjee_stt_mode_v4';

const STT_MODES = [
  { id: 'deepgram-bn', label: '🚀 Deepgram Nova-3 (বাংলা)', desc: 'Deepgram Nova-3 Flagship - Ultra Fast & High Precision Bengali STT' },
  { id: 'deepgram-auto', label: '🌐 Deepgram Nova-3 (Auto/EN)', desc: 'Deepgram Nova-3 - Multilingual / English Detection' },
  { id: 'whisper-bn', label: '🎙️ Whisper Large v3 (বাংলা)', desc: 'OpenAI Whisper Large v3 - Pure Bengali Script' },
  { id: 'browser-bn', label: '⚡ Google Bengali Engine', desc: 'Browser Real-Time Bengali Engine' }
];

const INITIAL_WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: `### Official WBJEE 2026 Counselling Assistant 🎙️\n\n* 🎙️ **Speech-to-Text (STT)**: Powered by **Deepgram Nova-3 AI** (Flagship multilingual Bengali acoustic architecture with ~200ms latency).\n* 🤖 **Reasoning Intelligence**: Powered by **Azure GPT-5.4 Mini** with the full 14-page official notification ground truth.\n* 🔊 **Voice Speech (TTS)**: High-definition voice output in pure Bengali & English.\n* 🧠 **Chat Memory**: Full conversational memory across multiple turns and questions.\n\nTap **Speak (Deepgram AI)** to talk or type your query below!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function VoiceAssistant({ defaultQuery }) {
  // Load conversation history from localStorage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e);
    }
    return [INITIAL_WELCOME];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [statusState, setStatusState] = useState(null); // 'recording' | 'transcribing' | 'thinking' | null
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [autoVoiceTts, setAutoVoiceTts] = useState(true); // Auto-read answers with TTS
  
  // STT Mode Selection (Default to Deepgram Nova-3 Bengali)
  const [sttMode, setSttMode] = useState(() => {
    try {
      return localStorage.getItem(STT_MODE_KEY) || 'deepgram-bn';
    } catch (e) {
      return 'deepgram-bn';
    }
  });

  // Browser Speech Recognition ref
  const [isBrowserListening, setIsBrowserListening] = useState(false);
  const browserRecognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const { 
    isRecording, 
    duration, 
    volumeLevel, 
    error: recorderError, 
    startRecording, 
    stopRecording, 
    cancelRecording 
  } = useVoiceRecorder();

  // Persist conversation history to localStorage on update
  useEffect(() => {
    try {
      const validMessages = messages.filter(m => m.content && m.content.trim().length > 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validMessages));
    } catch (e) {
      console.warn('Failed to persist chat memory to localStorage', e);
    }
  }, [messages]);

  // Persist STT mode choice
  useEffect(() => {
    try {
      localStorage.setItem(STT_MODE_KEY, sttMode);
    } catch (e) {}
  }, [sttMode]);

  // Clean up all speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (browserRecognitionRef.current) {
        try {
          browserRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusState]);

  // If defaultQuery is triggered externally
  useEffect(() => {
    if (defaultQuery && defaultQuery.trim().length > 0) {
      handleSendText(defaultQuery);
    }
  }, [defaultQuery]);

  // Toggle TTS audio playback for a message
  const handleToggleSpeak = (messageId, text) => {
    unlockSpeech();
    if (speakingId === messageId) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    stopSpeech();
    setSpeakingId(messageId);
    speakText(text, {
      onStart: () => setSpeakingId(messageId),
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  // Copy message text
  const handleCopy = (messageId, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Clear chat memory
  const handleClearChat = () => {
    stopSpeech();
    setSpeakingId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat memory cleared. Tap **Speak (Deepgram AI)** or select a topic below to ask another question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Main dispatch query logic with conversational memory, SSE streaming and TTS
  const processQuery = async (queryText, isVoice = false) => {
    const userMsgId = `user-${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: queryText,
      isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Extract previous dialogue turns for conversational memory
    const conversationMemory = messages
      .filter(m => m.content && m.content.trim().length > 0 && !m.isError && !m.id.startsWith('welcome'))
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
      .slice(-20);

    setMessages(prev => [...prev, userMessage, initialAssistantMsg]);
    setStatusState('thinking');

    try {
      let streamed = false;

      const finalAnswer = await askPdfAssistant({
        messages: conversationMemory,
        question: queryText,
        apiKey: getSavedApiKey(),
        model: getSavedModel(),
        onChunk: (accumulatedText) => {
          if (!streamed) {
            streamed = true;
            setStatusState(null); // Clear loading state as soon as first word arrives
          }
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
            )
          );
        }
      });

      // Ensure final state is saved cleanly
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId ? { ...m, content: finalAnswer } : m
        )
      );

      // Speak response using TTS if voice query or autoVoiceTts is enabled
      if (finalAnswer && (isVoice || autoVoiceTts)) {
        setSpeakingId(assistantMsgId);
        speakText(finalAnswer, {
          onStart: () => setSpeakingId(assistantMsgId),
          onEnd: () => setSpeakingId(null),
          onError: () => setSpeakingId(null)
        });
      }
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: `⚠️ **Error:** ${err.message || 'Could not connect to AI service. Please try again.'}`,
                isError: true
              }
            : m
        )
      );
    } finally {
      setStatusState(null);
    }
  };

  // Handle Manual Text Submission
  const handleSendText = (textToSend) => {
    unlockSpeech();
    const query = typeof textToSend === 'string' ? textToSend : inputQuery;
    if (!query || !query.trim() || statusState) return;

    setInputQuery('');
    processQuery(query.trim(), false);
  };

  // 1. Google Browser Speech Recognition Engine
  const handleToggleBrowserSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser speech recognition is not supported in this browser. Switching to Deepgram Nova-3.');
      setSttMode('deepgram-bn');
      return;
    }

    if (isBrowserListening) {
      if (browserRecognitionRef.current) {
        try {
          browserRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsBrowserListening(false);
      setStatusState(null);
      return;
    }

    try {
      stopSpeech();
      const recognition = new SpeechRecognition();
      browserRecognitionRef.current = recognition;
      recognition.lang = 'bn-IN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let recognizedText = '';

      recognition.onstart = () => {
        setIsBrowserListening(true);
        setStatusState('recording');
      };

      recognition.onresult = (event) => {
        if (event.results && event.results.length > 0) {
          recognizedText = event.results[0][0].transcript;
        }
      };

      recognition.onerror = (event) => {
        console.warn('Browser Speech Recognition error:', event.error);
        setIsBrowserListening(false);
        setStatusState(null);
        if (event.error !== 'no-speech') {
          setMessages(prev => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: 'assistant',
              content: `⚠️ **Browser Speech Error:** ${event.error}. You can switch to Deepgram Nova-3 mode above.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      };

      recognition.onend = () => {
        setIsBrowserListening(false);
        setStatusState(null);
        if (recognizedText && recognizedText.trim().length > 0) {
          processQuery(recognizedText.trim(), true);
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Browser speech recognition start error:', e);
      setIsBrowserListening(false);
      setStatusState(null);
    }
  };

  // 2. Deepgram Nova-3 / Whisper Audio Capture Handler
  const handleToggleAudioRecord = async () => {
    if (isRecording) {
      setStatusState('transcribing');
      stopSpeech();
      try {
        const recordResult = await stopRecording();
        const audioBlob = recordResult?.audioBlob;

        if (!audioBlob || audioBlob.size < 100) {
          setStatusState(null);
          setMessages(prev => [
            ...prev,
            {
              id: `warn-${Date.now()}`,
              role: 'assistant',
              content: '🎙️ *কোনো অডিও রেকর্ড করা যায়নি। অনুগ্রহ করে মাইক্রোফোনে কথা বলুন।* (No audio captured. Please speak again.)',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          return;
        }

        let recognizedTranscript = '';

        if (sttMode.startsWith('deepgram')) {
          const lang = sttMode === 'deepgram-auto' ? 'multi' : 'bn';
          recognizedTranscript = await transcribeWithDeepgram(audioBlob, { language: lang });
        } else {
          recognizedTranscript = await transcribeAudio(audioBlob, { mode: sttMode });
        }

        if (recognizedTranscript && recognizedTranscript.trim().length > 0) {
          processQuery(recognizedTranscript.trim(), true);
          return;
        }

        setMessages(prev => [
          ...prev,
          {
            id: `warn-${Date.now()}`,
            role: 'assistant',
            content: '🎙️ *কোনো স্পষ্ট কথা শনাক্ত করতে পারেনি। অনুগ্রহ করে মাইক্রোফোনের কাছে এসে আবার বলুন।* (Could not detect clear speech in the audio. Please speak clearly into your mic.)',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setStatusState(null);
      } catch (err) {
        setStatusState(null);
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Speech Recognition Error:** ${err.message || 'Audio transcription could not be completed.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else {
      stopSpeech();
      try {
        await startRecording();
        setStatusState('recording');
      } catch (err) {
        setStatusState(null);
      }
    }
  };

  // Master Voice Trigger Button Dispatcher
  const handleToggleRecord = () => {
    unlockSpeech();
    if (sttMode === 'browser-bn') {
      handleToggleBrowserSpeech();
    } else {
      handleToggleAudioRecord();
    }
  };

  const handleCancelRecord = () => {
    if (sttMode === 'browser-bn') {
      if (browserRecognitionRef.current) {
        try {
          browserRecognitionRef.current.abort();
        } catch (e) {}
      }
      setIsBrowserListening(false);
    } else {
      cancelRecording();
    }
    setStatusState(null);
  };

  const isCurrentlyRecording = isRecording || isBrowserListening;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Header */}
      <div className="bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>WBJEE 2026 AI Counsellor</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                GPT 5.4 Mini
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              14-Page Official Notification Knowledgebase
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center space-x-2">
          {/* STT Mode Selector Pill */}
          <div className="flex items-center space-x-1 bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
            <select
              value={sttMode}
              onChange={(e) => setSttMode(e.target.value)}
              className="bg-transparent text-[11px] text-slate-200 font-medium py-1 px-1.5 outline-none cursor-pointer"
              title="Select Speech Recognition Engine Mode"
            >
              {STT_MODES.map(m => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-TTS Toggle */}
          <button
            onClick={() => {
              if (speakingId) stopSpeech();
              setAutoVoiceTts(prev => !prev);
            }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
              autoVoiceTts
                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Toggle Auto Text-To-Speech audio readout"
          >
            {autoVoiceTts ? <Volume2 className="w-3 h-3 text-indigo-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
            <span className="hidden sm:inline">TTS {autoVoiceTts ? 'ON' : 'OFF'}</span>
          </button>

          {/* Clear Memory */}
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
            title="Clear conversation memory and reset chat"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          if (msg.role === 'assistant' && !msg.content && statusState === 'thinking') {
            return null;
          }

          const isUser = msg.role === 'user';
          const isCurrentlySpeaking = speakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-blue-600'
                    : msg.isError
                    ? 'bg-red-600'
                    : 'bg-indigo-600'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Box */}
              <div
                className={`group relative max-w-[85%] rounded-2xl p-3.5 text-slate-200 leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.isError
                    ? 'bg-red-950/50 border border-red-800/50 text-red-200 rounded-tl-none'
                    : isCurrentlySpeaking
                    ? 'bg-slate-800 border-2 border-indigo-500/70 rounded-tl-none shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/90 border border-slate-700/60 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Voice badge */}
                {msg.isVoice && (
                  <div className="inline-flex items-center space-x-1 text-[10px] text-blue-200 mb-1.5 px-2 py-0.5 rounded-full bg-blue-700/50">
                    <Mic className="w-2.5 h-2.5" />
                    <span>Voice Input (Deepgram AI)</span>
                  </div>
                )}

                {/* Speaking Audio Banner */}
                {isCurrentlySpeaking && (
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-indigo-300 mb-2 px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 animate-pulse">
                    <Volume2 className="w-3 h-3 text-indigo-400" />
                    <span>Reading out loud (TTS)...</span>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-xs max-w-none break-words text-slate-100 leading-normal">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Footer / Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>

                  {!isUser && msg.content && !msg.isError && (
                    <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`p-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
                          isCurrentlySpeaking
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'hover:text-white hover:bg-slate-700/60 text-slate-300'
                        }`}
                        title={isCurrentlySpeaking ? 'Stop reading' : 'Read aloud with Bengali/English TTS'}
                      >
                        {isCurrentlySpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-white" />
                            <span className="text-[10px]">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">Listen</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1.5 hover:text-white rounded hover:bg-slate-700/60 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dynamic Status Badges */}
        {statusState === 'transcribing' && (
          <div className="flex items-center justify-center p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-x-2 text-emerald-300 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Deepgram Nova-3 transcribing Bengali speech (~200ms)...</span>
          </div>
        )}

        {statusState === 'thinking' && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white shadow-md">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700/60 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-200">Analyzing 14-page notification & memory...</p>
                <p className="text-[10px] text-slate-400">Azure GPT-5.4 Mini reasoning in pure Bengali / English</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Carousel */}
      <div className="bg-slate-950/70 border-t border-slate-800 px-3 py-2 shrink-0">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center space-x-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Topics:</span>
          </span>
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(q)}
              disabled={statusState !== null || isCurrentlyRecording}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Recording Active Bar */}
      {isCurrentlyRecording && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-t border-emerald-800/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-200">
                🎙️ কথা বলুন ({sttMode.startsWith('deepgram') ? 'Deepgram Nova-3' : sttMode === 'browser-bn' ? 'Google Bengali Engine' : 'Whisper Large v3'} Active)...
              </p>
              <p className="text-[10px] text-emerald-300">
                {sttMode === 'browser-bn' ? 'Listening live in Bengali...' : `Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} | Level: ${Math.round(volumeLevel * 100)}%`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleCancelRecord}
              className="px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleRecord}
              className="px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Transcribe & Send</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText();
          }}
          className="flex items-center space-x-2"
        >
          {/* Big Voice Microphone Button */}
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={statusState === 'transcribing' || statusState === 'thinking'}
            className={`px-3.5 py-2.5 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 ${
              isCurrentlyRecording
                ? 'bg-emerald-600 text-white animate-pulse shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
            title="Ask question by Voice (Deepgram AI)"
          >
            {isCurrentlyRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isCurrentlyRecording ? 'Stop & Send' : 'Speak (Deepgram AI)'}
            </span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="বাংলায় বা ইংরেজিতে প্রশ্ন লিখুন (e.g., ডিসি ফেজ ১ এ সিট নিলে কি হবে?)..."
            disabled={statusState !== null || isCurrentlyRecording}
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || statusState !== null || isCurrentlyRecording}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
