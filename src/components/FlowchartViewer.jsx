import React, { useState } from 'react';
import { 
  FLOWCHART_TREE_NODES 
} from '../data/flowchartData';
import { 
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, 
  ShieldCheck, AlertTriangle, CheckCircle2, Info, 
  Layers, Sparkles, BookOpen, ExternalLink, Sliders 
} from 'lucide-react';

export default function FlowchartViewer({
  simulationResult,
  selectedNodeId,
  onSelectNode,
  onOpenSimulator
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModalNode, setActiveModalNode] = useState(null);

  const activeNodesSet = new Set(simulationResult?.activeNodes || []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const openNode = (nodeKey) => {
    const node = FLOWCHART_TREE_NODES[nodeKey];
    if (node) {
      setActiveModalNode(node);
      if (onSelectNode) onSelectNode(node.id);
    }
  };

  const isNodeActive = (nodeKey) => activeNodesSet.has(nodeKey);

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${
      isExpanded ? 'fixed inset-3 z-50 bg-slate-950 text-white' : 'relative'
    }`}>
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center space-x-2">
            <span>WBJEE Counselling Decision Tree</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Interactive Flow
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace your pathway & inspect rule clause triggers
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure My Scenario</span>
            </button>
          )}

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold border border-slate-700 transition-all cursor-pointer"
            title="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title={isExpanded ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Decision Tree Diagram Canvas Container */}
      <div className="flex-1 overflow-auto bg-[#0b0f17] p-6 sm:p-10 relative select-none">
        
        <div 
          className="min-w-[820px] max-w-4xl mx-auto flex flex-col items-center space-y-6 transition-transform duration-200 origin-top text-slate-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >

          {/* ========================================================================= */}
          {/* STAGE 1: Centralised Counselling Decision Tree (Phase 1 & Round 1/2)     */}
          {/* ========================================================================= */}

          {/* Root Pill: Start Phase 1 (Choices) */}
          <div 
            onClick={() => openNode('node_start_phase1')}
            className={`cursor-pointer px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border-2 ${
              isNodeActive('node_start_phase1')
                ? 'bg-blue-950/80 border-blue-400 text-blue-100 shadow-[0_0_25px_rgba(59,130,246,0.7)] ring-2 ring-blue-400/40'
                : 'bg-slate-900 border-blue-600/50 text-blue-200 hover:border-blue-400'
            }`}
          >
            Start Phase 1 (Choices)
          </div>

          {/* Dotted Arrow Down */}
          <div className="w-px h-8 border-r-2 border-dotted border-slate-600 flex items-center justify-center -my-2">
            <span className="text-[10px] text-slate-400 mt-2">▼</span>
          </div>

          {/* Diamond: Phase 1 Round 1 Allotment */}
          <div className="relative my-2 flex items-center justify-center">
            <div 
              onClick={() => openNode('node_round1_decision')}
              className={`cursor-pointer w-48 h-20 rounded-full border-2 flex items-center justify-center p-3 text-center transition-all ${
                isNodeActive('node_round1_decision')
                  ? 'bg-slate-900/90 border-blue-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
              <span className="text-xs font-semibold px-4">Phase 1 Round 1 Allotment</span>
            </div>

            {/* Branch Label Left: No */}
            <span className="absolute -left-12 text-xs italic font-mono text-slate-400 font-semibold">
              No
            </span>

            {/* Branch Label Right: Yes */}
            <span className="absolute -right-12 text-xs italic font-mono text-slate-400 font-semibold">
              Yes
            </span>
          </div>

          {/* Level 3: Left (No Seat Allotted) & Right (Seat Allotted) */}
          <div className="w-full grid grid-cols-2 gap-16 relative pt-2">
            
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -top-10" style={{ zIndex: 0 }}>
              {/* Left Branch */}
              <path d="M 370 0 H 220 V 50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Right Branch */}
              <path d="M 450 0 H 600 V 50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Left Box: No Seat Allotted */}
            <div className="flex flex-col items-center space-y-6 z-10">
              <div 
                onClick={() => openNode('node_no_seat_allotted')}
                className={`cursor-pointer w-52 py-3 px-4 rounded-2xl border text-center transition-all ${
                  isNodeActive('node_no_seat_allotted')
                    ? 'bg-slate-900 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-xs font-bold">No Seat Allotted</div>
              </div>

              {/* Path connector with "Wait" text */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-mono text-slate-400 italic">Wait</span>
                <div className="w-px h-32 border-r-2 border-dotted border-slate-600" />
                <span className="text-[10px] text-slate-400">▼</span>
              </div>
            </div>

            {/* Right Box: Seat Allotted & Actions */}
            <div className="flex flex-col items-center space-y-4 z-10">
              <div 
                onClick={() => openNode('node_seat_allotted')}
                className={`cursor-pointer w-52 py-3 px-4 rounded-2xl border text-center transition-all ${
                  isNodeActive('node_seat_allotted')
                    ? 'bg-slate-900 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-xs font-bold">Seat Allotted</div>
              </div>

              {/* Action Branches */}
              <div className="w-full grid grid-cols-2 gap-4 pt-2">
                
                {/* Action: Pay SAF but Skip Verification */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 text-center">
                    Pay SAF but Skip Verification
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">Clause 17.5 Penalty</span>
                  
                  {/* Red Penalty Pill */}
                  <div 
                    onClick={() => openNode('node_penalty_debarred')}
                    className="cursor-pointer w-full py-2 px-2.5 rounded-full border-2 border-rose-500/80 bg-rose-950/40 text-rose-400 text-[11px] font-bold text-center hover:bg-rose-900/50 shadow-sm"
                  >
                    Permanently Debarred<br/>(Clause 17.5 Penalty)
                  </div>
                </div>

                {/* Action: Accept or Ignore */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 text-center">
                    Action: Accept
                  </div>
                  <div 
                    onClick={() => openNode('node_pay_saf_verified')}
                    className={`cursor-pointer w-full py-2.5 px-3 rounded-xl border text-center text-[11px] font-semibold transition-all ${
                      isNodeActive('node_pay_saf_verified')
                        ? 'bg-slate-900 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Pay SAF & Complete Verification
                  </div>

                  {/* Red Ignore Pill */}
                  <div 
                    onClick={() => openNode('node_penalty_ignored')}
                    className="cursor-pointer w-full py-1.5 px-2.5 rounded-full border border-rose-500/70 bg-rose-950/30 text-rose-400 text-[10px] font-semibold text-center hover:bg-rose-900/40"
                  >
                    Ignore Portal (Non-Response)
                  </div>
                </div>

              </div>

              {/* Warning tag */}
              <div className="text-[10px] font-mono text-rose-400 pt-1">
                Clause 17.4: Combo Blocked
              </div>
            </div>

          </div>

          {/* Level 5: Diamond: Phase 1 Round 2 (Auto-Upgradation) */}
          <div className="relative my-4 flex items-center justify-center pt-2">
            <div 
              onClick={() => openNode('node_round2_decision')}
              className={`cursor-pointer w-56 h-20 rounded-full border-2 flex items-center justify-center p-3 text-center transition-all ${
                isNodeActive('node_round2_decision')
                  ? 'bg-slate-900/90 border-blue-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
              <span className="text-xs font-semibold px-4">Phase 1 Round 2<br/>(Auto-Upgradation)</span>
            </div>
          </div>

          {/* Transition to Phase 2 Banner */}
          <div className="w-full flex flex-col items-center space-y-2 pt-2">
            <div className="text-xs font-mono text-slate-400 italic">Want Better Seat / Vacancies</div>
            <div className="w-px h-8 border-r-2 border-dotted border-slate-600" />
            <span className="text-[10px] text-slate-400">▼</span>
          </div>

          {/* ========================================================================= */}
          {/* STAGE 2: Decentralised Counselling (DC Phase 1 & 2 Full Lifecycle)       */}
          {/* ========================================================================= */}

          {/* Stage 2 Section Header Card */}
          <div 
            onClick={() => openNode('node_start_phase2_dc')}
            className={`w-full p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              isNodeActive('node_start_phase2_dc')
                ? 'bg-slate-900/95 border-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <div className="text-sm font-bold flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Start Phase 2 / Decentralised Counselling (DC)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Institutional-Level Vacancy Rounds (Clause 5 & 14)
            </div>
          </div>

          {/* Dotted Arrow */}
          <div className="w-px h-6 border-r-2 border-dotted border-slate-600 -my-2"></div>

          {/* Seat Protection & Registration Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Seat Protection Guarantee */}
            <div 
              onClick={() => openNode('node_seat_protection_guarantee')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_seat_protection_guarantee')
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                Clause 14 (Page 7)
              </div>
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Seat Protection Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                CC Admitted seat remains 100% safe & protected during DC
              </p>
            </div>

            {/* DC Portal Registration */}
            <div 
              onClick={() => openNode('node_dc_portal_registration')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_portal_registration')
                  ? 'bg-indigo-950/40 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-indigo-400 font-bold mb-1">
                Clause 6 (Page 3)
              </div>
              <div className="text-xs font-bold text-white">
                DC Portal Registration & Fee
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Apply on institute portals with ₹250 application fee
              </p>
            </div>

            {/* Merit Priority Hierarchy */}
            <div 
              onClick={() => openNode('node_dc_merit_hierarchy')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_merit_hierarchy')
                  ? 'bg-sky-950/40 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                Clause 9 (Page 4)
              </div>
              <div className="text-xs font-bold text-white">
                Merit Priority Hierarchy
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                GMR (Tier 1) &gt; JEE Main (Tier 2) &gt; HMR (Tier 3)
              </p>
            </div>

          </div>

          {/* Dotted Arrow */}
          <div className="w-px h-6 border-r-2 border-dotted border-slate-600 -my-2"></div>

          {/* Diamond: DC Phase 1 Seat Allotment */}
          <div className="relative my-2 flex items-center justify-center">
            <div 
              onClick={() => openNode('node_dc_phase1_decision')}
              className={`cursor-pointer w-56 h-20 rounded-full border-2 flex items-center justify-center p-3 text-center transition-all ${
                isNodeActive('node_dc_phase1_decision')
                  ? 'bg-slate-900/90 border-blue-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
              <span className="text-xs font-semibold px-4">DC Phase 1 Seat Allotment</span>
            </div>
          </div>

          {/* Phase 1 Outcome Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* DC Phase 1 Fresh Admission */}
            <div 
              onClick={() => openNode('node_dc_phase1_admission')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_phase1_admission')
                  ? 'bg-teal-950/40 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-teal-400 font-bold mb-1">
                Mandatory Legal Ruling
              </div>
              <div className="text-xs font-bold text-white">
                DC Phase 1 Fresh Admission
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Counted as FRESH ADMISSION. Replacement Quota: <span className="text-teal-300 font-bold">0/1 Used (Intact!)</span>
              </p>
            </div>

            {/* DC Phase 1 Safe Retain */}
            <div 
              onClick={() => openNode('node_dc_phase1_safe_retain')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_phase1_safe_retain')
                  ? 'bg-slate-900/90 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                Clause 14 (Page 7)
              </div>
              <div className="text-xs font-bold text-white">
                No DC Allotment (Safe Holding)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Original CC admission remains 100% active and untouched
              </p>
            </div>

          </div>

          {/* Dotted Arrow */}
          <div className="w-px h-6 border-r-2 border-dotted border-slate-600 -my-2"></div>

          {/* Diamond: DC Phase 2 Upgradation Round */}
          <div className="relative my-2 flex items-center justify-center">
            <div 
              onClick={() => openNode('node_dc_phase2_decision')}
              className={`cursor-pointer w-60 h-20 rounded-full border-2 flex items-center justify-center p-3 text-center transition-all ${
                isNodeActive('node_dc_phase2_decision')
                  ? 'bg-slate-900/90 border-blue-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            >
              <span className="text-xs font-semibold px-4">DC Phase 2 (Vacancy & Upgradation Round)</span>
            </div>
          </div>

          {/* Phase 2 Outlets */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Phase 2 Upgraded */}
            <div 
              onClick={() => openNode('node_dc_phase2_upgraded')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_phase2_upgraded')
                  ? 'bg-violet-950/40 border-violet-400 text-violet-200 shadow-[0_0_15px_rgba(167,139,250,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-violet-400 font-bold mb-1">
                Clause 14.2 & Mandatory Ruling
              </div>
              <div className="text-xs font-bold text-white">
                DC Phase 2 Seat Replaced & Upgraded
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Replaces DC Phase 1 seat. Replacement Quota: <span className="text-violet-300 font-bold">1/1 Consumed (Exhausted)</span>
              </p>
            </div>

            {/* Phase 2 Retain */}
            <div 
              onClick={() => openNode('node_dc_phase2_retain')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_dc_phase2_retain')
                  ? 'bg-slate-900/90 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                Clause 14 (Page 7)
              </div>
              <div className="text-xs font-bold text-white">
                DC Phase 2 Retain Confirmed Seat
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                No upgrade in Phase 2; comfortably retain confirmed seat
              </p>
            </div>

          </div>

          {/* Dotted Arrow */}
          <div className="w-px h-6 border-r-2 border-dotted border-slate-600 -my-2"></div>

          {/* Level 14 & 15: Fee Refund & Final Enrollment */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Fee Refund Policy (Clause 18) */}
            <div 
              onClick={() => openNode('node_fee_refund_clause18')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_fee_refund_clause18')
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                Clause 18 (Page 11-12)
              </div>
              <div className="text-xs font-bold text-white">
                Fee Refund & Adjustment Policy
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Submit DC admission letter to claim refund of ₹5,000 SAF and paid tuition fees
              </p>
            </div>

            {/* Final Enrolled State */}
            <div 
              onClick={() => openNode('node_final_enrolled_state')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isNodeActive('node_final_enrolled_state')
                  ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                Clause 19 (Page 13)
              </div>
              <div className="text-xs font-bold text-white">
                Final Enrolled B.Tech Status 2026
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Official university registration completed. Academic session begins!
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Node Details Inspection Modal */}
      {activeModalNode && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-white">
            
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
                  Candidate Practical Guidance:
                </span>
                <p>{activeModalNode.guidance}</p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveModalNode(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
