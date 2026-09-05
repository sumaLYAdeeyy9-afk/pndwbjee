import React, { useState } from 'react';
import { 
  FLOWCHART_NODES, 
  FLOWCHART_EDGES 
} from '../data/flowchartData';
import { 
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, 
  ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, 
  Layers, Info, FileText, Sparkles, BookOpen, ExternalLink 
} from 'lucide-react';

export default function FlowchartViewer({
  simulationResult,
  selectedNodeId,
  onSelectNode
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModalNode, setActiveModalNode] = useState(null);

  const activeNodesSet = new Set(simulationResult?.activeNodes || []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomLevel(1);

  const openNodeDetails = (node) => {
    setActiveModalNode(node);
    if (onSelectNode) onSelectNode(node.id);
  };

  const getNodeColorClasses = (node, isActive) => {
    if (!isActive) {
      return 'bg-slate-900/60 border-slate-800/80 text-slate-400 opacity-60 hover:opacity-100 hover:border-slate-700';
    }

    switch (node.category) {
      case 'protection':
        return 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-400/50';
      case 'success':
        return 'bg-teal-950/40 border-teal-500/80 text-teal-200 shadow-lg shadow-teal-900/20 ring-1 ring-teal-400/50';
      case 'financial':
        return 'bg-amber-950/40 border-amber-500/80 text-amber-200 shadow-lg shadow-amber-900/20 ring-1 ring-amber-400/50';
      case 'decision':
        return 'bg-indigo-950/40 border-indigo-500/80 text-indigo-200 shadow-lg shadow-indigo-900/20 ring-1 ring-indigo-400/50';
      case 'safe':
        return 'bg-sky-950/40 border-sky-500/80 text-sky-200 shadow-lg shadow-sky-900/20 ring-1 ring-sky-400/50';
      case 'final':
        return 'bg-violet-950/40 border-violet-500/80 text-violet-200 shadow-lg shadow-violet-900/20 ring-1 ring-violet-400/50';
      default:
        return 'bg-slate-800/80 border-indigo-500/60 text-slate-200 shadow-md ring-1 ring-indigo-400/30';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative ${
      isExpanded ? 'fixed inset-3 z-50 bg-slate-950' : 'relative'
    }`}>
      
      {/* Top Header & Toolbar */}
      <div className="bg-slate-900/95 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                WBJEE 2026 DC Master Flowchart
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Live Mapped Path
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {activeNodesSet.size} active stages illuminated for your selected constraints
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-semibold border border-slate-700 transition-all cursor-pointer"
            title="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title={isExpanded ? 'Exit Fullscreen' : 'Fullscreen Flowchart'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Flowchart Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:18px_18px] relative">
        
        <div 
          className="min-w-[850px] max-w-5xl mx-auto space-y-6 transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel})` }}
        >

          {/* Phase Section 1: Ingestion & Protection */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Stage 1: Eligibility, Registration & Seat Protection</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Clauses 5, 6, 14</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {FLOWCHART_NODES.slice(0, 4).map((node) => {
                const isActive = activeNodesSet.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => openNodeDetails(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${getNodeColorClasses(node, isActive)}`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>Active Path</span>
                      </span>
                    )}
                    <div className="text-[10px] font-mono text-indigo-400/90 font-semibold mb-1 flex items-center justify-between">
                      <span>{node.clause}</span>
                      <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold leading-snug mb-1">
                      {node.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {node.sublabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center -my-2">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-teal-500" />
              <ArrowRight className="w-4 h-4 text-teal-400 rotate-90 -mt-1" />
            </div>
          </div>

          {/* Phase Section 2: Merit & DC Phase 1 */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>Stage 2: DC Phase 1 (Fresh Admission — Quota Intact)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Clauses 9, 13, 15</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {FLOWCHART_NODES.slice(4, 8).map((node) => {
                const isActive = activeNodesSet.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => openNodeDetails(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${getNodeColorClasses(node, isActive)}`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>Active Path</span>
                      </span>
                    )}
                    <div className="text-[10px] font-mono text-teal-400/90 font-semibold mb-1 flex items-center justify-between">
                      <span>{node.clause}</span>
                      <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold leading-snug mb-1">
                      {node.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {node.sublabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center -my-2">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-teal-500 to-sky-500" />
              <ArrowRight className="w-4 h-4 text-sky-400 rotate-90 -mt-1" />
            </div>
          </div>

          {/* Phase Section 3: DC Phase 2 & Upgradation */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Stage 3: DC Phase 2 (Upgradation & Replacement Quota)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Clauses 13.2, 14.2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {FLOWCHART_NODES.slice(8, 11).map((node) => {
                const isActive = activeNodesSet.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => openNodeDetails(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${getNodeColorClasses(node, isActive)}`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>Active Path</span>
                      </span>
                    )}
                    <div className="text-[10px] font-mono text-sky-400/90 font-semibold mb-1 flex items-center justify-between">
                      <span>{node.clause}</span>
                      <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold leading-snug mb-1">
                      {node.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {node.sublabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center -my-2">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-sky-500 to-amber-500" />
              <ArrowRight className="w-4 h-4 text-amber-400 rotate-90 -mt-1" />
            </div>
          </div>

          {/* Phase Section 4: Fee Refund & Final Enrollment */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Stage 4: Fee Refund Policy (Clause 18) & Final Enrollment</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Clauses 18, 19</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {FLOWCHART_NODES.slice(11, 13).map((node) => {
                const isActive = activeNodesSet.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => openNodeDetails(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${getNodeColorClasses(node, isActive)}`}
                  >
                    {isActive && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center space-x-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 inline" />
                        <span>Active Path</span>
                      </span>
                    )}
                    <div className="text-[10px] font-mono text-amber-400/90 font-semibold mb-1 flex items-center justify-between">
                      <span>{node.clause}</span>
                      <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold leading-snug mb-1">
                      {node.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {node.sublabel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Node Details Modal / Drawer */}
      {activeModalNode && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
                  {activeModalNode.clause}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {activeModalNode.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalNode(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer text-sm font-bold px-2.5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Official Notification Rule:
                </span>
                <p>{activeModalNode.description}</p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-xl text-indigo-200">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Candidate Action Guidance:
                </span>
                <p>
                  {activeModalNode.category === 'protection'
                    ? 'Your Centralised Counselling admission is 100% protected under Clause 14. Do NOT withdraw or cancel your seat.'
                    : activeModalNode.category === 'success'
                    ? 'DC Phase 1 admission counts as a Fresh Admission. Your replacement quota remains untouched (0/1).'
                    : activeModalNode.category === 'financial'
                    ? 'Submit your DC provisional allotment slip to your previous institute to initiate fee refund under Clause 18.'
                    : 'Verify all original certificates at the reporting centre during the stipulated institutional reporting window.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveModalNode(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Close & Return to Flowchart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
