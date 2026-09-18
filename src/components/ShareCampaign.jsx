import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, MessageCircle, Send, Copy, Check, Users } from 'lucide-react';

export default function ShareCampaign() {
  const [copied, setCopied] = useState(false);

  // Dynamic portal url
  const portalUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://wbjee.playnodice.com';

  const shareText = `🚨 *UNITED WE STAND, DIVIDED WE FALL!* ✊

*REQUEST FOR GENUINE OFFLINE DECENTRALISED COUNSELLING FOR WBJEE 2026*

👉 *SEND 1-CLICK EMAIL REPRESENTATION NOW:*
${portalUrl}

*To,*
The Chairman / Competent Authority
West Bengal Joint Entrance Examinations Board (WBJEEB)
& Directorate of Technical Education (DTE), Government of West Bengal

*Subject: Request for Genuine Offline Decentralised Counselling for WBJEE 2026*

*Respected Sir/Madam,*

We, the undersigned WBJEE 2026 candidates and aspirants, respectfully request the authorities to urgently address the present counselling situation and consider conducting a *genuine offline Decentralised Counselling (DC)* for the remaining vacant seats.

Students are concerned that *multiple allocation/holding of seats by candidates across counselling processes may be contributing to unusually high cut-offs while substantial numbers of seats remain vacant*. This has created difficulties for candidates who are genuinely willing to take admission, particularly those who depend on the comparatively affordable fees of government institutions.

A genuine offline DC at the respective college campuses could help ensure that vacant seats reach candidates who are actually willing to join. Physical reporting would allow candidates to:
• Verify documents and eligibility directly at the institution;
• Choose from seats actually vacant at that time;
• Accept a seat immediately; and
• Reduce the possibility of seats being held by candidates without genuine intention to join.

*We therefore request WBJEEB and the Government of West Bengal to consider:*
1️⃣ Conducting *physical, college-level DC* for remaining vacant seats;
2️⃣ Publishing *college-wise, branch-wise and category-wise vacancy data* beforehand;
3️⃣ Following a transparent process based on *merit, eligibility and applicable reservation rules*;
4️⃣ Providing adequate advance notice for candidates to arrange travel;
5️⃣ Publishing the seats filled and remaining vacant after each phase; and
6️⃣ Providing an official schedule at the earliest possible opportunity.

Many students cannot afford expensive private alternatives or another academic year. We therefore respectfully request the authorities to examine the present counselling mechanism and provide eligible candidates with a transparent opportunity to fill genuinely vacant seats.

*Yours faithfully,*
*Concerned WBJEE 2026 Candidates & Bonafide Aspirants*

👉 *DISPATCH YOUR OFFICIAL REPRESENTATION NOW:*
${portalUrl}

#WBJEEOfflineDC #DemandOfflineDC #ConductOfflineDC #StopSeatBlocking #WBJEE2026 #SaveAcademicYear`;

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
            <span>Mobilize Aspirants Across West Bengal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Amplify the Demand Across Student Circles
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            Every share mobilizes another candidate. Forward this representation to your coaching batch groups, Telegram channels, and WhatsApp circles.
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
              className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Broadcast Text</span>
                </>
              )}
            </button>

          </div>

          <p className="text-[11px] text-slate-500">
            Share in WBJEE coaching groups, college discussion forums & student networks.
          </p>

        </div>

      </div>
    </section>
  );
}
