import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, MessageCircle, Send, Copy, Check, Users } from 'lucide-react';

export default function ShareCampaign() {
  const [copied, setCopied] = useState(false);

  // Dynamic portal url
  const portalUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://wbjee.playnodice.com';

  const shareText = `🚨 PLEASE DON'T PLAY WITH STUDENTS' FUTURE!
URGENT FOR ALL WBJEE 2026 CANDIDATES & PARENTS!

We are urgently protesting against the sudden WBJEEB notification released on August 27, 2026, which abruptly debars already admitted students from participating in Decentralized Counseling (DC).

⚠️ 1. Violation of Historical Precedent:
Historically, Decentralized Counseling (DC) has ALWAYS been open to all students, allowing admitted candidates to upgrade branches at premier state universities (JU, CU, KGEC, JGEC) without losing their academic year.

⚠️ 2. Flawed Centralized Counseling:
By allowing fresh registration across all 3 rounds, cutoffs shrank instead of getting relaxed—an unprecedented anomaly in WBJEE history that caused rampant seat blocking and massive seat vacancies statewide.

We demand the immediate withdrawal of the Aug 27 notice and full DC access for all students!

Take Action Now (Takes 10 seconds):
1️⃣ 1-Click Mass Email to WBJEEB & Higher Education Dept
2️⃣ Fire Pre-Crafted Tweet Storm on X tagging @SuvenduWB & Media

👉 Open the Action Portal: ${portalUrl}

#WBJEEBDecentralized #JusticeForWBJEEStudents #DontPlayWithStudentsFuture`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    triggerConfetti();
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(portalUrl)}&text=${encodeURIComponent(shareText)}`;
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
        
        <div className="rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-950 shadow-2xl relative overflow-hidden text-center max-w-3xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Action 3: Student Mobilizer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Mobilize WBJEE Batches & Groups
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-6">
            Share this campaign across batch WhatsApp groups and Telegram channels to scale mass representation.
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left text-xs font-mono text-slate-300 whitespace-pre-wrap select-text leading-relaxed">
            {shareText}
          </div>

        </div>

      </div>
    </section>
  );
}
