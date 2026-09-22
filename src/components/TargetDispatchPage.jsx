import React, { useState, useEffect } from 'react';
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
  Download 
} from 'lucide-react';
import { TARGET_HANDLES } from '../data/targetHandles';
import { generateUniqueReply } from '../data/dynamicReplyGenerator';

export function TargetDispatchPage({ onBackToMain, onActionCompleted }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [struckIds, setStruckIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wbjee_struck_targets_all');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [posterDownloaded, setPosterDownloaded] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [lastStruckTarget, setLastStruckTarget] = useState(null);

  // All 41 targets remain visible and accessible in order (NO vanishing)
  const targets = TARGET_HANDLES;
  const currentTarget = targets[currentIndex] || targets[0];

  // Generate initial draft when target changes
  useEffect(() => {
    if (currentTarget) {
      const generated = generateUniqueReply();
      setEditedText(generated.text);
      setCopied(false);
    }
  }, [currentTarget?.id]);

  const charCount = editedText.length;
  const isOverLimit = charCount > 280;
  const canStrike = editedText.trim().length > 0 && !isOverLimit;

  // New Draft roll
  const handleShuffleDraft = () => {
    const generated = generateUniqueReply();
    setEditedText(generated.text);
    setCopied(false);
  };

  // Poster Download Handler
  const handleDownloadPoster = () => {
    const link = document.createElement('a');
    link.href = '/poster.jpeg';
    link.download = 'WBJEE_Decentralised_Counselling_Petition_Poster.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPosterDownloaded(true);
  };

  // Primary Strike Action: Copy & Open X Profile
  const handleCopyAndStrike = () => {
    if (!currentTarget || !canStrike) return;

    // 1. Copy text to clipboard
    navigator.clipboard.writeText(editedText).catch(() => {});
    setCopied(true);
    setLastStruckTarget(currentTarget);
    setShowStepModal(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#a3a3a3', '#38bdf8', '#f43f5e']
    });

    // Mark as struck for user reference
    const newStruck = [...new Set([...struckIds, currentTarget.id])];
    setStruckIds(newStruck);
    try {
      localStorage.setItem('wbjee_struck_targets_all', JSON.stringify(newStruck));
    } catch (e) {
      console.error(e);
    }

    if (onActionCompleted) {
      onActionCompleted('tweets');
    }

    // 2. Open target profile in a new tab
    window.open(`https://x.com/${currentTarget.handle}`, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const totalAll = targets.length;
  const struckCount = struckIds.length;
  const isCurrentStruck = struckIds.includes(currentTarget.id);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      
      {/* Pitch-Black Minimal Top Header */}
      <header className="border-b border-neutral-900 bg-black/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToMain}
            className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Portal</span>
          </button>

          <div className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
            TARGET STRIKE HUB
          </div>

          <div className="text-xs font-mono text-neutral-400">
            <span className="text-white font-bold">{struckCount}</span> / {totalAll} struck
          </div>
        </div>
      </header>

      {/* Main Spacious Container */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col justify-center space-y-6">

        {/* Poster Download & Attachment Directive Banner */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start space-x-3.5">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-800 shrink-0 bg-neutral-900">
              <img 
                src="/poster.jpeg" 
                alt="WBJEE Campaign Poster" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  Official Campaign Poster
                </span>
                <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full font-mono">
                  #JusticeForWBJEE
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                <strong>Crucial:</strong> Download this poster and attach it to your reply on X to maximize visibility and grab public attention!
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPoster}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-md active:scale-[0.98]"
          >
            {posterDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span>Poster Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Poster</span>
              </>
            )}
          </button>
        </div>

        {/* ENLARGED ACTIVE TARGET FLASHCARD */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          
          {/* Target Account Header & Card Navigation */}
          <div className="flex items-start justify-between border-b border-neutral-900 pb-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-xl text-white shrink-0 shadow-inner">
                {currentTarget.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-extrabold text-lg sm:text-xl text-white">
                    {currentTarget.name}
                  </h2>
                  {isCurrentStruck && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ✓ Struck
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <a
                    href={`https://x.com/${currentTarget.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition-colors inline-flex items-center space-x-1"
                  >
                    <span>@{currentTarget.handle}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-neutral-400">{currentTarget.role}</span>
                </div>
              </div>
            </div>

            {/* Target Card Navigator */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono text-neutral-500 hidden sm:inline-block mr-1">
                {currentIndex + 1} of {totalAll}
              </span>
              <button
                onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : targets.length - 1))}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all cursor-pointer"
                title="Previous target"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex(prev => (prev < targets.length - 1 ? prev + 1 : 0))}
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold"
                title="Next target"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ENLARGED COMPOSER BOX */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Grievance Message
              </label>
              <button
                onClick={handleShuffleDraft}
                className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Roll new text</span>
              </button>
            </div>

            {/* Large Textarea (Editable, but edit is not mandatory) */}
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={6}
              maxLength={280}
              className={`w-full p-4 sm:p-5 rounded-2xl bg-black border text-xs sm:text-sm leading-relaxed focus:outline-none transition-all resize-none font-sans ${
                isOverLimit
                  ? 'border-red-500 text-white'
                  : 'border-neutral-700 text-white focus:border-white'
              }`}
              placeholder="Your grievance message..."
            />

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-neutral-500 text-[11px]">
                You can copy immediately or edit the text if you wish
              </span>
              <span className={`font-mono font-bold ${isOverLimit ? 'text-red-400' : 'text-neutral-400'}`}>
                {charCount} / 280
              </span>
            </div>
          </div>

          {/* SINGLE PROMINENT ACTION BUTTON */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCopyAndStrike}
              disabled={!canStrike}
              className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xl ${
                canStrike
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
                  <span>Copy Message & Open @{currentTarget.handle} on X</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 text-[11px] text-neutral-400 text-center leading-relaxed">
              💡 <strong>Action Flow:</strong> Click button → Paste (Ctrl+V) in @{currentTarget.handle}'s latest post reply → <strong>Attach the downloaded poster</strong>!
            </div>
          </div>

        </div>

      </main>

      {/* 2-Step Strike Instructions Modal */}
      {showStepModal && lastStruckTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mx-auto font-black text-xl shadow-lg">
              ✓
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                Message Copied!
              </h3>
              <p className="text-xs text-neutral-400">
                Opened @{lastStruckTarget.handle} on X in a new tab.
              </p>
            </div>

            <div className="bg-black p-4 rounded-2xl border border-neutral-900 space-y-3 text-xs text-neutral-300">
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Look at <strong className="text-white">@{lastStruckTarget.handle}</strong>'s latest post.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Click <strong className="text-white">Reply 💬</strong>, press <strong className="text-white font-mono">Ctrl + V</strong> to paste, and <strong>attach the poster</strong>!</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPoster}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Poster</span>
              </button>

              <button
                onClick={() => {
                  setShowStepModal(false);
                  setCurrentIndex(prev => (prev < targets.length - 1 ? prev + 1 : 0));
                }}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg"
              >
                Next Target →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TargetDispatchPage;
