import React from 'react';
import { FileText, Download, Layers, Sliders, Sparkles, BookOpen } from 'lucide-react';
import { PDF_METADATA } from '../data/pdfContext';

export default function Navbar({
  activeViewTab, // 'flowchart' | 'simulator' | 'dossier' | 'pdf'
  onViewTabChange
}) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate tracking-tight">
                WBJEE 2026 Counselling Simulator
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                Decision Tree
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
              Interactive Flowchart & Scenario Mapper • {PDF_METADATA.documentNumber}
            </p>
          </div>
        </div>

        {/* Center: Main View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onViewTabChange('flowchart')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'flowchart'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flowchart</span>
          </button>

          <button
            onClick={() => onViewTabChange('simulator')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'simulator'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => onViewTabChange('dossier')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'dossier'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Strategy Dossier</span>
            <span className="sm:hidden">Dossier</span>
          </button>

          <button
            onClick={() => onViewTabChange('pdf')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'pdf'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official PDF</span>
          </button>
        </div>

        {/* Right: PDF Quick Download */}
        <div className="hidden sm:flex items-center space-x-2">
          <a
            href={PDF_METADATA.fileUrl}
            download="WBJEE-2026-Decentralised-Counselling-Notification.pdf"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-all shadow-2xs"
            title="Download Official 14-Page Notification PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">PDF</span>
          </a>
        </div>

      </div>
    </header>
  );
}
