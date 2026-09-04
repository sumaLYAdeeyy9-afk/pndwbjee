import React, { useState, useEffect } from 'react';
import { Key, Shield, Check, AlertCircle, X, ExternalLink, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { getSavedApiKey, saveApiKey, getSavedModel, saveModel, AVAILABLE_MODELS, testOpenAiKey } from '../lib/openai';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [isValidating, setIsValidating] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  useEffect(() => {
    if (isOpen) {
      setApiKey(getSavedApiKey());
      setSelectedModel(getSavedModel());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an OpenAI API key (starts with sk-...)' });
      return;
    }

    setIsValidating(true);
    setTestResult(null);

    try {
      await testOpenAiKey(apiKey.trim());
      saveApiKey(apiKey.trim());
      saveModel(selectedModel);
      setTestResult({ success: true, message: 'API Key verified successfully!' });
      if (onKeySaved) onKeySaved(apiKey.trim(), selectedModel);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Verification failed. Please check your key.' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    saveApiKey('');
    setApiKey('');
    setTestResult({ success: true, message: 'API Key removed.' });
    if (onKeySaved) onKeySaved('', selectedModel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">OpenAI API Configuration</h3>
            <p className="text-xs text-slate-400">Used for Whisper Voice Transcription & GPT Document Q&A</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>OpenAI API Key:</span>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select GPT Model:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AVAILABLE_MODELS.map((m) => (
                <label
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedModel === m.id
                      ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold flex items-center space-x-1.5">
                      <span>{m.name}</span>
                      {m.id === 'gpt-4o-mini' && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-normal">
                          Fast & Accurate
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{m.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                    selectedModel === m.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
                  }`}>
                    {selectedModel === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your API key is stored <strong>locally in your browser</strong> (<code className="text-slate-300">localStorage</code>) and sent directly to official OpenAI endpoints.
            </span>
          </div>

          {/* Validation Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              testResult.success
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 pt-2">
            <button
              type="submit"
              disabled={isValidating}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verify & Save Key</span>
                </>
              )}
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
                title="Remove API Key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
