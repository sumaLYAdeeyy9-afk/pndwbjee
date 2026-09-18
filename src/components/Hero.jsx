import React from 'react';
import { Mail, Share2, Sparkles, Flame, CheckCircle2, AlertTriangle, Ban, Building2, Layers, MapPin, Clock, School } from 'lucide-react';

export default function Hero({ scrollToSection }) {
  return (
    <section id="demands" className="relative pt-10 pb-14 lg:pt-14 lg:pb-18 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Campaign Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>Demand Offline Decentralized Counselling</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span className="text-amber-400 font-semibold lowercase">#DemandOfflineDC</span>
        </div>

        {/* Protest Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mb-4">
          SAVE STUDENTS FROM <br />
          <span className="text-rose-500">
            LOSING AN ACADEMIC YEAR
          </span>
        </h1>

        <p className="text-sm sm:text-base text-amber-300 font-bold max-w-2xl mx-auto mb-7 uppercase tracking-wide">
          Vacant Seats & Unusually High Cut-Offs Cannot Coexist. Conduct Genuine Offline DC at College Campuses!
        </p>

        {/* Core Protest Manifesto Card */}
        <div className="max-w-4xl mx-auto text-left bg-slate-900/95 border border-rose-500/40 rounded-2xl p-5 sm:p-6 mb-8 text-slate-200 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 text-xs sm:text-sm font-bold uppercase tracking-wide border-b border-slate-800 pb-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Our Core Stand: Demand for Genuine Offline Decentralised Counselling</span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            The current WBJEE counselling process has created an extraordinary situation where cut-offs for government and private engineering colleges have risen drastically, while <strong className="text-white">thousands of seats remain vacant across West Bengal</strong>. A genuine Decentralised Counselling process must not simply be another round of flawed online seat allocation. We urgently appeal to WBJEEB and the Government of West Bengal to conduct <strong className="text-rose-400">physical, college-level Offline Decentralised Counselling</strong> directly at respective campuses (JU, CU, KGEC, JGEC, GCETTS, GCELT, GCECT, etc.).
          </p>

          {/* 4 Core Pillars of Offline DC Appeal */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Why Genuine Offline Decentralised Counselling is Urgently Needed:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>1. Physical Reporting</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Students are willing to travel hundreds of kilometres to physically report, verify documents, and accept vacant seats immediately.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <Ban className="w-3.5 h-3.5 shrink-0" />
                  <span>2. Stop Seat-Blocking</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Physical presence naturally filters out candidates holding multiple seats without intent to join, eliminating ghost vacancy blockages.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                  <School className="w-3.5 h-3.5 shrink-0" />
                  <span>3. Protect Affordable Education</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Lower- and middle-income families rely on government engineering colleges. Vacant public seats must reach deserving students.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>4. Transparent Vacancies</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Publish college-wise, branch-wise, and category-wise vacant seat matrices with clear schedules to prevent academic session loss.
                </p>
              </div>

            </div>
          </div>

          {/* Quick Action Button within manifesto */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Join thousands of WBJEE 2026 aspirants demanding a fair offline spot admission process.
            </span>
            <button
              type="button"
              onClick={() => scrollToSection('email-tool')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-1.5 transition-all shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Official Representation Now</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
