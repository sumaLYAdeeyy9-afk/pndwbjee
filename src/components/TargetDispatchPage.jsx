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
  Download,
  Clock,
  ShieldCheck,
  Lock,
  Sparkles
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
  
  // Pending verification popup state
  const [pendingConfirmTarget, setPendingConfirmTarget] = useState(null);

  // 10-Minute Lockout Cooldown State
  const [lockoutSeconds, setLockoutSeconds] = useState(() => {
    try {
      const storedUntil = localStorage.getItem('wbjee_strike_lockout_until');
      if (storedUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000));
        return remaining;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // All targets in specified order (with Suvendu Adhikari at the end)
  const targets = TARGET_HANDLES;
  const currentTarget = targets[currentIndex] || targets[0];

  // Timer interval for 10-minute lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      try {
        const storedUntil = localStorage.getItem('wbjee_strike_lockout_until');
        if (storedUntil) {
          const remaining = Math.max(0, Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000));
          setLockoutSeconds(remaining);
          if (remaining <= 0) {
            localStorage.removeItem('wbjee_strike_lockout_until');
          }
        } else {
          setLockoutSeconds(0);
        }
      } catch {
        setLockoutSeconds(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

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
  const isLocked = lockoutSeconds > 0;
  const canStrike = editedText.trim().length > 0 && !isOverLimit && !isLocked;

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

  // 1. User clicks Copy & Open X Profile
  const handleCopyAndStrike = () => {
    if (!currentTarget || !canStrike) return;

    // Copy text to clipboard
    navigator.clipboard.writeText(editedText).catch(() => {});
    setCopied(true);
    
    // Set pending target for confirmation pop-up
    setPendingConfirmTarget(currentTarget);

    // Open target profile in a new tab
    window.open(`https://x.com/${currentTarget.handle}`, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // 2. User confirms they have posted their reply -> Trigger Full-Page 10-Minute Lockout
  const handleConfirmPosted = (posted) => {
    if (posted && pendingConfirmTarget) {
      // Mark as struck
      const newStruck = [...new Set([...struckIds, pendingConfirmTarget.id])];
      setStruckIds(newStruck);
      try {
        localStorage.setItem('wbjee_struck_targets_all', JSON.stringify(newStruck));
      } catch (e) {
        console.error(e);
      }

      // Start 10-minute lockout (10 * 60 = 600 seconds)
      const lockoutEnd = Date.now() + 10 * 60 * 1000;
      try {
        localStorage.setItem('wbjee_strike_lockout_until', lockoutEnd.toString());
      } catch (e) {
        console.error(e);
      }
      setLockoutSeconds(600);

      // Trigger Confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#38bdf8', '#34d399', '#f59e0b']
      });

      if (onActionCompleted) {
        onActionCompleted('tweets');
      }

      // Advance to next target for when timer expires
      setCurrentIndex(prev => (prev < targets.length - 1 ? prev + 1 : 0));
    }

    // Close confirmation pop-up
    setPendingConfirmTarget(null);
  };

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalAll = targets.length;
  const struckCount = struckIds.length;
  const isCurrentStruck = struckIds.includes(currentTarget.id);

  // --------------------------------------------------------------------------
  // FULL PAGE LOCKOUT VIEW (NO OPTIONS LEFT WHILE TIMER RUNS)
  // --------------------------------------------------------------------------
  if (isLocked) {
    const progressPercent = Math.max(0, Math.min(100, ((600 - lockoutSeconds) / 600) * 100));

    return (
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
        
        {/* Minimal Header */}
        <header className="border-b border-neutral-900 bg-black/95 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={onBackToMain}
              className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Portal</span>
            </button>

            <div className="text-xs font-bold tracking-widest text-amber-400 uppercase flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>ANTI-SPAM SAFETY LOCKOUT</span>
            </div>

            <div className="text-xs font-mono text-neutral-400">
              <span className="text-white font-bold">{struckCount}</span> / {totalAll} struck
            </div>
          </div>
        </header>

        {/* FULL PAGE LOCKOUT CENTER CONTAINER */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-xl mx-auto w-full text-center space-y-8 animate-fade-in">
          
          {/* Big Glowing Lock Badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-neutral-950 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/10 mx-auto animate-pulse">
              <Lock className="w-10 h-10" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-lg">
              ⏳
            </div>
          </div>

          {/* Huge Digital Countdown Timer */}
          <div className="space-y-2">
            <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white select-none">
              {formatTime(lockoutSeconds)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Lockout Active • Cooldown in Progress
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Detailed Anti-Spam Explanation Card */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-5 text-left space-y-3 w-full shadow-xl">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why is this page locked?</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              To safeguard candidate accounts against Twitter/X automated spam detection, shadowbans, and rate limits, a mandatory <strong>10-minute cooldown</strong> is enforced after each reply.
            </p>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>Next target: <strong>@{currentTarget.handle}</strong></span>
              <span>Unlocks automatically at 00:00</span>
            </div>
          </div>

          {/* Helpful actions while waiting */}
          <div className="w-full space-y-3 pt-2">
            <button
              onClick={handleDownloadPoster}
              className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-neutral-400" />
              <span>Download Campaign Poster ({posterDownloaded ? 'Downloaded ✓' : 'Keep Ready'})</span>
            </button>

            <button
              onClick={onBackToMain}
              className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-900 font-semibold text-xs transition-all cursor-pointer"
            >
              View Main Petition & Analytics Dashboard →
            </button>
          </div>

        </main>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // NORMAL ACTIVE DISPATCH HUB VIEW (WHEN NOT LOCKED)
  // --------------------------------------------------------------------------
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

          {/* ACTION BUTTON */}
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
                </>
              )}
            </button>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 text-[11px] text-neutral-400 text-center leading-relaxed">
              💡 <strong>Action Flow:</strong> Click button → Paste (Ctrl+V) in @{currentTarget.handle}'s latest post reply → <strong>Attach poster</strong> → Confirm in popup to start 10m timer!
            </div>
          </div>

        </div>

      </main>

      {/* POPUP CONFIRMATION MODAL ("Have you posted your message?") */}
      {pendingConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-scale-in text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              💬
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">
                Have you posted your message?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Did you reply to <strong className="text-white">@{pendingConfirmTarget.handle}</strong>'s latest post on X and attach the campaign poster?
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 text-left space-y-2 text-xs text-neutral-300">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Anti-Spam 10-Minute Lockout</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Clicking <strong>"Yes, I Posted"</strong> will lock the entire strike hub for <strong>10 minutes</strong> to safeguard your account against X rate limits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleConfirmPosted(false)}
                className="w-full sm:w-1/2 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-bold text-xs transition-all cursor-pointer"
              >
                Not Yet / Retry
              </button>

              <button
                onClick={() => handleConfirmPosted(true)}
                className="w-full sm:w-1/2 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                Yes, I Posted! 🚀
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default TargetDispatchPage;
