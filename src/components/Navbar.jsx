import React from 'react';
import { FileText, Download, Layers, Sliders, Sparkles, BookOpen } from 'lucide-react';
import { PDF_METADATA } from '../data/pdfContext';

export default function Navbar({
  activeViewTab, // 'flowchart' | 'simulator' | 'dossier' | 'pdf'
  onViewTabChange
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Document Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-500 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black text-white truncate tracking-tight">
                WBJEE 2026 DC Simulation Engine
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                Official Flowchart
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              Mapped Decision Tree & Strategy Analyzer • {PDF_METADATA.documentNumber}
            </p>
          </div>
        </div>

        {/* Center: Main View Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onViewTabChange('flowchart')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'flowchart'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flowchart</span>
          </button>

          <button
            onClick={() => onViewTabChange('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => onViewTabChange('dossier')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'dossier'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Strategy Dossier</span>
            <span className="sm:hidden">Dossier</span>
          </button>

          <button
            onClick={() => onViewTabChange('pdf')}
            className={`lg:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeViewTab === 'pdf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

        {/* Right: PDF Action */}
        <div className="hidden sm:flex items-center space-x-2">
          <a
            href={PDF_METADATA.fileUrl}
            download="WBJEE-2026-Decentralised-Counselling-Notification.pdf"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
            title="Download Official 14-Page Notification PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Download PDF</span>
          </a>
        </div>

      </div>
    </header>
  );
}
