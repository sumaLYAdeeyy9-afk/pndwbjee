import React from 'react';
import { Mail, Share2, Sparkles, Flame, CheckCircle2, AlertTriangle, Ban, Building2, Layers, PhoneCall } from 'lucide-react';

export default function Hero({ scrollToSection }) {
  return (
    <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-18 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Campaign Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>Demand Offline Decentralized Counseling</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span className="text-amber-400 font-semibold lowercase">#ScrapOnlineDC</span>
        </div>

        {/* Protest Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mb-4">
          PLEASE DON'T PLAY WITH <br />
          <span className="text-rose-500">
            STUDENTS' FUTURE
          </span>
        </h1>

        <p className="text-sm sm:text-base text-amber-300 font-bold max-w-2xl mx-auto mb-7 uppercase tracking-wide">
          If it has "Decentralized" in its name, do not conduct it online in a centralized way. Respect historical convention!
        </p>

        {/* Core Protest Manifesto Card */}
        <div className="max-w-3xl mx-auto text-left bg-slate-900/95 border border-rose-500/40 rounded-2xl p-5 sm:p-6 mb-8 text-slate-200 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 text-xs sm:text-sm font-bold uppercase tracking-wide border-b border-slate-800 pb-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Our Core Stand: Scrap Online DC & Restore Offline Campus Counseling</span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            WBJEE 2026 students <strong className="text-white">refuse to be the experimental batch of WBJEEB</strong>. Having already suffered from the chaotic, flawed centralized online rounds, forcing an online centralized portal under the guise of "Decentralized Counseling" is unacceptable. We demand <strong className="text-rose-400">offline decentralized spot counseling directly at respective university and college campuses</strong> (JU, CU, KGEC, JGEC, etc.) as per historical precedent.
          </p>

          {/* 3 Pillars Why Online DC Must Be Scrapped */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Why We Want to Scrap Online DC & Core Demands:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                  <Ban className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Multiple Allotments</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Online systems cause rampant ghost seat-blocking across multiple colleges without physical commitment, keeping real cutoffs locked and wasting seats.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Fresh Registration</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Permitting fresh registrations in subsequent rounds dilutes rank merit, distorts cutoffs, and destabilizes genuine rank holders.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>3. No Yes-Upgradation</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Admitted candidates are barred or trapped without a real-time transparent spot upgrade mechanism, leaving premier government seats vacant.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>4. Category Restoration</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Allow eligible SC/ST/OBC/EWS candidates converted to General due to administrative certificate issuance delays to opt for their correct category in DC.
                </p>
              </div>

            </div>
          </div>

          <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-xs text-slate-200">
            <strong className="text-rose-300">The Offline Solution:</strong> Offline spot counseling conducted at institute campuses guarantees 100% genuine physical attendance, immediate on-spot seat allocation, instant release of upgraded seats to waiting rankers, and proper on-the-spot verification of original category certificates.
          </div>
        </div>

        {/* Central Action Hub: 3 Clean Actions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW DO YOU WANT TO HELP?</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Email to Authorities */}
            <button
              onClick={() => scrollToSection('email-tool')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-900/80 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-3 shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">Action 1</span>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Email Representation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill details & send verified representation to WBJEEB, DTE & Hon'ble CM.
              </p>
            </button>

            {/* 2. Share to Groups */}
            <button
              onClick={() => scrollToSection('share-campaign')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/80 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase mb-1">Action 2</span>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Mobilize Batches
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Broadcast action portal to coaching groups, WhatsApp & Telegram circles.
              </p>
            </button>

            {/* 3. Authority Directory */}
            <button
              onClick={() => scrollToSection('directory')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-900/80 transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center mb-3 shadow-md">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase mb-1">Action 3</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                Official Directory & FAQ
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct phone numbers, official portal links, and grievance legal grounds.
              </p>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
