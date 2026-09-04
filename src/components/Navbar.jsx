import React from 'react';
import { FileText, Mic, Key, CheckCircle2, AlertCircle, Download, ExternalLink, Sparkles, Settings } from 'lucide-react';
import { PDF_METADATA } from '../data/pdfContext';

export default function Navbar({
  hasApiKey,
  currentModel,
  onOpenSettings,
  activeTab,
  onTabChange
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Document Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black text-white truncate tracking-tight">
                WBJEE 2026 Counselling AI
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                14 Pages
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {PDF_METADATA.title} ({PDF_METADATA.documentNumber})
            </p>
          </div>
        </div>

        {/* Center: Mobile Tabs Switcher */}
        <div className="flex lg:hidden bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('pdf')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice AI</span>
          </button>
        </div>

        {/* Right: Actions & API Key status */}
        <div className="flex items-center space-x-2.5">
          
          <a
            href={PDF_METADATA.fileUrl}
            download="WBJEE-2026-Decentralised-Counselling-Notification.pdf"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download</span>
          </a>

          {/* API Key Pill */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              hasApiKey
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/30 animate-pulse'
            }`}
            title="Configure OpenAI API Key"
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">OpenAI Connected</span>
                <span className="sm:hidden">Ready</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>Connect API Key</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Settings & Model Selection"
          >
            <Settings className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}
