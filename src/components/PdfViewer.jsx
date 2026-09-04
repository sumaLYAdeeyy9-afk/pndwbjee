import React, { useState } from 'react';
import { 
  FileText, ExternalLink, Download, Maximize2, Minimize2, 
  BookOpen, ChevronRight, Sparkles, Layers, ShieldCheck, HelpCircle
} from 'lucide-react';
import { PDF_METADATA } from '../data/pdfContext';

const QUICK_SECTIONS = [
  { clause: '5', title: '5 Eligible Categories', page: 2, query: 'Explain the 5 candidate categories (Category I to V) under Clause 5' },
  { clause: '6', title: 'Registration & Rs 250 Fee', page: 3, query: 'What is the registration process and fee under Clause 6?' },
  { clause: '9', title: 'Merit Priority Hierarchy', page: 4, query: 'How does the merit rank source priority work (WBJEE vs JEE Main vs HMR)?' },
  { clause: '13', title: '2-Round Phase Structure', page: 6, query: 'How does the 2-Round structure and upgradation work in Clause 13?' },
  { clause: '14', title: 'Seat Protection Guarantee', page: 7, query: 'How is an existing admission protected under Clause 14?' },
  { clause: '15', title: 'Document Verification & Rejection', page: 8, query: 'What are the grounds for institutional rejection under Clause 15?' },
  { clause: '18', title: 'Fee Refund Policy & Rules', page: 11, query: 'What is the exact Fee Refund policy when changing colleges under Clause 18?' }
];

export default function PdfViewer({ onAskQuestion }) {
  const [showSections, setShowSections] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950' : 'relative'
    }`}>
      
      {/* Container Header Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate flex items-center space-x-2">
              <span>Official Notification PDF</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                14 Pages
              </span>
            </h2>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          
          <button
            onClick={() => setShowSections(!showSections)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showSections
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Browse key clauses and sections"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Key Clauses</span>
          </button>

          <a
            href={PDF_METADATA.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Open PDF in Full Browser Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={PDF_METADATA.fileUrl}
            download="WBJEE_2026_Notification.pdf"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen PDF'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

        </div>

      </div>

      {/* Key Clauses Quick Jump Drawer */}
      {showSections && (
        <div className="bg-slate-950/95 border-b border-slate-800 p-3.5 space-y-2 animate-fade-in text-xs shrink-0 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <span>Quick Index & 1-Tap AI Explanations:</span>
            <span className="text-indigo-400">Click any clause to ask AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_SECTIONS.map((sec) => (
              <button
                key={sec.clause}
                onClick={() => {
                  if (onAskQuestion) onAskQuestion(sec.query);
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    §{sec.clause}
                  </span>
                  <span className="font-semibold text-slate-200 group-hover:text-white text-xs">
                    {sec.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-indigo-300 text-[11px]">
                  <span>P.{sec.page}</span>
                  <Sparkles className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Embedded PDF Viewer Frame */}
      <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden">
        <iframe
          src={`${PDF_METADATA.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
          title="WBJEE 2026 Revised Decentralised Counselling Notification PDF"
          className="w-full h-full border-0"
        />
      </div>

    </div>
  );
}
