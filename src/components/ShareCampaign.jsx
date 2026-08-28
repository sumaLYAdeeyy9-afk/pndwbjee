import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, MessageCircle, Send, Copy, Check, Users, Sparkles } from 'lucide-react';

export default function ShareCampaign() {
  const [copied, setCopied] = useState(false);

  const shareText = `🚨 URGENT FOR ALL WBJEE ASPIRANTS & PARENTS!

Don't let them play dice with our future! Join the centralized digital protest to demand a single-window Centralized Mop-Up Round & stop seat-blocking.

1️⃣ Send 1-Click Email to WBJEEB Chairman & Education Minister
2️⃣ Fire Pre-Crafted Tweet Storm on X
3️⃣ Log Your Incident & Stand Together

👉 Open the Campaign Portal now: ${window.location.origin || 'https://playnodice.com'}

#WBJEEBDecentralized #SaveWBJEEAspirants #DontPlayDiceWithStudents`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    triggerConfetti();
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin || 'https://playnodice.com')}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    triggerConfetti();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      triggerConfetti();
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#f43f5e']
    });
  };

  return (
    <section id="share-campaign" className="py-16 bg-slate-900/40 border-t border-slate-800/80 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-card rounded-3xl p-8 sm:p-10 border-2 border-emerald-500/30 bg-slate-950/90 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-4 h-4" />
              <span>Action 4: Student Mobilizer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Broadcast to Your Coaching & College Groups
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Every single batch of 50 students sending emails increases our collective leverage tenfold. Share this tool across WhatsApp & Telegram groups immediately.
            </p>

            {/* Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                onClick={handleWhatsAppShare}
                className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Share to WhatsApp</span>
              </button>

              <button
                onClick={handleTelegramShare}
                className="py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-900/40 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                <span>Share to Telegram</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide border border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400">Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-slate-400" />
                    <span>Copy Broadcast Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Preview Quote */}
            <div className="mt-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-400 font-mono">
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Pre-Formatted Broadcast Message Preview:</span>
              <p className="line-clamp-3 text-slate-300 font-sans">{shareText}</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
