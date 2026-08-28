import React from 'react';
import { Mail, MessageSquare, Share2, Sparkles, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TwitterIcon } from './Icons';

export default function Hero({ scrollToSection }) {
  return (
    <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-18 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Campaign Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>WBJEE 2026 Emergency Protest Movement</span>
          <span className="w-1 h-1 rounded-full bg-slate-500"></span>
          <span className="text-amber-400 font-semibold lowercase">#PlayNoDice</span>
        </div>

        {/* Protest Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mb-6">
          PLEASE DON'T PLAY DICE WITH <br />
          <span className="text-rose-500">
            STUDENTS' FUTURE
          </span>
        </h1>

        {/* Actual Ground Protest Context & Core Failure Points */}
        <div className="max-w-3xl mx-auto text-left bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 sm:p-6 mb-8 text-slate-200 shadow-xl space-y-3.5">
          <div className="flex items-center space-x-2 text-rose-400 text-xs sm:text-sm font-bold uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Why We Are Protesting the August 27 WBJEEB Notification:</span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            We are urgently protesting against the sudden WBJEEB notification released on <strong className="text-white">August 27, 2026</strong>, which abruptly <strong className="text-rose-400">debars already admitted students</strong> from participating in Decentralized Counseling (DC).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Violation of Historical Precedent:</span>
              <p className="text-slate-400 leading-relaxed">
                Historically, Decentralized Counseling (DC) has <strong>always been open to all students</strong>, allowing admitted candidates to upgrade branches at premier universities (JU, CU, KGEC, JGEC) without losing their academic year.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-rose-400 font-bold block">2. Flawed Centralized Counseling:</span>
              <p className="text-slate-400 leading-relaxed">
                By allowing fresh registration in all 3 rounds, <strong>cutoffs shrank instead of getting relaxed</strong>—an unprecedented anomaly in WBJEE history that caused rampant seat blocking and massive seat vacancies statewide.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 pt-1 border-t border-slate-800/80">
            Trapping merit-holding students in locked seats while leaving thousands of university engineering seats vacant or allotting them to lower ranks is fundamentally unfair. <strong className="text-white">We demand the immediate withdrawal of the Aug 27 notice and full DC access for all students.</strong>
          </p>
        </div>

        {/* Central Action Hub: "HOW DO YOU WANT TO HELP?" */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW DO YOU WANT TO HELP?</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Email to Authorities */}
            <button
              onClick={() => scrollToSection('email-tool')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-900/80 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">Action 1</span>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Email Authorities
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                1-Click mass blast to WBJEEB & Higher Education Dept to revoke Aug 27 notice.
              </p>
            </button>

            {/* 2. Post on X (Twitter) */}
            <button
              onClick={() => scrollToSection('twitter-storm')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-900/80 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center mb-3">
                <TwitterIcon className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase mb-1">Action 2</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                Post on X (Twitter)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                10 randomized spam-proof tweet drafts tagging CM @SuvenduWB, @CMO_WB & news.
              </p>
            </button>

            {/* 3. Incident Wall */}
            <button
              onClick={() => scrollToSection('grievance-wall')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-900/80 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase mb-1">Action 3</span>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Incident Wall
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Document your counseling cutoff anomaly, seat trap, or upgrade denial.
              </p>
            </button>

            {/* 4. Share to Groups */}
            <button
              onClick={() => scrollToSection('share-campaign')}
              className="flex flex-col items-start p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/80 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase mb-1">Action 4</span>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Share to Groups
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mobilize coaching batches, WhatsApp groups, and Telegram channels.
              </p>
            </button>
          </div>
        </div>

        {/* Clean Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free & Open-Access</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>Direct to Statutory Authorities</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Client-Side Privacy Guaranteed</span>
          </div>
        </div>

      </div>
    </section>
  );
}
