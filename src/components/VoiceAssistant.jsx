import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, Copy, Check, Sparkles, 
  RotateCcw, Loader2, AlertCircle, MessageSquare, Bot, User, 
  HelpCircle, ChevronDown, CheckCircle2, Volume, History, Database
} from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { transcribeAudio, askPdfAssistant, getSavedApiKey, getSavedModel } from '../lib/openai';

const STARTER_QUESTIONS = [
  'Who is eligible for Common Online Decentralised Counselling?',
  'Can already-admitted students participate without losing their seat?',
  'If I take admission in DC Phase 1, is my replacement quota exhausted?',
  'What is the Fee Refund Policy if a student changes college?',
  'Explain the 5 candidate categories (Category I to V)',
  'How does Round 2 Upgradation work in each Phase?',
  'What are the grounds for rejection during document verification?'
];

const STORAGE_KEY = 'wbjee_voice_chat_memory_v1';

const INITIAL_WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: `### Welcome to the Official WBJEE 2026 Counselling Assistant 🎙️\n\nI am powered by **Azure OpenAI (GPT 5.4 Mini)** with the **complete 14-page Revised Decentralised Counselling Notification (No. WBE/EX-56/2026)** and **conversation memory** active.\n\n* 🎙️ **Tap "Speak Query"** below to ask your question by voice.\n* ⚡ **Or click any topic chip** or type your query in the box below.\n* 🧠 **Memory is active**: Your questions and answers are remembered so you can ask follow-ups naturally!`,
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

  // Handle SpeechSynthesis Text-To-Speech
  const handleSpeak = (messageId, text) => {
    if (!window.speechSynthesis) return;

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[#*`_~[\]()]/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
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
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat memory cleared. Tap **Speak Query** or select a topic to ask another question based on the official 14-page notification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Main dispatch query logic with conversational memory and SSE streaming
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

    // Extract all previous dialogue turns to send as conversational memory to AI
    const conversationMemory = messages
      .filter(m => m.content && m.content.trim().length > 0 && !m.isError && !m.id.startsWith('welcome'))
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
      .slice(-20); // Keep past 20 messages for rich conversational context

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
            setStatusState(null); // Clear loading state as soon as first word streams in
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
    const query = typeof textToSend === 'string' ? textToSend : inputQuery;
    if (!query || !query.trim() || statusState) return;

    setInputQuery('');
    processQuery(query.trim(), false);
  };

  // Handle Voice Record Button Click
  const handleToggleRecord = async () => {
    if (isRecording) {
      setStatusState('transcribing');
      try {
        const recordResult = await stopRecording();
        const liveText = recordResult?.liveTranscript;
        const audioBlob = recordResult?.audioBlob;

        // 1. If live transcript was captured by browser speech recognition, use it immediately!
        if (liveText && liveText.trim().length > 0) {
          processQuery(liveText.trim(), true);
          return;
        }

        // 2. Otherwise transcribe audio blob with Whisper API
        if (audioBlob && audioBlob.size > 100) {
          const transcript = await transcribeAudio(audioBlob);
          if (transcript && transcript.trim().length > 0) {
            processQuery(transcript.trim(), true);
            return;
          }
        }

        setMessages(prev => [
          ...prev,
          {
            id: `warn-${Date.now()}`,
            role: 'assistant',
            content: '🎙️ *Could not detect any clear speech. Please try speaking closer to your microphone.*',
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
            content: `⚠️ **Voice Transcription Error:** ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else {
      // Start recording
      try {
        await startRecording();
        setStatusState('recording');
      } catch (err) {
        setStatusState(null);
      }
    }
  };

  const handleCancelRecord = () => {
    cancelRecording();
    setStatusState(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Voice & Chat Document AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
            <Database className="w-3 h-3" />
            <span>Memory Active</span>
          </span>

          <button
            onClick={handleClearChat}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
            title="Clear conversation memory and reset chat"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear Memory</span>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          // If empty streaming placeholder and thinking, don't show empty bubble
          if (msg.role === 'assistant' && !msg.content && statusState === 'thinking') {
            return null;
          }

          const isUser = msg.role === 'user';

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
                    : 'bg-slate-800/90 border border-slate-700/60 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Voice badge */}
                {msg.isVoice && (
                  <div className="inline-flex items-center space-x-1 text-[10px] text-blue-200 mb-1.5 px-2 py-0.5 rounded-full bg-blue-700/50">
                    <Mic className="w-2.5 h-2.5" />
                    <span>Voice Query</span>
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
                    <div className="flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="p-1 hover:text-white rounded hover:bg-slate-700/50 cursor-pointer"
                        title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-white rounded hover:bg-slate-700/50 cursor-pointer"
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

        {/* Live Status Indicators */}
        {statusState === 'thinking' && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-3 text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-200">Analyzing notification & conversation memory...</p>
                <p className="text-[10px] text-slate-400">GPT 5.4 Mini reasoning over 14 pages</p>
              </div>
            </div>
          </div>
        )}

        {statusState === 'transcribing' && (
          <div className="flex items-center justify-center p-3 text-amber-300 bg-amber-950/30 border border-amber-800/40 rounded-xl space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span className="text-xs font-medium">Transcribing voice with Whisper AI...</span>
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
              disabled={statusState !== null || isRecording}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Recording Active Bar */}
      {isRecording && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-t border-red-800/60 p-3 flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <div>
              <p className="text-xs font-bold text-red-200">Listening to your voice...</p>
              <p className="text-[10px] text-red-300">
                Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')} | Level: {Math.round(volumeLevel * 100)}%
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancelRecord}
              className="px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleRecord}
              className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done Speaking</span>
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
              isRecording
                ? 'bg-red-600 text-white animate-pulse shadow-red-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
            title="Ask by voice"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{isRecording ? 'Stop Recording' : 'Speak Query'}</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask question about WBJEE 2026 notification..."
            disabled={statusState !== null || isRecording}
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || statusState !== null || isRecording}
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
