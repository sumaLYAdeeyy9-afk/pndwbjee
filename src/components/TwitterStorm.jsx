import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Sparkles, ExternalLink, Shuffle, Edit3, RotateCcw, Smartphone, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TwitterIcon } from './Icons';
import { TWEET_TEMPLATES, buildTweetIntentUrl, buildTwitterAppUrl, getRandomTweet } from '../data/tweetTemplates';

// Helper to reliably detect mobile devices (Android / iOS)
function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
}

export default function TwitterStorm({ onActionCompleted }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [editedTweetText, setEditedTweetText] = useState(() => TWEET_TEMPLATES[0]?.text || '');
  const [copied, setCopied] = useState(false);
  const [mobileOnlyNotice, setMobileOnlyNotice] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sync edited text when user switches tweet angles
  useEffect(() => {
    if (TWEET_TEMPLATES[selectedIdx]) {
      setEditedTweetText(TWEET_TEMPLATES[selectedIdx].text);
    }
  }, [selectedIdx]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#0284c7', '#f43f5e', '#fbbf24']
    });
    if (onActionCompleted) {
      onActionCompleted('tweets');
    }
  };

  // Handler for Native App button with PC protection
  const handleAppDispatch = (e) => {
    if (!isMobileDevice()) {
      e.preventDefault();
      setShowSuccessToast(false);
      setMobileOnlyNotice(true);
      setTimeout(() => setMobileOnlyNotice(false), 6000);
      return;
    }
    setMobileOnlyNotice(false);
    triggerCelebration();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  // Handler for Web Browser link
  const handleWebDispatch = () => {
    setMobileOnlyNotice(false);
    triggerCelebration();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  // Handler for Copy Tweet
  const handleCopyTweet = () => {
    navigator.clipboard.writeText(editedTweetText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      setMobileOnlyNotice(false);
      triggerCelebration();
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    });
  };

  const handleShuffleRandom = () => {
    const { index } = getRandomTweet();
    setSelectedIdx(index);
    setEditedTweetText(TWEET_TEMPLATES[index].text);
  };

  const handleResetTweet = () => {
    if (TWEET_TEMPLATES[selectedIdx]) {
      setEditedTweetText(TWEET_TEMPLATES[selectedIdx].text);
    }
  };

  const charCount = editedTweetText.length;
  const isOverLimit = charCount > 280;

  // URLs for direct app and web browser
  const twitterAppUrl = buildTwitterAppUrl(editedTweetText);
  const twitterWebUrl = buildTweetIntentUrl(editedTweetText);

  return (
    <section id="twitter-storm" className="py-14 bg-slate-900/60 border-t border-b border-slate-800/80 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
            <TwitterIcon className="w-3.5 h-3.5 fill-current" />
            <span>Action 2: Coordinated X (Twitter) Storm</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Amplify Public Pressure on X
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Targeting Hon'ble CM <span className="text-sky-400 font-bold">@SuvenduWB</span>, <span className="text-sky-400 font-bold">@abpanandatv</span>, and <span className="text-sky-400 font-bold">@Zee24Ghanta</span>. Select any draft below and edit freely before posting.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 10 Tweet Variations Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Tweet Angle (10 Drafts)
                </span>
                <button
                  onClick={handleShuffleRandom}
                  className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-[11px] font-bold border border-sky-500/30 transition-all"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random Pick</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {TWEET_TEMPLATES.map((tmpl, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`p-2.5 rounded-xl cursor-pointer border transition-all text-xs ${
                        isSelected
                          ? 'bg-sky-950/60 border-sky-500 text-white shadow-md'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${isSelected ? 'text-sky-400' : 'text-slate-200'}`}>
                          {tmpl.title}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {tmpl.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {tmpl.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Handles Pill Box */}
            <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 text-xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Unified Tags Included in Every Tweet:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-sky-400 border border-slate-800 font-mono text-[11px]">
                  @SuvenduWB
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-sky-400 border border-slate-800 font-mono text-[11px]">
                  @abpanandatv
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-sky-400 border border-slate-800 font-mono text-[11px]">
                  @Zee24Ghanta
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-rose-400 border border-slate-800 font-mono text-[11px]">
                  #WBJEE2026
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-rose-400 border border-slate-800 font-mono text-[11px]">
                  #WBJEEBDecentralized
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-950 text-rose-400 border border-slate-800 font-mono text-[11px]">
                  #JusticeForWBJEEStudents
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Editable Live Tweet Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
            
            <div className="bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl p-5 sm:p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                    🎓
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-white text-xs sm:text-sm">WBJEE Aspirant</span>
                      <span className="text-sky-400 text-xs">✓</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">@WBJEE_Aspirants • Editable Post Preview</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetTweet}
                    className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    title="Reset to selected template text"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <TwitterIcon className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              {/* Editable Tweet Textarea */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Edit3 className="w-3 h-3 text-sky-400" />
                    <span>Edit Tweet Text:</span>
                  </label>
                  <span className={`text-[11px] font-mono font-bold ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                    {charCount} / 280
                  </span>
                </div>

                <textarea
                  value={editedTweetText}
                  onChange={(e) => setEditedTweetText(e.target.value)}
                  rows={6}
                  className={`w-full p-3.5 rounded-xl bg-slate-900 border text-white text-xs sm:text-sm leading-relaxed focus:outline-none transition-all resize-y font-sans ${
                    isOverLimit ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-sky-500'
                  }`}
                  placeholder="Type your tweet..."
                />
              </div>

              {isOverLimit && (
                <p className="text-[11px] text-rose-400 mb-3">
                  ⚠️ Tweet exceeds 280 characters. Consider shortening to post on X directly.
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                
                {/* 1. Primary Direct Native Android / iOS App Dispatch */}
                <a
                  href={twitterAppUrl}
                  onClick={handleAppDispatch}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-sky-950 transition-all cursor-pointer text-center"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send Post Directly from X App (Android / iPhone)</span>
                </a>

                {/* 2. Secondary Row: Web Browser & Copy Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={twitterWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWebDispatch}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all text-center"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Open in Web X.com</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={handleCopyTweet}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Tweet!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Tweet Text</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* PC Mobile-Only Notice Banner */}
            {mobileOnlyNotice && (
              <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-100 text-xs flex items-start space-x-3 shadow-2xl animate-fade-in">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-amber-300 font-bold text-xs block">
                    Mobile Device Only Action
                  </strong>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    This direct app dispatch works only when opened on a mobile device (Android / iPhone) with the X app installed.
                  </p>
                  <p className="text-amber-200 text-[11px] font-semibold">
                    👉 On PC / Desktop, please click <strong>"Open in Web X.com"</strong> or <strong>"Copy Tweet Text"</strong> above.
                  </p>
                </div>
              </div>
            )}

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 shadow-xl animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>X Post Dispatched!</strong> Thank you for amplifying the voice of WBJEE students.
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
