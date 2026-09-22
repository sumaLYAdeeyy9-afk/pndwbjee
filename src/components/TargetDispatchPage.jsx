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
  Flame,
  AlertTriangle,
  ArrowRight,
  Mail
} from 'lucide-react';
import { TARGET_HANDLES } from '../data/targetHandles';
import { generateUniqueReply } from '../data/dynamicReplyGenerator';
import { 
  fetchTargetStrikeCounts, 
  incrementTargetStrike, 
  subscribeToTargetStrikes, 
  getLocalStrikeCounts 
} from '../lib/targetStrikeStore';

const PENDING_TOKEN_KEY = 'wbjee_pending_strike_token';
const LOCKOUT_KEY = 'wbjee_strike_lockout_until';
const STRUCK_TARGETS_KEY = 'wbjee_struck_targets_all';
const POSTER_DOWNLOADED_KEY = 'wbjee_poster_downloaded_v2';

export function TargetDispatchPage({ onBackToMain, onActionCompleted, onNavigateToEmail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [struckIds, setStruckIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STRUCK_TARGETS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Mandatory Poster Download State (Persisted)
  const [posterDownloaded, setPosterDownloaded] = useState(() => {
    try {
      return localStorage.getItem(POSTER_DOWNLOADED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showPosterWarningModal, setShowPosterWarningModal] = useState(false);
  
  // Real-time Global Strike Counts Store
  const [strikeCounts, setStrikeCounts] = useState(() => getLocalStrikeCounts());

  // Persistent Pending Strike Token (Survives Reloads)
  const [pendingToken, setPendingToken] = useState(() => {
    try {
      const saved = localStorage.getItem(PENDING_TOKEN_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 10-Minute Lockout Cooldown State
  const [lockoutSeconds, setLockoutSeconds] = useState(() => {
    try {
      const storedUntil = localStorage.getItem(LOCKOUT_KEY);
      if (storedUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000));
        return remaining;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // Fetch initial global counts & subscribe to real-time updates
  useEffect(() => {
    fetchTargetStrikeCounts().then(setStrikeCounts);
    const unsubscribe = subscribeToTargetStrikes(setStrikeCounts);
    return () => unsubscribe();
  }, []);

  // All targets in specified order (with Suvendu Adhikari at the end)
  const targets = TARGET_HANDLES;
  const currentTarget = targets[currentIndex] || targets[0];

  // Timer interval for 10-minute lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      try {
        const storedUntil = localStorage.getItem(LOCKOUT_KEY);
        if (storedUntil) {
          const remaining = Math.max(0, Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000));
          setLockoutSeconds(remaining);
          if (remaining <= 0) {
            localStorage.removeItem(LOCKOUT_KEY);
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

  // Current target's live community count
  const currentHandleClean = currentTarget.handle.replace('@', '').trim();
  const currentTargetStrikes = strikeCounts[currentHandleClean] || 0;

  // New Draft roll
  const handleShuffleDraft = () => {
    const generated = generateUniqueReply();
    setEditedText(generated.text);
    setCopied(false);
  };

  // Mandatory Poster Download Handler
  const handleDownloadPoster = (andProceed = false) => {
    const link = document.createElement('a');
    link.href = '/poster.jpeg';
    link.download = 'WBJEE_Decentralised_Counselling_Petition_Poster.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setPosterDownloaded(true);
    try {
      localStorage.setItem(POSTER_DOWNLOADED_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    setShowPosterWarningModal(false);

    if (andProceed) {
      setTimeout(() => {
        executeStrikeAction();
      }, 300);
    }
  };

  // Internal execution of strike
  const executeStrikeAction = () => {
    if (!currentTarget) return;

    // 1. Copy text to clipboard
    navigator.clipboard.writeText(editedText).catch(() => {});
    setCopied(true);
    
    // 2. Register persistent strike token in localStorage (persists across page reloads)
    const token = {
      tokenId: `strike_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      targetId: currentTarget.id,
      handle: currentTarget.handle,
      name: currentTarget.name,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(PENDING_TOKEN_KEY, JSON.stringify(token));
    } catch (e) {
      console.error(e);
    }
    setPendingToken(token);

    // 3. Open target profile in a new tab
    window.open(`https://x.com/${currentTarget.handle}`, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // 1. User clicks Copy & Open X Profile -> Check Mandatory Poster Download First
  const handleCopyAndStrike = () => {
    if (!currentTarget || !canStrike) return;

    // Enforce mandatory poster download
    if (!posterDownloaded) {
      setShowPosterWarningModal(true);
      return;
    }

    executeStrikeAction();
  };

  // 2. User confirms they have posted their reply -> Increment Global Counter & Trigger Full-Page 10-Minute Lockout
  const handleConfirmPosted = async (posted) => {
    if (posted && pendingToken) {
      const activeHandle = pendingToken.handle;

      // Increment global counter live for this X profile across all users
      const updatedCounts = await incrementTargetStrike(activeHandle);
      if (updatedCounts) {
        setStrikeCounts(updatedCounts);
      }

      // Mark as struck in user's personal history
      const newStruck = [...new Set([...struckIds, pendingToken.targetId])];
      setStruckIds(newStruck);
      try {
        localStorage.setItem(STRUCK_TARGETS_KEY, JSON.stringify(newStruck));
      } catch (e) {
        console.error(e);
      }

      // Start 10-minute lockout (600 seconds)
      const lockoutEnd = Date.now() + 10 * 60 * 1000;
      try {
        localStorage.setItem(LOCKOUT_KEY, lockoutEnd.toString());
      } catch (e) {
        console.error(e);
      }
      setLockoutSeconds(600);

      // Trigger Confetti
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#38bdf8', '#34d399', '#f59e0b']
      });

      if (onActionCompleted) {
        onActionCompleted('tweets');
      }

      // Advance to next target
      setCurrentIndex(prev => (prev < targets.length - 1 ? prev + 1 : 0));
    }

    // Always clear the token once responded to (Yes or Not Yet)
    try {
      localStorage.removeItem(PENDING_TOKEN_KEY);
    } catch (e) {
      console.error(e);
    }
    setPendingToken(null);
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

  // Total global strikes across all targets
  const totalGlobalStrikes = Object.values(strikeCounts).reduce((a, b) => a + Number(b || 0), 0);

  // --------------------------------------------------------------------------
  // FULL PAGE LOCKOUT VIEW (SMARTPHONE & DESKTOP PERFECTED)
  // --------------------------------------------------------------------------
  if (isLocked) {
    const progressPercent = Math.max(0, Math.min(100, ((600 - lockoutSeconds) / 600) * 100));

    return (
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white px-3 sm:px-0">
        
        {/* Minimal Responsive Header */}
        <header className="border-b border-neutral-900 bg-black/95 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
            <button
              onClick={onBackToMain}
              className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Portal</span>
            </button>

            <div className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-amber-400 uppercase flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="truncate">SAFETY LOCKOUT</span>
            </div>

            <div className="text-xs font-mono text-neutral-400 shrink-0">
              <span className="text-white font-bold">{struckCount}</span>/{totalAll}
            </div>
          </div>
        </header>

        {/* FULL PAGE LOCKOUT CENTER CONTAINER */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-10 max-w-lg mx-auto w-full text-center space-y-6 sm:space-y-8 animate-fade-in my-auto">
          
          {/* Big Glowing Lock Badge */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-neutral-950 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/10 mx-auto animate-pulse">
              <Lock className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-lg">
              ⏳
            </div>
          </div>

          {/* Huge Digital Countdown Timer */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white select-none">
              {formatTime(lockoutSeconds)}
            </div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
              10m Cooldown Active • Anti-Spam Safeguard
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
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 sm:p-5 text-left space-y-2.5 w-full shadow-xl">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Why is this page locked?</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              To protect student accounts from Twitter/X automated spam detection and shadowbans, a mandatory <strong>10-minute cooldown</strong> is enforced after each reply.
            </p>
            <div className="pt-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-1 text-[11px] text-neutral-500 font-mono">
              <span>Next in queue: <strong className="text-neutral-300">@{currentTarget.handle}</strong></span>
              <span className="text-amber-400 font-bold">⚡ {totalGlobalStrikes.toLocaleString()} Total Strikes</span>
            </div>
          </div>

          {/* Action while waiting: Email Higher Authorities */}
          <div className="w-full bg-gradient-to-br from-rose-950/40 via-neutral-900/95 to-black border border-rose-500/40 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
              <Mail className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span>While You Wait • Take Action</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug">
                Haven't mailed higher authorities yet?
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Send an official legal representation to the Higher Education Dept, WBJEEB Chairman, JU, CU & State Engineering Universities in just 1 tap!
              </p>
            </div>

            <button
              onClick={onNavigateToEmail || onBackToMain}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/60 cursor-pointer active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>Email Higher Authorities Now</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Helpful actions while waiting */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              onClick={() => handleDownloadPoster(false)}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-neutral-400" />
              <span>{posterDownloaded ? 'Poster Downloaded ✓' : 'Download Poster (Keep Ready)'}</span>
            </button>

            <button
              onClick={onBackToMain}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-900 font-semibold text-xs transition-all cursor-pointer active:scale-[0.99]"
            >
              Return to Main Petition Dashboard →
            </button>
          </div>

        </main>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // NORMAL ACTIVE DISPATCH HUB VIEW (MOBILE & DESKTOP PERFECTED)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      
      {/* Pitch-Black Minimal Top Header */}
      <header className="border-b border-neutral-900 bg-black/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToMain}
            className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Main Portal</span>
          </button>

          <div className="text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-neutral-300 uppercase flex items-center space-x-2">
            <span>TARGET STRIKE</span>
            <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{totalGlobalStrikes.toLocaleString()}</span>
            </span>
          </div>

          <div className="text-xs font-mono text-neutral-400">
            <span className="text-white font-bold">{struckCount}</span>/{totalAll}
          </div>
        </div>
      </header>

      {/* Main Spacious Container */}
      <main className="flex-1 max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full flex flex-col justify-center space-y-4 sm:space-y-6">

        {/* Poster Download & Attachment Directive Banner */}
        <div className={`border rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl transition-all ${
          posterDownloaded 
            ? 'bg-[#0a0a0a] border-neutral-800' 
            : 'bg-amber-950/20 border-amber-500/40 shadow-amber-500/5'
        }`}>
          <div className="flex items-start space-x-3 sm:space-x-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-neutral-800 shrink-0 bg-neutral-900">
              <img 
                src="/poster.jpeg" 
                alt="WBJEE Campaign Poster" 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-black uppercase text-white tracking-wider">
                  Campaign Poster
                </span>
                {!posterDownloaded ? (
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    *Download Mandatory
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    ✓ Downloaded
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed max-w-md">
                <strong>Crucial:</strong> Download this poster and attach it to your reply on X to maximize visibility!
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDownloadPoster(false)}
            className={`w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer shadow-md active:scale-[0.98] ${
              posterDownloaded
                ? 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                : 'bg-white hover:bg-neutral-200 text-black shadow-lg animate-bounce'
            }`}
          >
            {posterDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Poster Saved ✓</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Poster (Required)</span>
              </>
            )}
          </button>
        </div>

        {/* ENLARGED ACTIVE TARGET FLASHCARD (SMARTPHONE OPTIMIZED) */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-4 sm:space-y-6 animate-fade-in">
          
          {/* Target Account Header, Live Community Counter, & Card Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-neutral-900 pb-4 sm:pb-5 gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-lg sm:text-xl text-white shrink-0 shadow-inner">
                {currentTarget.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="font-extrabold text-base sm:text-xl text-white truncate">
                    {currentTarget.name}
                  </h2>
                  
                  {/* Live Community Strikes Counter for this Target */}
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold shadow-sm">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{currentTargetStrikes.toLocaleString()} Replies</span>
                  </div>

                  {isCurrentStruck && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ✓ Struck
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                  <a
                    href={`https://x.com/${currentTarget.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-neutral-300 hover:text-white transition-colors inline-flex items-center space-x-1"
                  >
                    <span>@{currentTarget.handle}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <span className="text-[11px] sm:text-xs text-neutral-400 truncate block sm:inline">{currentTarget.role}</span>
                </div>
              </div>
            </div>

            {/* Target Card Navigator */}
            <div className="flex items-center justify-between sm:justify-end space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900/60">
              <span className="text-xs font-mono text-neutral-500 mr-1">
                {currentIndex + 1} of {totalAll}
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : targets.length - 1))}
                  className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-all cursor-pointer active:scale-95"
                  title="Previous target"
                  aria-label="Previous target"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => (prev < targets.length - 1 ? prev + 1 : 0))}
                  className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold active:scale-95"
                  title="Next target"
                  aria-label="Next target"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ENLARGED COMPOSER BOX */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] sm:text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Grievance Message
              </label>
              <button
                onClick={handleShuffleDraft}
                className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800 active:scale-95"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Roll text</span>
              </button>
            </div>

            {/* Large Textarea (Editable) */}
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={5}
              maxLength={280}
              className={`w-full p-3.5 sm:p-5 rounded-2xl bg-black border text-xs sm:text-sm leading-relaxed focus:outline-none transition-all resize-none font-sans ${
                isOverLimit
                  ? 'border-red-500 text-white'
                  : 'border-neutral-700 text-white focus:border-white'
              }`}
              placeholder="Your grievance message..."
            />

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-neutral-500 text-[10px] sm:text-[11px]">
                Copy immediately or edit as you wish
              </span>
              <span className={`font-mono font-bold text-xs ${isOverLimit ? 'text-red-400' : 'text-neutral-400'}`}>
                {charCount} / 280
              </span>
            </div>
          </div>

          {/* ACTION BUTTON WITH MANDATORY POSTER PROMPT */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleCopyAndStrike}
              disabled={!canStrike}
              className={`w-full min-h-[52px] py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xl active:scale-[0.99] ${
                !posterDownloaded
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/20'
                  : canStrike
                    ? 'bg-white text-black hover:bg-neutral-200 shadow-white/10'
                    : 'bg-neutral-900 text-neutral-600 border border-neutral-800/80 cursor-not-allowed'
              }`}
            >
              {!posterDownloaded ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Poster & Open @{currentTarget.handle}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : copied ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied! Opening @{currentTarget.handle} on X...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message & Open @{currentTarget.handle} on X</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="bg-neutral-950 p-3 sm:p-3.5 rounded-xl border border-neutral-900 text-[11px] text-neutral-400 text-center leading-relaxed">
              💡 <strong>Action Flow:</strong> Click button → Paste (Ctrl+V) in @{currentTarget.handle}'s latest post reply → <strong>Attach poster</strong> → Confirm popup to start 10m timer!
            </div>
          </div>

        </div>

      </main>

      {/* MANDATORY POSTER WARNING MODAL */}
      {showPosterWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-scale-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">
                Download Campaign Poster First
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Poster download is <strong>mandatory</strong>. Every student reply on X must attach the official petition poster so our demands get noticed immediately!
              </p>
            </div>

            <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-800 mx-auto bg-neutral-900 shadow-md">
              <img src="/poster.jpeg" alt="Poster preview" className="w-full h-full object-cover object-top" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowPosterWarningModal(false)}
                className="w-full sm:w-1/3 min-h-[44px] py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDownloadPoster(true)}
                className="w-full sm:w-2/3 min-h-[44px] py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download & Strike Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERSISTENT CONFIRMATION POPUP MODAL (SURVIVES RELOADS) */}
      {pendingToken && !isLocked && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 sm:space-y-6 shadow-2xl animate-scale-in text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
              💬
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">
                Have you posted your message?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Did you reply to <strong className="text-white">@{pendingToken.handle}</strong>'s latest post on X and attach the campaign poster?
              </p>
            </div>

            <div className="bg-neutral-950 p-3.5 sm:p-4 rounded-2xl border border-neutral-900 text-left space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Anti-Spam 10-Minute Lockout</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Clicking <strong>"Yes, I Posted"</strong> records your strike (+1 Live Counter) and locks the strike hub for <strong>10 minutes</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => handleConfirmPosted(false)}
                className="w-full sm:w-1/2 min-h-[46px] py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 font-bold text-xs transition-all cursor-pointer"
              >
                Not Yet / Retry
              </button>

              <button
                onClick={() => handleConfirmPosted(true)}
                className="w-full sm:w-1/2 min-h-[46px] py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg active:scale-[0.98]"
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
