import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Target, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Eye, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  TARGET_HANDLES, 
  TARGET_CATEGORIES, 
  getTargetById 
} from '../data/targetHandles';
import { 
  generateUniqueReply, 
  checkTextCustomized, 
  GRIEVANCE_ANGLES 
} from '../data/dynamicReplyGenerator';

// Helper for today's date key (YYYY-MM-DD)
function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function TargetDispatchPage({ onBackToMain, onActionCompleted }) {
  const todayKey = getTodayDateKey();
  const storageKey = `wbjee_strike_completed_${todayKey}`;

  // Completed target IDs for today stored in localStorage
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Tab: 'queue' (uncompleted targets) vs 'completed' (struck today)
  const [activeTab, setActiveTab] = useState('queue');

  // Currently focused target index in the filtered active queue
  const [currentIndex, setCurrentIndex] = useState(0);

  // Grievance draft state
  const [selectedAngleId, setSelectedAngleId] = useState(GRIEVANCE_ANGLES[0].id);
  const [originalDraft, setOriginalDraft] = useState('');
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [lastStruckTarget, setLastStruckTarget] = useState(null);

  // Filter all targets by category
  const categoryTargets = useMemo(() => {
    if (selectedCategory === 'all') return TARGET_HANDLES;
    return TARGET_HANDLES.filter(t => t.category === selectedCategory);
  }, [selectedCategory]);

  // Remaining active queue for today
  const activeQueue = useMemo(() => {
    return categoryTargets.filter(t => !completedIds.includes(t.id));
  }, [categoryTargets, completedIds]);

  // Completed targets for today
  const completedTargets = useMemo(() => {
    return categoryTargets.filter(t => completedIds.includes(t.id));
  }, [categoryTargets, completedIds]);

  // Ensure currentIndex stays within bounds
  useEffect(() => {
    if (currentIndex >= activeQueue.length && activeQueue.length > 0) {
      setCurrentIndex(activeQueue.length - 1);
    }
  }, [activeQueue.length, currentIndex]);

  // Active target being displayed
  const currentTarget = activeQueue[currentIndex] || activeQueue[0] || null;

  // Generate initial draft when target changes
  useEffect(() => {
    if (currentTarget) {
      const generated = generateUniqueReply(selectedAngleId);
      setOriginalDraft(generated.text);
      setEditedText(generated.text);
      setCopied(false);
    }
  }, [currentTarget?.id, selectedAngleId]);

  // Check customization validity
  const customizationStatus = useMemo(() => {
    return checkTextCustomized(originalDraft, editedText);
  }, [originalDraft, editedText]);

  const charCount = editedText.length;
  const isOverLimit = charCount > 280;

  // Handle regenerating new randomized draft
  const handleShuffleDraft = () => {
    const generated = generateUniqueReply(selectedAngleId);
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
    setCopied(false);
  };

  // Primary Strike Action: Copy & Open X Profile
  const handleCopyAndLaunch = (targetToStrike = currentTarget) => {
    if (!targetToStrike) return;
    if (!customizationStatus.isValid) return;

    // 1. Copy edited text to clipboard
    navigator.clipboard.writeText(editedText).catch(() => {});
    setCopied(true);
    setLastStruckTarget(targetToStrike);
    setShowStepModal(true);

    // 2. Confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#38bdf8', '#10b981', '#fbbf24']
    });

    // 3. Mark completed in localStorage (vanishes for today)
    const newCompleted = [...new Set([...completedIds, targetToStrike.id])];
    setCompletedIds(newCompleted);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCompleted));
    } catch (e) {
      console.error(e);
    }

    if (onActionCompleted) {
      onActionCompleted('tweets');
    }

    // 4. Open target profile in a new tab
    const profileUrl = `https://x.com/${targetToStrike.handle}`;
    window.open(profileUrl, '_blank', 'noopener,noreferrer');

    // 5. Reset copied indicator after a delay
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  // Re-open a completed card (User reports a NEW post has arrived)
  const handleReStrikeTarget = (target) => {
    // Remove from completed
    const updated = completedIds.filter(id => id !== target.id);
    setCompletedIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Switch to queue and focus this target
    setActiveTab('queue');
    const targetIdx = activeQueue.findIndex(t => t.id === target.id);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    } else {
      setCurrentIndex(0);
    }

    // Generate fresh draft
    const generated = generateUniqueReply();
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
    setCopied(false);
  };

  // Reset today's deck manually
  const handleResetToday = () => {
    if (window.confirm("Reset all 41 targets for today's strike queue?")) {
      setCompletedIds([]);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.error(e);
      }
      setCurrentIndex(0);
    }
  };

  const totalAllTargets = TARGET_HANDLES.length;
  const totalCompletedAll = completedIds.length;
  const progressPercent = Math.round((totalCompletedAll / totalAllTargets) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans">
      
      {/* Sleek Minimal Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBackToMain}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Portal</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-black tracking-wider text-white uppercase">
              Target Strike Deck
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            <span className="text-emerald-400 font-bold">{totalCompletedAll}</span> / {totalAllTargets} Done
          </div>
        </div>
      </header>

      {/* Main Flashcard Container */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col justify-center">
        
        {/* Minimal Daily Progress Bar */}
        <div className="mb-6 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-extrabold text-slate-200 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-rose-400" />
              <span>Today's Hijack Strikes ({todayKey})</span>
            </span>
            <span className="font-mono text-sky-400 font-bold">
              {progressPercent}% Completed
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-rose-500 via-sky-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* View Switcher: Active Queue vs Completed Cards */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'queue'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Active Queue ({activeQueue.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'completed'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Struck Today ({completedTargets.length})</span>
            </button>
          </div>

          {completedTargets.length > 0 && (
            <button
              onClick={handleResetToday}
              className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center space-x-1"
              title="Reset today's progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Deck</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        {activeTab === 'queue' && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {TARGET_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: ACTIVE FLASHCARD DECK */}
        {activeTab === 'queue' && (
          <>
            {currentTarget ? (
              <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all animate-fade-in">
                
                {/* Deck Card Counter & Fast Nav */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Card <strong className="text-white font-bold">{currentIndex + 1}</strong> of {activeQueue.length}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                      {currentTarget.role}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : activeQueue.length - 1))}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
                      title="Previous target"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex(prev => (prev < activeQueue.length - 1 ? prev + 1 : 0))}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold"
                      title="Skip / Next target"
                    >
                      <span>Skip</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* TARGET ACCOUNT PROFILE HEADER */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-sky-950/60 ring-2 ring-sky-500/20 shrink-0">
                      {currentTarget.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h2 className="font-extrabold text-base sm:text-lg text-white">
                          {currentTarget.name}
                        </h2>
                        <span className="text-sky-400 text-xs bg-sky-500/10 rounded-full px-1 border border-sky-500/30">✓</span>
                      </div>
                      <a
                        href={`https://x.com/${currentTarget.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-sky-400 hover:underline inline-flex items-center space-x-1 mt-0.5"
                      >
                        <span>@{currentTarget.handle}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  </div>

                  <a
                    href={`https://x.com/${currentTarget.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center space-x-1 shrink-0"
                  >
                    <span>View Feed</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {currentTarget.bio}
                </p>

                {/* 280-CHARACTER GRIEVANCE COMPOSER */}
                <div className="space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Personalized Talking Point
                      </span>
                    </div>

                    <button
                      onClick={handleShuffleDraft}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[11px] font-bold border border-sky-500/30 transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>🎲 Roll New Draft</span>
                    </button>
                  </div>

                  {/* Mandatory Customization Notice */}
                  <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                    customizationStatus.isValid
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {customizationStatus.isValid ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-medium leading-tight">
                        {customizationStatus.reason}
                      </span>
                    </div>
                  </div>

                  {/* 280-Char Textarea */}
                  <div className="relative">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={5}
                      maxLength={280}
                      className={`w-full p-3.5 rounded-2xl bg-slate-950 border text-xs leading-relaxed focus:outline-none transition-all font-sans resize-none ${
                        !customizationStatus.isValid
                          ? 'border-amber-500/70 focus:border-amber-400 text-slate-200'
                          : isOverLimit
                            ? 'border-rose-500 focus:border-rose-400 text-white'
                            : 'border-emerald-500/70 focus:border-emerald-400 text-white'
                      }`}
                      placeholder="Customize your message before sending..."
                    />
                    
                    <div className="flex items-center justify-between px-1 mt-1">
                      <span className="text-[10px] text-slate-500">
                        ⚡ Edit rank/branch to unlock copy & open
                      </span>
                      <span className={`text-[11px] font-mono font-bold ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                        {charCount} / 280
                      </span>
                    </div>
                  </div>

                  {/* Single Primary Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleCopyAndLaunch(currentTarget)}
                      disabled={!customizationStatus.isValid}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-2xl transition-all cursor-pointer ${
                        customizationStatus.isValid
                          ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-rose-950 scale-[1.01] active:scale-[0.99]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/80'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied! Opening @{currentTarget.handle} on X...</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Message & Open @{currentTarget.handle} on X</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 pt-1">
                    Once clicked, this profile will vanish from today's active deck until a new day or when re-opened.
                  </p>

                </div>

              </div>
            ) : (
              /* All Cards Done Screen */
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  All Targets Struck for Today!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Outstanding effort! You have completed all {categoryTargets.length} targets in this category. The deck will refresh automatically tomorrow.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    onClick={() => setActiveTab('completed')}
                    className="px-4 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-all cursor-pointer"
                  >
                    Check Completed Profiles for New Posts
                  </button>
                  <button
                    onClick={handleResetToday}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    Reset Deck & Go Again
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: COMPLETED TODAY & RE-STRIKE (CHECK NEW POSTS) */}
        {activeTab === 'completed' && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start space-x-3">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold block mb-0.5">
                  Check If Targets Published New Posts
                </strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Journalists and politicians tweet multiple times daily. If someone just published a new post, click <strong className="text-sky-400">"⚡ Re-Strike New Post"</strong> to generate a fresh draft and reply immediately!
                </p>
              </div>
            </div>

            {completedTargets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedTargets.map(target => (
                  <div
                    key={target.id}
                    className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {target.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">
                            {target.name}
                          </span>
                          <span className="text-[11px] font-mono text-sky-400">
                            @{target.handle}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        ✓ Struck Today
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <a
                        href={`https://x.com/${target.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Check Profile</span>
                      </a>

                      <button
                        onClick={() => handleReStrikeTarget(target)}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Re-Strike New Post</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
                No targets struck yet today. Head over to the Active Queue!
              </div>
            )}
          </div>
        )}

      </main>

      {/* Step 2 Sticky Reminder Modal / Banner */}
      {showStepModal && lastStruckTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl mx-auto shadow-lg shadow-emerald-950">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">
                Message Copied & @{lastStruckTarget.handle} Opened!
              </h3>
              <p className="text-xs text-slate-300">
                Complete the strike on X in 2 simple steps:
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-200">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Look at <strong className="text-sky-400">@{lastStruckTarget.handle}</strong>'s top/latest post on X.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Click the <strong className="text-white">💬 Reply icon</strong> and press <strong className="text-emerald-400 font-mono">Ctrl + V (Paste)</strong> to post your message!</span>
              </div>
            </div>

            <button
              onClick={() => setShowStepModal(false)}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-sky-950"
            >
              Got It! Next Target →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default TargetDispatchPage;
