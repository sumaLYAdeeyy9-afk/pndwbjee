import React from 'react';
import { Heart, ShieldCheck, ExternalLink, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          {/* Logo & Description */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-sm">
              PND
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight">
                Play<span className="text-rose-500">No</span>Dice<span className="text-slate-400 font-normal text-xs">.com</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Independent Student Rights & Transparency Initiative
              </p>
            </div>
          </div>

          {/* Slogan */}
          <div className="text-center md:text-right">
            <p className="font-bold text-slate-200 text-sm">
              "Please Don't Play Dice With Students' Future"
            </p>
            <p className="text-[11px] text-slate-500">
              Standing with WBJEE 2026 Engineering Aspirants across West Bengal
            </p>
          </div>
        </div>

        {/* Disclaimer & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Non-commercial, student-built advocacy tool. All representations are sent directly through user-authorized email and social clients.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
