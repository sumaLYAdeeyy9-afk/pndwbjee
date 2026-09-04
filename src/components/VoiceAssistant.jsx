import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, Copy, Check, Sparkles, 
  RotateCcw, Loader2, AlertCircle, MessageSquare, Bot, User, 
  HelpCircle, ChevronDown, CheckCircle2, Volume
} from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { transcribeAudio, askPdfAssistant, getSavedApiKey, getSavedModel } from '../lib/openai';

const STARTER_QUESTIONS = [
  'Who is eligible for Common Online Decentralised Counselling?',
  'Can already-admitted students participate without losing their seat?',
  'What is the Fee Refund Policy if a student changes college?',
  'Explain the 5 candidate categories (Category I to V)',
  'How does Round 2 Upgradation work in each Phase?',
  'What are the grounds for rejection during document verification?'
];

export default function VoiceAssistant({ onOpenSettings, defaultQuery }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to the Official WBJEE 2026 Counselling Assistant 🎙️\n\nI have the **complete 14-page Revised Decentralised Counselling Notification (No. WBE/EX-56/2026)** loaded in memory.\n\n* **Tap the Microphone** below to ask your question by voice.\n* **Or click any topic chip** or type your query in the box below.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [statusState, setStatusState] = useState(null); // 'recording' | 'transcribing' | 'thinking' | null
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [currentModel, setCurrentModel] = useState(() => getSavedModel());

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
    // Clean markdown symbols for cleaner TTS speech
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

  // Clear chat
  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. Tap the **Microphone** or select a topic to ask another question based on the official 14-page notification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Main dispatch query logic
  const processQuery = async (queryText, isVoice = false) => {
    const apiKey = getSavedApiKey();
    if (!apiKey) {
      onOpenSettings();
      return;
    }

    const userMsgId = `user-${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: queryText,
      isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setStatusState('thinking');

    try {
      const assistantMsgId = `assistant-${Date.now()}`;
      
      const answer = await askPdfAssistant({
        messages: messages.slice(-6), // context window
        question: queryText,
        apiKey,
        model: getSavedModel()
      });

      const assistantMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error Processing Request:**\n\n${err.message || 'Could not connect to OpenAI API.'}\n\nPlease check your API key in **Settings**.`,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
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
    const apiKey = getSavedApiKey();
    if (!apiKey) {
      onOpenSettings();
      return;
    }

    if (isRecording) {
      // User tapped stop recording -> transcribe audio
      setStatusState('transcribing');
      try {
        const audioBlob = await stopRecording();
        if (!audioBlob || audioBlob.size < 100) {
          setStatusState(null);
          return;
        }

        const transcript = await transcribeAudio(audioBlob, apiKey);
        if (!transcript || !transcript.trim()) {
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
          return;
        }

        // Successfully transcribed! Send to GPT
        processQuery(transcript.trim(), true);
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

        <button
          onClick={handleClearChat}
          className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md space-y-2 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none'
                  : msg.isError
                  ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-tl-none'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {/* Voice indicator badge on user message */}
              {msg.isVoice && (
                <div className="flex items-center space-x-1 text-[10px] font-semibold text-indigo-200 bg-indigo-950/60 px-2 py-0.5 rounded-full w-fit">
                  <Mic className="w-3 h-3" />
                  <span>Spoken Query (Whisper)</span>
                </div>
              )}

              {/* Message Body with Markdown */}
              <div className="prose prose-invert prose-xs max-w-none leading-relaxed space-y-2">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-xs" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-indigo-300 mt-2 mb-1" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-xs font-bold text-indigo-200 mt-2 mb-1" {...props} />,
                    code: ({ node, inline, ...props }) => (
                      <code className="bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px] text-indigo-300" {...props} />
                    )
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Message Footer: Timestamp, TTS, Copy */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>

                {msg.role === 'assistant' && !msg.isError && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                        speakingId === msg.id ? 'text-indigo-400 font-bold animate-pulse' : 'hover:text-white'
                      }`}
                      title={speakingId === msg.id ? 'Stop Voice' : 'Listen Aloud'}
                    >
                      {speakingId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{speakingId === msg.id ? 'Stop' : 'Read'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Status indicator when thinking or transcribing */}
        {statusState === 'transcribing' && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transcribing your voice with OpenAI Whisper...</span>
          </div>
        )}

        {statusState === 'thinking' && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-xs animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Analyzing notification rules & formulating answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Quick Topics Chips */}
      <div className="px-3.5 py-2 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto shrink-0 flex items-center space-x-1.5 no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Quick:</span>
        </span>
        {STARTER_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendText(q)}
            disabled={Boolean(statusState)}
            className="text-[11px] whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Interactive Bottom Control Bar */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 shrink-0 space-y-3">
        
        {/* Active Recording State Banner */}
        {isRecording ? (
          <div className="bg-rose-950/80 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
            
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center animate-bounce shadow-lg shadow-rose-600/50 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>Listening to your voice...</span>
                  <span className="text-rose-400 font-mono text-xs">
                    00:{duration < 10 ? `0${duration}` : duration}
                  </span>
                </div>
                {/* Audio visualizer bar */}
                <div className="w-32 sm:w-44 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-75"
                    style={{ width: `${Math.max(10, volumeLevel)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleCancelRecord}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleRecord}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>

          </div>
        ) : (
          /* Normal Voice & Text Input Layout */
          <div className="flex items-center space-x-2">
            
            {/* Big Voice Microphone Button */}
            <button
              type="button"
              onClick={handleToggleRecord}
              disabled={Boolean(statusState)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title="Speak Question into Microphone (Transcribed by Whisper)"
            >
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span className="hidden sm:inline">Speak Query</span>
            </button>

            {/* Text Input Box */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
                placeholder="Or type a question about rules, fee refund, schedule..."
                disabled={Boolean(statusState)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all pr-9 disabled:opacity-50"
              />
              
              <button
                type="button"
                onClick={() => handleSendText()}
                disabled={!inputQuery.trim() || Boolean(statusState)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-30 cursor-pointer"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
