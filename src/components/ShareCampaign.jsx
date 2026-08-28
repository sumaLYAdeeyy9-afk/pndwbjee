import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, MessageCircle, Send, Copy, Check, Users } from 'lucide-react';

export default function ShareCampaign() {
  const [copied, setCopied] = useState(false);

  const shareText = `🚨 URGENT FOR ALL WBJEE 2026 CANDIDATES & PARENTS!

Don't let them play dice with our future! Demand the immediate revocation of the Aug 27 WBJEEB notification debarring admitted students from Decentralized Counseling (DC).

1️⃣ Send 1-Click Mass Email to WBJEEB & Higher Education Dept
2️⃣ Fire Pre-Crafted Tweet Storm on X tagging CM @SuvenduWB & @CMO_WB

👉 Open the Campaign Portal now: ${typeof window !== 'undefined' ? window.location.origin : 'https://playnodice.com'}

#WBJEEBDecentralized #JusticeForWBJEEStudents #DontPlayDiceWithStudents`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    triggerConfetti();
  };

  const handleTelegramShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://playnodice.com';
    const url = `https://t.me/share/url?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(shareText)}`;
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
    <section id="share-campaign" className="py-14 bg-slate-900/40 border-t border-slate-800/80 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-950 shadow-2xl relative overflow-hidden text-center max-w-2xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Action 3: Student Mobilizer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Mobilize WBJEE Batches & Groups
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-6">
            Share this 1-click advocacy tool to batch WhatsApp groups and Telegram channels to scale mass representation.
          </p>

          {/* Quick Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            <button
              onClick={handleTelegramShare}
              className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-950 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Share on Telegram</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Message!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Share Text</span>
                </>
              )}
            </button>
          </div>

          {/* Preview of Broadcast Message */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-left text-xs font-mono text-slate-300 whitespace-pre-wrap select-text">
            {shareText}
          </div>

        </div>

      </div>
    </section>
  );
}
