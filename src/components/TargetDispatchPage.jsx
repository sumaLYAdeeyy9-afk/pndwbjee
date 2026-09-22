import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Target, Sparkles, Send, Copy, Check, ExternalLink, RefreshCw, 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, Smartphone, 
  Globe, MessageSquare, Download, Flame, Users, Pin, ArrowLeft,
  Share2, Edit3, Lock, Unlock, Zap
} from 'lucide-react';
import { TwitterIcon } from './Icons';
import { TARGET_HANDLES, TARGET_CATEGORIES, getTargetById } from '../data/targetHandles';
import { GRIEVANCE_ANGLES, generateUniqueReply, checkTextCustomized } from '../data/dynamicReplyGenerator';
import CampaignPosterCanvas from './CampaignPosterCanvas';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper to detect mobile device
function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
}

export default function TargetDispatchPage({ onBackToMain, onActionCompleted }) {
  // Target State
  const [selectedTarget, setSelectedTarget] = useState(() => TARGET_HANDLES[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Draft & Generation State
  const [selectedAngleId, setSelectedAngleId] = useState(GRIEVANCE_ANGLES[0].id);
  const [originalDraft, setOriginalDraft] = useState('');
  const [editedText, setEditedText] = useState('');
  const [customizationStatus, setCustomizationStatus] = useState({ isValid: false, reason: '' });

  // UI / Action State
  const [copied, setCopied] = useState(false);
  const [mobileOnlyNotice, setMobileOnlyNotice] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [customTweetId, setCustomTweetId] = useState('');
  const [pinnedTweetInfo, setPinnedTweetInfo] = useState(null);

  // Embed State
  const embedContainerRef = useRef(null);
  const [isEmbedLoading, setIsEmbedLoading] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);

  // Initialize first draft
  useEffect(() => {
    const generated = generateUniqueReply(selectedAngleId);
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
  }, [selectedAngleId]);

  // Validate customization whenever text changes
  useEffect(() => {
    const status = checkTextCustomized(originalDraft, editedText);
    setCustomizationStatus(status);
  }, [editedText, originalDraft]);

  // Load Twitter Widgets SDK with strict timeout protection
  useEffect(() => {
    let isCancelled = false;
    let timeoutId = null;

    setIsEmbedLoading(true);
    setEmbedLoaded(false);

    const finishLoading = (success = false) => {
      if (!isCancelled) {
        setIsEmbedLoading(false);
        setEmbedLoaded(success);
      }
    };

    // Strict 2-second timeout to prevent infinite spinning
    timeoutId = setTimeout(() => {
      finishLoading(false);
    }, 2000);

    const renderEmbed = () => {
      if (!embedContainerRef.current || !window.twttr || !window.twttr.widgets) {
        finishLoading(false);
        return;
      }

      embedContainerRef.current.innerHTML = '';

      if (customTweetId) {
        // Specific Tweet ID embed (supported reliably by X widgets)
        window.twttr.widgets.createTweet(
          customTweetId,
          embedContainerRef.current,
          {
            theme: 'dark',
            conversation: 'none',
            dnt: true,
            align: 'center'
          }
        ).then((el) => {
          clearTimeout(timeoutId);
          finishLoading(!!el);
        }).catch(() => {
          clearTimeout(timeoutId);
          finishLoading(false);
        });
      } else {
        // Timeline profile embed attempt
        window.twttr.widgets.createTimeline(
          {
            sourceType: 'profile',
            screenName: selectedTarget.handle
          },
          embedContainerRef.current,
          {
            tweetLimit: 1,
            theme: 'dark',
            chrome: 'noheader nofooter noborders transparent',
            dnt: true,
            width: '100%'
          }
        ).then((el) => {
          clearTimeout(timeoutId);
          finishLoading(!!el);
        }).catch(() => {
          clearTimeout(timeoutId);
          finishLoading(false);
        });
      }
    };

    const loadTwitterSDK = () => {
      if (window.twttr && window.twttr.widgets) {
        renderEmbed();
        return;
      }

      const scriptId = 'twitter-wjs';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => {
          if (!isCancelled && window.twttr) {
            renderEmbed();
          }
        };
        script.onerror = () => {
          clearTimeout(timeoutId);
          finishLoading(false);
        };
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.twttr && window.twttr.widgets) {
            clearInterval(interval);
            if (!isCancelled) renderEmbed();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          finishLoading(false);
        }, 1500);
      }
    };

    loadTwitterSDK();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedTarget, customTweetId]);

  // Fetch / Sync community pinned strike from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchPinnedStrike() {
      try {
        const { data, error } = await supabase
          .from('campaign_pinned_strike')
          .select('*')
          .eq('id', 'active_strike')
          .single();

        if (data && !error && data.target_handle) {
          setPinnedTweetInfo(data);
        }
      } catch (err) {
        // fallback silent
      }
    }

    fetchPinnedStrike();
  }, []);

  // Filter targets
  const filteredTargets = TARGET_HANDLES.filter(target => {
    const matchesCategory = selectedCategory === 'all' || target.category === selectedCategory;
    const matchesSearch = target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          target.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          target.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          target.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShuffleDraft = () => {
    const generated = generateUniqueReply(selectedAngleId);
    setOriginalDraft(generated.text);
    setEditedText(generated.text);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#38bdf8', '#10b981', '#fbbf24']
    });
    if (onActionCompleted) {
      onActionCompleted('tweets');
    }
  };

  // 1. Copy & Direct Action
  const handleCopyAndStrike = () => {
    if (!customizationStatus.isValid) return;

    navigator.clipboard.writeText(editedText).then(() => {
      setCopied(true);
      triggerCelebration();
      setShowSuccessToast(true);
      setTimeout(() => setCopied(false), 3000);
      setTimeout(() => setShowSuccessToast(false), 6000);

      // Open target's profile / post
      const targetUrl = customTweetId 
        ? `https://x.com/${selectedTarget.handle}/status/${customTweetId}`
        : `https://x.com/${selectedTarget.handle}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  };

  // 2. Web Reply Intent
  const handleWebReply = () => {
    if (!customizationStatus.isValid) return;

    triggerCelebration();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);

    const replyUrl = customTweetId
      ? `https://x.com/intent/tweet?in_reply_to=${customTweetId}&text=${encodeURIComponent(editedText)}`
      : `https://x.com/intent/tweet?text=${encodeURIComponent(editedText)}`;
    window.open(replyUrl, '_blank', 'noopener,noreferrer');
  };

  // 3. Mobile App Dispatch
  const handleAppDispatch = (e) => {
    if (!customizationStatus.isValid) {
      e.preventDefault();
      return;
    }

    if (!isMobileDevice()) {
      e.preventDefault();
      setMobileOnlyNotice(true);
      setTimeout(() => setMobileOnlyNotice(false), 6000);
      return;
    }

    // Copy to clipboard automatically on mobile
    navigator.clipboard.writeText(editedText).catch(() => {});

    triggerCelebration();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);
  };

  const charCount = editedText.length;
  const isOverLimit = charCount > 280;

  // Deep link for native app
  const appReplyUrl = customTweetId
    ? `twitter://status?id=${customTweetId}`
    : `twitter://user?screen_name=${selectedTarget.handle}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Top Header & Breadcrumbs */}
      <div className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToMain}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Portal</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 border-l border-slate-800 pl-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Audience Hijacking Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
              <span>41 High-Profile Targets Active</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Page Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-sky-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-lg shadow-rose-950/40">
            <Target className="w-4 h-4 text-rose-400" />
            <span>Target Dispatch & Public Reply Hijack Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Amplify WBJEE 2026 into the Public Timelines
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Directly target journalists, education advocates, and key politicians. When they post, reply with your <strong className="text-white font-bold">personalized talking points</strong> and the <strong className="text-sky-400 font-bold">official petition poster</strong> to force our demands in front of their massive audiences.
          </p>
        </div>

        {/* Global Alert / Pinned Community Strike Notice */}
        {pinnedTweetInfo && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded">
                    ⚡ Community Strike Target Pinned
                  </span>
                  <span className="text-slate-300 text-xs font-bold font-mono">
                    @{pinnedTweetInfo.target_handle}
                  </span>
                </div>
                <p className="text-white text-xs sm:text-sm font-semibold mt-0.5">
                  {pinnedTweetInfo.title || 'All hands strike on this target post!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const found = TARGET_HANDLES.find(t => t.handle.toLowerCase() === pinnedTweetInfo.target_handle.toLowerCase());
                if (found) setSelectedTarget(found);
                if (pinnedTweetInfo.tweet_id) setCustomTweetId(pinnedTweetInfo.tweet_id);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950 cursor-pointer flex items-center space-x-1.5 shrink-0"
            >
              <span>Load Pinned Strike</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3-Column Command Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 41-Target Matrix Directory (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Select Target ({filteredTargets.length})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                  41 Total
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search journalist, politician, advocate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {TARGET_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      selectedCategory === cat.id
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Scrollable Target List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredTargets.map(target => {
                  const isSelected = selectedTarget.id === target.id;
                  return (
                    <div
                      key={target.id}
                      onClick={() => {
                        setSelectedTarget(target);
                        setCustomTweetId('');
                      }}
                      className={`p-3 rounded-2xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-sky-950/60 border-sky-500 text-white shadow-lg shadow-sky-950/50'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white">
                              {target.name}
                            </span>
                            {target.priority === 'critical' && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.2 rounded border border-rose-500/30">
                                High Priority
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-sky-400 font-semibold block">
                            @{target.handle}
                          </span>
                        </div>

                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                          {target.role.split('/')[0]}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {target.bio}
                      </p>
                    </div>
                  );
                })}

                {filteredTargets.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No public figures matching "{searchQuery}"
                  </div>
                )}
              </div>

            </div>

            {/* Campaign Poster Downloader Widget */}
            <CampaignPosterCanvas />

          </div>

          {/* MIDDLE COLUMN: Live Target Strike & Post Terminal (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
              
              {/* Header of Active Target */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-rose-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-sky-950/60 ring-2 ring-sky-500/30">
                    {selectedTarget.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-sm text-white">{selectedTarget.name}</span>
                      <span className="text-sky-400 text-xs bg-sky-500/10 rounded-full px-1 border border-sky-500/30">✓</span>
                    </div>
                    <span className="text-sky-400 text-xs font-mono font-semibold">@{selectedTarget.handle}</span>
                  </div>
                </div>

                <a
                  href={`https://x.com/${selectedTarget.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all flex items-center space-x-1.5 text-xs font-bold"
                  title="Open live profile on X.com"
                >
                  <TwitterIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* High-Impact 1-Click Latest Post Launcher */}
              <div className="mb-4">
                <a
                  href={`https://x.com/${selectedTarget.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-sky-950 transition-all cursor-pointer"
                >
                  <TwitterIcon className="w-4 h-4 fill-current" />
                  <span>⚡ Open @{selectedTarget.handle}'s Latest Posts on X</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Direct Tweet URL / Custom Target Status ID Input */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Pin className="w-3 h-3 text-rose-400" />
                    <span>Target Specific Tweet (Paste URL or ID):</span>
                  </label>
                  {customTweetId && (
                    <button
                      onClick={() => setCustomTweetId('')}
                      className="text-[10px] text-rose-400 hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. https://x.com/.../status/183765123456"
                    value={customTweetId}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      const match = val.match(/status\/(\d+)/);
                      if (match) {
                        setCustomTweetId(match[1]);
                      } else {
                        setCustomTweetId(val);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Live Embed / Target Action Spotlight Terminal */}
              <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-3 flex flex-col justify-center min-h-[300px]">
                
                <div className="flex items-center justify-between px-1 py-1 mb-2 border-b border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <RefreshCw className={`w-3 h-3 text-sky-400 ${isEmbedLoading ? 'animate-spin' : ''}`} />
                    <span>Live Post Terminal</span>
                  </span>
                  <a
                    href={`https://x.com/${selectedTarget.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-sky-400 hover:underline font-mono"
                  >
                    @{selectedTarget.handle} feed →
                  </a>
                </div>

                {isEmbedLoading ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 text-xs font-semibold">
                      Connecting to @{selectedTarget.handle}...
                    </p>
                  </div>
                ) : embedLoaded ? (
                  /* Rendered Twitter Widget */
                  <div ref={embedContainerRef} className="w-full flex justify-center my-2" />
                ) : (
                  /* High-Utility Target Spotlight Card */
                  <div className="space-y-3 my-1">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          {selectedTarget.role}
                        </span>
                        {selectedTarget.priority === 'critical' && (
                          <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            High Priority Target
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedTarget.bio}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-slate-800/80 text-left space-y-2">
                      <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <span>🎯 3-Step Hijack Strike:</span>
                      </h4>
                      <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                        <li>Open <strong className="text-sky-400">@{selectedTarget.handle}'s</strong> feed on X to see their newest post.</li>
                        <li>Personalize your petition talking point on the right.</li>
                        <li>Click <strong className="text-rose-400">"Copy & Open Target Post"</strong> and paste in their top reply thread!</li>
                      </ol>
                    </div>

                    <div className="pt-1 flex items-center justify-center space-x-2">
                      <a
                        href={`https://x.com/search?q=from%3A${selectedTarget.handle}&f=live`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-sky-400 hover:text-sky-300 underline font-medium flex items-center space-x-1"
                      >
                        <span>Search @{selectedTarget.handle}'s latest live tweets</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Twitter Widgets target container (hidden or active) */}
                <div ref={embedContainerRef} className={`${embedLoaded ? 'block' : 'hidden'} w-full flex justify-center`} />

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Anti-Spam Mandatory Customization Studio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Petition Reply Studio
                  </h3>
                </div>

                <button
                  onClick={handleShuffleDraft}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[11px] font-bold border border-sky-500/30 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>🎲 Generate Draft</span>
                </button>
              </div>

              {/* Petition Angle Selector */}
              <div className="mb-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Choose Petition Grievance Angle:
                </label>
                <select
                  value={selectedAngleId}
                  onChange={(e) => setSelectedAngleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500 font-sans"
                >
                  {GRIEVANCE_ANGLES.map(angle => (
                    <option key={angle.id} value={angle.id}>
                      {angle.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mandatory Edit Warning / Status */}
              <div className={`p-3 rounded-2xl border text-xs mb-3 transition-all ${
                customizationStatus.isValid
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-950/40'
                  : 'bg-amber-950/90 border-amber-500/60 text-amber-200'
              }`}>
                <div className="flex items-start space-x-2.5">
                  {customizationStatus.isValid ? (
                    <Unlock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block font-bold text-[11px]">
                      {customizationStatus.isValid ? '✅ Personalization Verified!' : '🔒 Mandatory Customization Required'}
                    </strong>
                    <p className="text-[11px] leading-relaxed mt-0.5 opacity-90">
                      {customizationStatus.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Editable Reply Textarea */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Edit Your Talking Point (No @ tags):
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                    {charCount} / 280
                  </span>
                </div>

                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={8}
                  className={`w-full p-3.5 rounded-2xl bg-slate-950 border text-white text-xs leading-relaxed focus:outline-none transition-all resize-y font-sans ${
                    !customizationStatus.isValid
                      ? 'border-amber-500/80 focus:border-amber-400'
                      : isOverLimit
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-emerald-500/80 focus:border-emerald-400'
                  }`}
                  placeholder="Personalize your reply..."
                />
              </div>

              {isOverLimit && (
                <p className="text-[11px] text-rose-400 mb-3">
                  ⚠️ Tweet exceeds 280 characters. Shorten slightly before posting.
                </p>
              )}

              {/* Strike Action Buttons (Active only when customized) */}
              <div className="space-y-2.5 pt-1">
                
                {/* 1. Primary Copy & Open Target Tweet */}
                <button
                  onClick={handleCopyAndStrike}
                  disabled={!customizationStatus.isValid}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl transition-all ${
                    customizationStatus.isValid
                      ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white cursor-pointer shadow-rose-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied & Opening Target Post!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Edited Reply & Open Target Post</span>
                    </>
                  )}
                </button>

                {/* 2. Web Intent Direct Reply */}
                <button
                  onClick={handleWebReply}
                  disabled={!customizationStatus.isValid}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                    customizationStatus.isValid
                      ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700 cursor-pointer'
                      : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Reply via Web X.com Intent</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>

                {/* 3. Native Mobile App Dispatch */}
                <a
                  href={customizationStatus.isValid ? appReplyUrl : '#'}
                  onClick={handleAppDispatch}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all text-center ${
                    customizationStatus.isValid
                      ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-950 cursor-pointer'
                      : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Reply in Native X App (Mobile)</span>
                </a>

              </div>

            </div>

            {/* Mobile Only Notice Banner */}
            {mobileOnlyNotice && (
              <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-100 text-xs flex items-start space-x-3 shadow-2xl animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-amber-300 font-bold text-xs block">
                    Mobile Device Only Action
                  </strong>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    Direct X App dispatch is for phones with the X app installed. On Desktop, click <strong>"Copy Edited Reply & Open Target Post"</strong> or <strong>"Reply via Web X.com"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center space-x-2.5 shadow-2xl animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Strike Dispatched!</strong> Paste your customized text and attach the campaign poster in the reply thread.
                </span>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
