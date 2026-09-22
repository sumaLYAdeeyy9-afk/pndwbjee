import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TARGET_HANDLES } from '../data/targetHandles';
import { generateUniqueReply, checkTextCustomized } from '../data/dynamicReplyGenerator';

function getTodayDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function TargetDispatchPage({ onBackToMain, onActionCompleted }) {
  const todayKey = getTodayDateKey();
  const storageKey = `wbjee_strike_completed_${todayKey}`;

  // Completed IDs for today from localStorage
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [originalDraft, setOriginalDraft] = useState('');
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [lastStruckTarget, setLastStruckTarget] = useState(null);
  const [viewCompleted, setViewCompleted] = useState(false);

  // Active uncompleted targets queue
  const activeQueue = useMemo(() => {
    return TARGET_HANDLES.filter(t => !completedIds.includes(t.id));
  }, [completedIds]);

  // Completed targets
  const completedTargets = useMemo(() => {
    return TARGET_HANDLES.filter(t => completedIds.includes(t.id));
  }, [completedIds]);

  // Clamp index
  useEffect(() => {
    if (currentIndex >= activeQueue.length && activeQueue.length > 0) {
      setCurrentIndex(activeQueue.length - 1);
    }
  }, [activeQueue.length, currentIndex]);

  const currentTarget = activeQueue[currentIndex] || activeQueue[0] || null;

  // Generate initial draft
  useEffect(() => {
    if (currentTarget) {
      const generated = generateUniqueReply();
      setOriginalDraft(generated.text);
      setEditedText(generated.text);
      setCopied(false);
    }
  }, [currentTarget?.id]);

  const customizationStatus = useMemo(() => {
    return checkTextCustomized(originalDraft, editedText);
  }, [originalDraft, editedText]);

  const charCount = editedText.length;
  const isOverLimit = charCount > 280;

  // New Draft roll
  const handleShuffleDraft = () => {
    const generated = generateUniqueReply();
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
    setCopied(false);
  };

  // 1-Click Strike Action
  const handleCopyAndStrike = () => {
    if (!currentTarget || !customizationStatus.isValid) return;

    navigator.clipboard.writeText(editedText).catch(() => {});
    setCopied(true);
    setLastStruckTarget(currentTarget);
    setShowStepModal(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#a3a3a3', '#38bdf8']
    });

    // Mark completed today
    const newCompleted = [...new Set([...completedIds, currentTarget.id])];
    setCompletedIds(newCompleted);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCompleted));
    } catch (e) {
      console.error(e);
    }

    if (onActionCompleted) {
      onActionCompleted('tweets');
    }

    // Open target profile on X
    window.open(`https://x.com/${currentTarget.handle}`, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  // Re-strike a completed target
  const handleReStrike = (target) => {
    const updated = completedIds.filter(id => id !== target.id);
    setCompletedIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setViewCompleted(false);
    setCurrentIndex(0);
    const generated = generateUniqueReply();
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
  };

  const totalAll = TARGET_HANDLES.length;
  const doneCount = completedIds.length;

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      
      {/* Pitch-Black Minimal Header */}
      <header className="border-b border-neutral-900 bg-black/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToMain}
            className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="text-xs font-semibold tracking-wider text-neutral-300">
            TARGET STRIKE
          </div>

          <button
            onClick={() => setViewCompleted(!viewCompleted)}
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-white font-bold">{doneCount}</span> / {totalAll} done
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 w-full flex flex-col justify-center">

        {!viewCompleted ? (
          <>
            {currentTarget ? (
              <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-fade-in">
                
                {/* Target Profile Info */}
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-base text-neutral-200 shrink-0">
                      {currentTarget.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h2 className="font-bold text-base text-white">
                          {currentTarget.name}
                        </h2>
                      </div>
                      <a
                        href={`https://x.com/${currentTarget.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-neutral-400 hover:text-white transition-colors inline-flex items-center space-x-1"
                      >
                        <span>@{currentTarget.handle}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    </div>
                  </div>

                  {/* Minimal Card Nav */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : activeQueue.length - 1))}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                      title="Previous target"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex(prev => (prev < activeQueue.length - 1 ? prev + 1 : 0))}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center space-x-1 text-xs"
                      title="Skip / Next target"
                    >
                      <span className="text-[11px]">Skip</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-neutral-400 tracking-wide">
                      HUMANIZED DRAFT
                    </label>
                    <button
                      onClick={handleShuffleDraft}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Roll new text</span>
                    </button>
                  </div>

                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={5}
                    maxLength={280}
                    className={`w-full p-3.5 rounded-xl bg-black border text-xs leading-relaxed focus:outline-none transition-all resize-none ${
                      !customizationStatus.isValid
                        ? 'border-neutral-800 text-neutral-300 focus:border-neutral-600'
                        : isOverLimit
                          ? 'border-red-500 text-white'
                          : 'border-neutral-700 text-white focus:border-white'
                    }`}
                    placeholder="Type or edit your genuine message here..."
                  />

                  <div className="flex items-center justify-between text-[11px] px-0.5">
                    <span className={customizationStatus.isValid ? 'text-neutral-400' : 'text-neutral-500'}>
                      {customizationStatus.reason}
                    </span>
                    <span className={`font-mono ${isOverLimit ? 'text-red-400 font-bold' : 'text-neutral-500'}`}>
                      {charCount} / 280
                    </span>
                  </div>
                </div>

                {/* Single Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleCopyAndStrike}
                    disabled={!customizationStatus.isValid || isOverLimit}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      customizationStatus.isValid && !isOverLimit
                        ? 'bg-white text-black hover:bg-neutral-200 active:scale-[0.99]'
                        : 'bg-neutral-900 text-neutral-600 border border-neutral-800/80 cursor-not-allowed'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span>Copied! Opening @{currentTarget.handle} on X...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy & Open @{currentTarget.handle} on X</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-center text-neutral-500">
                  Card vanishes once struck until tomorrow. Edit a few words to unlock.
                </p>

              </div>
            ) : (
              /* All Done Screen */
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-xl text-white">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">
                  All Targets Done for Today
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  You have struck all available targets today. Check back tomorrow or check completed profiles if they published new posts.
                </p>
                <button
                  onClick={() => setViewCompleted(true)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  View Completed Targets
                </button>
              </div>
            )}
          </>
        ) : (
          /* Completed Targets List */
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
              <span className="text-xs font-bold text-neutral-300">
                Struck Targets Today ({completedTargets.length})
              </span>
              <button
                onClick={() => setViewCompleted(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ← Back to Deck
              </button>
            </div>

            {completedTargets.length > 0 ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {completedTargets.map(target => (
                  <div
                    key={target.id}
                    className="bg-[#0a0a0a] border border-neutral-800/80 p-3.5 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {target.name}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        @{target.handle}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReStrike(target)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 transition-all cursor-pointer"
                    >
                      Re-Strike
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 text-xs bg-[#0a0a0a] rounded-xl border border-neutral-900">
                No targets completed yet today.
              </div>
            )}
          </div>
        )}

      </main>

      {/* Step Instructions Modal */}
      {showStepModal && lastStruckTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scale-in">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mx-auto font-bold text-lg">
              ✓
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">
                Message Copied!
              </h3>
              <p className="text-xs text-neutral-400">
                Opened @{lastStruckTarget.handle} on X in a new tab.
              </p>
            </div>

            <div className="bg-black p-3.5 rounded-xl border border-neutral-900 space-y-2 text-xs text-neutral-300">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-white">1.</span>
                <span>Look at their top / latest post on X.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-white">2.</span>
                <span>Click <strong className="text-white">Reply 💬</strong> and press <strong className="text-white font-mono">Ctrl + V</strong> to paste your message.</span>
              </div>
            </div>

            <button
              onClick={() => setShowStepModal(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Done / Next Target →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default TargetDispatchPage;
