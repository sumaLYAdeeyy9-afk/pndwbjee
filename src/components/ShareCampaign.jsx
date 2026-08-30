import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, MessageCircle, Send, Copy, Check, Users } from 'lucide-react';

export default function ShareCampaign() {
  const [copied, setCopied] = useState(false);

  // Dynamic portal url
  const portalUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://wbjee.playnodice.com';

  const shareText = `🚨 MASS MAILING CAMPAIGN: DEMAND OFFLINE DECENTRALIZED COUNSELING!
👉 SEND 1-CLICK REPRESENTATION NOW: ${portalUrl}

URGENT FOR ALL WBJEE 2026 CANDIDATES & PARENTS!
We refuse to be the experimental batch of WBJEEB. Scrap the flawed Online DC portal!

🛑 Core Demands & Why We Oppose Online DC:
1️⃣ Multiple Allotments & Rampant Seat Blocking
2️⃣ Fresh Registration in Each Round destroying merit
3️⃣ No real "Yes-Upgradation" mechanism
4️⃣ Allow SC/ST/OBC/EWS candidates converted to General due to Govt certificate delays to opt for their correct category

🏛️ Demand: Conduct Decentralized Counseling OFFLINE directly at institute campuses (JU, CU, KGEC, JGEC, etc.) as per historical precedent.

👉 Action Portal (Takes 10 seconds): ${portalUrl}

#WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026 #JusticeForWBJEEStudents`;

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
    <section id="share-campaign" className="py-14 bg-slate-900/40 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Container */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Action 2: Mobilize Student Batches</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Amplify the Movement Across Channels
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            Every share mobilizes another candidate. Forward this portal to your coaching batch groups, Telegram channels, and WhatsApp circles.
          </p>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-6">
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-sky-950 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share to Telegram</span>
            </button>

            {/* Copy Share Text */}
            <button
              onClick={handleCopyLink}
              className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Broadcast Text</span>
                </>
              )}
            </button>

          </div>

          <p className="text-[11px] text-slate-400">
            Includes direct portal links and the grievance summary formatted for instant messaging.
          </p>

        </div>

      </div>
    </section>
  );
}
