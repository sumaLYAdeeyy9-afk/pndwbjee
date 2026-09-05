import React, { useState } from 'react';
import { 
  FileText, ExternalLink, Download, Maximize2, Minimize2, 
  BookOpen, ChevronRight, Layers, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { PDF_METADATA } from '../data/pdfContext';

const QUICK_SECTIONS = [
  { clause: '5', title: '5 Eligible Categories', page: 2, summary: 'Category I (Admitted), II (Allotted not admitted), III (Unallotted), IV (Not registered), V (All-India JEE)' },
  { clause: '6', title: 'Registration & ₹250 Fee', page: 3, summary: 'Online registration on participating institute portals with ₹250 non-refundable fee per institute' },
  { clause: '9', title: 'Merit Priority Hierarchy', page: 4, summary: 'Statutory priority order: WBJEE GMR (Tier 1) > JEE Main (Tier 2) > 10+2 HMR (Tier 3)' },
  { clause: '13', title: '2-Round Phase Structure', page: 6, summary: 'Phase 1 allotment followed by Phase 2 institutional vacancy upgradation round' },
  { clause: '14', title: 'Seat Protection Guarantee', page: 7, summary: 'Admitted candidates do NOT surrender seats. Current admission remains 100% safe & protected' },
  { clause: '15', title: 'Physical Verification & Docs', page: 8, summary: 'Physical reporting within institutional window with original domicile and category certificates' },
  { clause: '18', title: 'Fee Refund Policy', page: 11, summary: 'Full refund/adjustment of ₹5,000 SAF and college tuition fees when upgrading colleges' }
];

export default function PdfViewer({ onSelectClause }) {
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
            <span>Official Notification Index:</span>
            <span className="text-indigo-400">14-Page Ground Truth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_SECTIONS.map((sec, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-200 font-bold text-xs">
                  <span>Clause {sec.clause}: {sec.title}</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    Page {sec.page}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {sec.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded PDF Viewer Frame */}
      <div className="flex-1 w-full bg-slate-950 relative overflow-hidden">
        <iframe
          src={`${PDF_METADATA.fileUrl}#view=FitH&toolbar=1&navpanes=1`}
          title="WBJEE 2026 Decentralised Counselling Notification PDF"
          className="w-full h-full border-0"
        />
      </div>

    </div>
  );
}
