import React, { useState, useEffect } from 'react';
import { 
  FLOWCHART_TREE_NODES,
  DC_PRESETS 
} from '../data/flowchartData';
import { 
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, 
  ShieldCheck, AlertTriangle, CheckCircle2, Info, 
  Layers, Sparkles, BookOpen, ExternalLink, Sliders,
  Play, ChevronRight, ChevronLeft, Eye, RefreshCw,
  Check, ArrowDown, HelpCircle, Lock, Unlock, DollarSign, Award
} from 'lucide-react';

export default function FlowchartViewer({
  simulationResult,
  constraints,
  onConstraintsChange,
  onOpenDossier
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModalNode, setActiveModalNode] = useState(null);
  const [showScenarioDrawer, setShowScenarioDrawer] = useState(false);

  // Progressive Interactive Reveal State (Current Step: 1 to 6)
  const [currentStep, setCurrentStep] = useState(1);
  const [isFullTreeRevealed, setIsFullTreeRevealed] = useState(false);

  // User interactive "What-If" choices on the diagram
  const [round1Choice, setRound1Choice] = useState(
    constraints?.ccStatus === 'unallotted' ? 'no_seat' : 'seat_allotted'
  );
  const [round1Action, setRound1Action] = useState('accept_verify'); // 'accept_verify' | 'skip_verify' | 'ignore'
  const [dcPhase1Choice, setDcPhase1Choice] = useState('allotted'); // 'allotted' | 'no_seat'
  const [dcPhase2Choice, setDcPhase2Choice] = useState('upgrade'); // 'upgrade' | 'retain'

  // Update choices when constraints change
  useEffect(() => {
    if (constraints?.ccStatus === 'unallotted') {
      setRound1Choice('no_seat');
    } else if (constraints?.ccStatus === 'admitted') {
      setRound1Choice('seat_allotted');
      setRound1Action('accept_verify');
    } else if (constraints?.ccStatus === 'allotted_unadmitted') {
      setRound1Choice('seat_allotted');
      setRound1Action('ignore');
    }
  }, [constraints]);

  const activeNodesSet = new Set(simulationResult?.activeNodes || []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const openNode = (nodeKey) => {
    const node = FLOWCHART_TREE_NODES[nodeKey];
    if (node) {
      setActiveModalNode(node);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleResetWalkthrough = () => {
    setCurrentStep(1);
    setIsFullTreeRevealed(false);
  };

  const toggleRevealAll = () => {
    setIsFullTreeRevealed(prev => !prev);
    if (!isFullTreeRevealed) {
      setCurrentStep(6);
    }
  };

  const isStepVisible = (stepNum) => {
    if (isFullTreeRevealed) return true;
    return currentStep >= stepNum;
  };

  const handlePresetSelect = (presetId) => {
    const found = DC_PRESETS.find(p => p.id === presetId);
    if (found && onConstraintsChange) {
      onConstraintsChange(found.constraints);
    }
  };

  const updateConstraintField = (field, value) => {
    if (onConstraintsChange) {
      onConstraintsChange({
        ...constraints,
        [field]: value
      });
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden ${
      isExpanded ? 'fixed inset-2 z-50 bg-white' : 'relative'
    }`}>
      
      {/* ========================================================================= */}
      {/* 1. FRONT SCREEN: Interactive Scenario Switcher & Controls                 */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0 shadow-xs">
        
        {/* Top Row: Title, Preset Pills & Toggle Full Customizer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-600/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Scenario Configuration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Live Path Sync
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Select your status below to illuminate your exact path on the decision tree
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowScenarioDrawer(!showScenarioDrawer)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                showScenarioDrawer
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showScenarioDrawer ? 'Hide Advanced Options' : 'Customize Constraints'}</span>
            </button>

            {onOpenDossier && (
              <button
                onClick={onOpenDossier}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Strategy Dossier</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Quick Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {DC_PRESETS.map((preset) => {
            const isSelected = 
              constraints?.ccStatus === preset.constraints.ccStatus &&
              constraints?.primaryGoal === preset.constraints.primaryGoal &&
              constraints?.rankType === preset.constraints.rankType;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className="truncate font-semibold text-[11px] text-slate-800">{preset.label}</div>
              </button>
            );
          })}
        </div>

        {/* Collapsible Advanced Customizer Drawer */}
        {showScenarioDrawer && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fade-in bg-slate-50/70 p-3 rounded-xl">
            
            {/* CC Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Centralised Counselling Status
              </label>
              <select
                value={constraints?.ccStatus}
                onChange={(e) => updateConstraintField('ccStatus', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="admitted">Admitted in College (Holding Seat)</option>
                <option value="allotted_unadmitted">Allotted but Not Admitted</option>
                <option value="unallotted">Participated, No Seat Allotted</option>
                <option value="unregistered">Not Registered / JEE Main</option>
              </select>
            </div>

            {/* Rank Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Merit Rank Source
              </label>
              <select
                value={constraints?.rankType}
                onChange={(e) => updateConstraintField('rankType', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="gmr">WBJEE GMR (Tier 1 Statutory)</option>
                <option value="jee_main">JEE Main CRL (Tier 2)</option>
                <option value="hmr">10+2 HMR (Tier 3)</option>
              </select>
            </div>

            {/* Category & Domicile */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Category & Domicile
              </label>
              <select
                value={constraints?.category}
                onChange={(e) => updateConstraintField('category', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="GEN">General (WB Domicile)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC-A">OBC-A / OBC-B</option>
                <option value="TFW">TFW (Tuition Fee Waiver)</option>
              </select>
            </div>

            {/* Seat Retention Guarantee Toggle */}
            <div className="flex flex-col justify-center">
              <label className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clause 14 Seat Protection</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={constraints?.retainSeat}
                  onChange={(e) => updateConstraintField('retainSeat', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-semibold text-slate-700">Protect My Admitted Seat</span>
              </label>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE STEP CONTROLLER & REVEAL BAR                               */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Step Progression Indicators */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-300 mr-1 flex items-center space-x-1">
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Interactive Journey:</span>
          </span>

          {[
            { step: 1, label: '1. Choices' },
            { step: 2, label: '2. Allotment' },
            { step: 3, label: '3. Verification' },
            { step: 4, label: '4. DC Entry' },
            { step: 5, label: '5. DC Phase 1' },
            { step: 6, label: '6. DC Phase 2' }
          ].map((st) => (
            <button
              key={st.step}
              onClick={() => {
                setCurrentStep(st.step);
                setIsFullTreeRevealed(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentStep === st.step && !isFullTreeRevealed
                  ? 'bg-indigo-600 text-white shadow-sm font-bold ring-1 ring-indigo-400'
                  : currentStep > st.step || isFullTreeRevealed
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Step Controls (Prev, Next, Reveal All, Reset, Zoom) */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrevStep}
            disabled={currentStep <= 1 && !isFullTreeRevealed}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
              currentStep > 1 || isFullTreeRevealed
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
            }`}
            title="Previous Step"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStep >= 6 && !isFullTreeRevealed}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
              currentStep < 6 && !isFullTreeRevealed
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 cursor-pointer shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-50'
            }`}
            title="Next Step in Process"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleRevealAll}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isFullTreeRevealed
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Reveal or fold the full tree"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isFullTreeRevealed ? 'Step View' : 'Full Tree'}</span>
          </button>

          <button
            onClick={handleResetWalkthrough}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Reset to Step 1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center space-x-1 border-l border-slate-800 pl-2">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title={isExpanded ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. DIAGRAM CANVAS WITH INTERACTIVE PROGRESSIVE REVEAL                     */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-auto bg-[#0a0e17] p-6 sm:p-10 relative select-none">
        
        <div 
          className="min-w-[820px] max-w-4xl mx-auto flex flex-col items-center space-y-6 transition-transform duration-200 origin-top text-slate-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >

          {/* ========================================================================= */}
          {/* STEP 1: Root Node - Start Phase 1 (Choices)                               */}
          {/* ========================================================================= */}
          {isStepVisible(1) && (
            <div className="flex flex-col items-center space-y-3 animate-fade-in">
              <div 
                onClick={() => openNode('node_start_phase1')}
                className="cursor-pointer px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border-2 bg-blue-950/90 border-blue-400 text-blue-100 shadow-[0_0_25px_rgba(59,130,246,0.7)] ring-2 ring-blue-400/40 hover:scale-105"
              >
                Start Phase 1 (Choices)
              </div>

              {/* Dotted Arrow Down */}
              <div className="w-px h-6 border-r-2 border-dotted border-slate-600 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 mt-2">▼</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Diamond - Phase 1 Round 1 Allotment Gate                          */}
          {/* ========================================================================= */}
          {isStepVisible(2) && (
            <div className="flex flex-col items-center space-y-4 animate-fade-in w-full">
              
              {/* Diamond Node */}
              <div className="relative flex items-center justify-center">
                <div 
                  onClick={() => openNode('node_round1_decision')}
                  className="cursor-pointer w-52 h-20 rounded-full border-2 border-blue-400 bg-slate-900/95 text-white font-bold flex items-center justify-center p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:border-blue-300 transition-all"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <span className="text-xs font-semibold px-4">Phase 1 Round 1 Allotment</span>
                </div>

                {/* Interactive Branch Switcher Badges */}
                <button
                  onClick={() => setRound1Choice('no_seat')}
                  className={`absolute -left-20 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                    round1Choice === 'no_seat'
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  ◀ No (Unallotted)
                </button>

                <button
                  onClick={() => setRound1Choice('seat_allotted')}
                  className={`absolute -right-20 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                    round1Choice === 'seat_allotted'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Yes (Allotted) ▶
                </button>
              </div>

              {/* Level 3 Split: Left (No Seat Allotted) or Right (Seat Allotted) */}
              <div className="w-full grid grid-cols-2 gap-12 relative pt-3">
                
                {/* Left Branch: No Seat Allotted */}
                <div className={`flex flex-col items-center space-y-4 transition-all duration-300 ${
                  round1Choice === 'no_seat' ? 'opacity-100' : 'opacity-35 hover:opacity-80'
                }`}>
                  <div 
                    onClick={() => {
                      setRound1Choice('no_seat');
                      openNode('node_no_seat_allotted');
                    }}
                    className={`cursor-pointer w-52 py-3 px-4 rounded-2xl border text-center transition-all ${
                      round1Choice === 'no_seat'
                        ? 'bg-slate-900 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">No Seat Allotted</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ranks higher than cutoff</div>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs font-mono text-slate-400 italic">Wait (Moves to R2)</span>
                    <div className="w-px h-16 border-r-2 border-dotted border-slate-600" />
                    <span className="text-[10px] text-slate-400">▼</span>
                  </div>
                </div>

                {/* Right Branch: Seat Allotted */}
                <div className={`flex flex-col items-center space-y-4 transition-all duration-300 ${
                  round1Choice === 'seat_allotted' ? 'opacity-100' : 'opacity-35 hover:opacity-80'
                }`}>
                  <div 
                    onClick={() => {
                      setRound1Choice('seat_allotted');
                      openNode('node_seat_allotted');
                    }}
                    className={`cursor-pointer w-52 py-3 px-4 rounded-2xl border text-center transition-all ${
                      round1Choice === 'seat_allotted'
                        ? 'bg-slate-900 border-emerald-400 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Seat Allotted</div>
                    <div className="text-[10px] text-emerald-300/80 mt-0.5">Provisional Allotment Letter</div>
                  </div>

                  {/* Step 3: Verification Actions */}
                  {isStepVisible(3) && round1Choice === 'seat_allotted' && (
                    <div className="w-full grid grid-cols-2 gap-3 pt-1 animate-fade-in">
                      
                      {/* Action A: Pay SAF but skip verification */}
                      <div className="flex flex-col items-center space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400">Action: Skip Verification</span>
                        <span className="text-[9px] font-mono text-rose-400 font-bold">Clause 17.5 Penalty</span>
                        <button 
                          onClick={() => {
                            setRound1Action('skip_verify');
                            openNode('node_penalty_debarred');
                          }}
                          className={`cursor-pointer w-full py-2 px-2 rounded-full border-2 text-[10px] font-bold text-center transition-all ${
                            round1Action === 'skip_verify'
                              ? 'border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                              : 'border-rose-900/60 bg-rose-950/30 text-rose-400'
                          }`}
                        >
                          Permanently Debarred<br/>(Clause 17.5)
                        </button>
                      </div>

                      {/* Action B: Pay SAF & Complete Verification */}
                      <div className="flex flex-col items-center space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400">Action: Accept & Report</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">Safe Holding</span>
                        <button 
                          onClick={() => {
                            setRound1Action('accept_verify');
                            openNode('node_pay_saf_verified');
                          }}
                          className={`cursor-pointer w-full py-2 px-2 rounded-xl border text-[10px] font-bold text-center transition-all ${
                            round1Action === 'accept_verify'
                              ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                              : 'border-slate-700 bg-slate-900 text-slate-300'
                          }`}
                        >
                          Pay SAF & Complete<br/>Verification
                        </button>

                        <button 
                          onClick={() => {
                            setRound1Action('ignore');
                            openNode('node_penalty_ignored');
                          }}
                          className={`cursor-pointer w-full py-1 px-2 rounded-full border text-[9px] font-semibold text-center mt-1 transition-all ${
                            round1Action === 'ignore'
                              ? 'border-rose-500 bg-rose-950 text-rose-300'
                              : 'border-slate-800 bg-slate-900/50 text-slate-500'
                          }`}
                        >
                          Ignore Portal (Forfeited)
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: Centralised Auto-Upgradation (Round 2) & DC Transition            */}
          {/* ========================================================================= */}
          {isStepVisible(4) && (
            <div className="w-full flex flex-col items-center space-y-4 animate-fade-in pt-2">
              
              {/* Diamond: Phase 1 Round 2 (Auto-Upgradation) */}
              <div className="relative flex items-center justify-center">
                <div 
                  onClick={() => openNode('node_round2_decision')}
                  className="cursor-pointer w-56 h-20 rounded-full border-2 border-blue-400 bg-slate-900/95 text-white font-bold flex items-center justify-center p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <span className="text-xs font-semibold px-4">Phase 1 Round 2<br/>(Auto-Upgradation)</span>
                </div>
              </div>

              {/* Transition Banner */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-mono text-slate-400 italic">Want Better Seat / Institute Vacancies</span>
                <div className="w-px h-6 border-r-2 border-dotted border-slate-600" />
                <span className="text-[10px] text-slate-400">▼</span>
              </div>

              {/* Stage 2 Section Header Card */}
              <div 
                onClick={() => openNode('node_start_phase2_dc')}
                className="w-full p-4 rounded-2xl border-2 border-indigo-500 bg-slate-900/95 text-white text-center shadow-[0_0_25px_rgba(99,102,241,0.5)] cursor-pointer hover:border-indigo-400 transition-all"
              >
                <div className="text-sm font-bold flex items-center justify-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Start Phase 2 / Decentralised Counselling (DC)</span>
                </div>
                <div className="text-[11px] text-indigo-300 mt-0.5">
                  Institutional-Level Vacancy Rounds (Clause 5, 6 & 14)
                </div>
              </div>

              {/* Stage 2 Core Pillars Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                
                {/* Seat Protection Guarantee */}
                <div 
                  onClick={() => openNode('node_seat_protection_guarantee')}
                  className="p-3.5 rounded-2xl border border-emerald-400 bg-emerald-950/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer hover:bg-emerald-950/60 transition-all"
                >
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 flex items-center justify-between">
                    <span>Clause 14 (Page 7)</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    Seat Protection Guarantee
                  </div>
                  <p className="text-[11px] text-emerald-300/80 mt-1">
                    CC seat remains 100% protected. Never surrender before verified admission!
                  </p>
                </div>

                {/* DC Portal Registration */}
                <div 
                  onClick={() => openNode('node_dc_portal_registration')}
                  className="p-3.5 rounded-2xl border border-indigo-400 bg-indigo-950/40 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer hover:bg-indigo-950/60 transition-all"
                >
                  <div className="text-[10px] font-mono text-indigo-400 font-bold mb-1">
                    Clause 6 (Page 3)
                  </div>
                  <div className="text-xs font-bold text-white">
                    DC Portal Registration
                  </div>
                  <p className="text-[11px] text-indigo-300/80 mt-1">
                    Apply on institute portals with ₹250 application fee per institute
                  </p>
                </div>

                {/* Merit Priority Hierarchy */}
                <div 
                  onClick={() => openNode('node_dc_merit_hierarchy')}
                  className="p-3.5 rounded-2xl border border-sky-400 bg-sky-950/40 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer hover:bg-sky-950/60 transition-all"
                >
                  <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                    Clause 9 (Page 4)
                  </div>
                  <div className="text-xs font-bold text-white">
                    Merit Priority Hierarchy
                  </div>
                  <p className="text-[11px] text-sky-300/80 mt-1">
                    GMR (Tier 1) &gt; JEE Main (Tier 2) &gt; HMR (Tier 3)
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: DC Phase 1 Allotment & Fresh Admission                            */}
          {/* ========================================================================= */}
          {isStepVisible(5) && (
            <div className="w-full flex flex-col items-center space-y-4 animate-fade-in pt-2">
              
              <div className="w-px h-6 border-r-2 border-dotted border-slate-600" />

              {/* Diamond: DC Phase 1 Seat Allotment */}
              <div className="relative flex items-center justify-center">
                <div 
                  onClick={() => openNode('node_dc_phase1_decision')}
                  className="cursor-pointer w-56 h-20 rounded-full border-2 border-blue-400 bg-slate-900/95 text-white font-bold flex items-center justify-center p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <span className="text-xs font-semibold px-4">DC Phase 1 Seat Allotment</span>
                </div>

                <button
                  onClick={() => setDcPhase1Choice('no_seat')}
                  className={`absolute -left-20 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    dcPhase1Choice === 'no_seat'
                      ? 'bg-sky-950 border-sky-500 text-sky-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  ◀ Not Allotted
                </button>

                <button
                  onClick={() => setDcPhase1Choice('allotted')}
                  className={`absolute -right-20 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    dcPhase1Choice === 'allotted'
                      ? 'bg-teal-950 border-teal-500 text-teal-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  Allotted ▶
                </button>
              </div>

              {/* DC Phase 1 Outcomes Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DC Phase 1 Fresh Admission */}
                <div 
                  onClick={() => {
                    setDcPhase1Choice('allotted');
                    openNode('node_dc_phase1_admission');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    dcPhase1Choice === 'allotted'
                      ? 'bg-teal-950/50 border-teal-400 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.5)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-teal-400 font-bold mb-1 flex items-center justify-between">
                    <span>Mandatory Ruling</span>
                    <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">Quota: 0/1 Used</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    DC Phase 1 Fresh Admission
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Counted as FRESH ADMISSION. Replacement quota is NOT consumed yet!
                  </p>
                </div>

                {/* DC Phase 1 Safe Retain */}
                <div 
                  onClick={() => {
                    setDcPhase1Choice('no_seat');
                    openNode('node_dc_phase1_safe_retain');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    dcPhase1Choice === 'no_seat'
                      ? 'bg-sky-950/50 border-sky-400 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                    Clause 14 (Page 7)
                  </div>
                  <div className="text-xs font-bold text-white">
                    No DC Allotment (Safe Holding)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Prior CC admission continues 100% safely without loss of seat or fee.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: DC Phase 2 Upgradation & Fee Refund (Clause 18)                   */}
          {/* ========================================================================= */}
          {isStepVisible(6) && (
            <div className="w-full flex flex-col items-center space-y-4 animate-fade-in pt-2">
              
              <div className="w-px h-6 border-r-2 border-dotted border-slate-600" />

              {/* Diamond: DC Phase 2 Upgradation Round */}
              <div className="relative flex items-center justify-center">
                <div 
                  onClick={() => openNode('node_dc_phase2_decision')}
                  className="cursor-pointer w-64 h-20 rounded-full border-2 border-blue-400 bg-slate-900/95 text-white font-bold flex items-center justify-center p-3 text-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                >
                  <span className="text-xs font-semibold px-4">DC Phase 2 (Vacancy & Upgradation Round)</span>
                </div>

                <button
                  onClick={() => setDcPhase2Choice('retain')}
                  className={`absolute -left-20 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    dcPhase2Choice === 'retain'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  ◀ Retain Seat
                </button>

                <button
                  onClick={() => setDcPhase2Choice('upgrade')}
                  className={`absolute -right-20 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    dcPhase2Choice === 'upgrade'
                      ? 'bg-violet-950 border-violet-500 text-violet-300'
                      : 'bg-slate-900/80 border-slate-700 text-slate-400'
                  }`}
                >
                  Upgraded ▶
                </button>
              </div>

              {/* Phase 2 Outcomes */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DC Phase 2 Upgraded */}
                <div 
                  onClick={() => {
                    setDcPhase2Choice('upgrade');
                    openNode('node_dc_phase2_upgraded');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    dcPhase2Choice === 'upgrade'
                      ? 'bg-violet-950/50 border-violet-400 text-violet-200 shadow-[0_0_20px_rgba(167,139,250,0.5)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-violet-400 font-bold mb-1 flex items-center justify-between">
                    <span>Clause 14.2 Ruling</span>
                    <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">Quota: 1/1 Consumed</span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    DC Phase 2 Seat Replaced & Upgraded
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Replaces DC Phase 1 seat. Single replacement quota is now fully exhausted.
                  </p>
                </div>

                {/* DC Phase 2 Retain */}
                <div 
                  onClick={() => {
                    setDcPhase2Choice('retain');
                    openNode('node_dc_phase2_retain');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    dcPhase2Choice === 'retain'
                      ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                    Clause 14 (Page 7)
                  </div>
                  <div className="text-xs font-bold text-white">
                    DC Phase 2 Retain Confirmed Seat
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No upgrade in Phase 2; candidate safely holds their Phase 1 or CC seat.
                  </p>
                </div>

              </div>

              <div className="w-px h-6 border-r-2 border-dotted border-slate-600" />

              {/* Fee Refund & Final Enrollment Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Fee Refund (Clause 18) */}
                <div 
                  onClick={() => openNode('node_fee_refund_clause18')}
                  className="p-4 rounded-2xl border border-amber-400 bg-amber-950/40 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer hover:bg-amber-950/60 transition-all"
                >
                  <div className="text-[10px] font-mono text-amber-400 font-bold mb-1 flex items-center justify-between">
                    <span>Clause 18 (Page 11-12)</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    Fee Refund & Transfer Claim
                  </div>
                  <p className="text-[11px] text-amber-300/90 mt-1">
                    Submit new DC admission letter to claim refund of ₹5,000 SAF and tuition fees from previous college.
                  </p>
                </div>

                {/* Final Enrolled State */}
                <div 
                  onClick={() => openNode('node_final_enrolled_state')}
                  className="p-4 rounded-2xl border border-emerald-400 bg-emerald-950/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer hover:bg-emerald-950/70 transition-all"
                >
                  <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1 flex items-center justify-between">
                    <span>Clause 19 (Page 13)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs font-bold text-white">
                    Final Enrolled B.Tech Status 2026
                  </div>
                  <p className="text-[11px] text-emerald-300/90 mt-1">
                    Official admission secured with university roll number. Session begins!
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. NODE DETAILS INSPECTION MODAL                                          */}
      {/* ========================================================================= */}
      {activeModalNode && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-white">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold">
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
