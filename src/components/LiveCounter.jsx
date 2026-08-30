import React from 'react';
import { TrendingUp, Mail, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LiveCounter({ stats }) {
  const counterCards = [
    {
      id: 'emails',
      label: 'Verified Representations Dispatched',
      value: (stats.emails || 0).toLocaleString(),
      icon: Mail,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      desc: 'Submissions sent to WBJEEB, DTE & CMO'
    },
    {
      id: 'desks',
      label: 'Statutory Desks Targeted',
      value: '7 Desks',
      icon: Building2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      desc: 'WBJEEB, DTE, Higher Ed, DPI & CM Desk'
    },
    {
      id: 'demand',
      label: 'Unified Student Demand',
      value: '100% Offline DC',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      desc: 'Scrap Online DC & restore campus spot rounds'
    }
  ];

  return (
    <section className="py-8 bg-slate-900/50 border-b border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Momentum Tracker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Verified Participation Metrics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-0">
            Metrics increment only when 100% complete candidate details are submitted
          </p>
        </div>

        {/* 3-Card Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {counterCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-slate-950/80 rounded-2xl p-5 border ${card.borderColor} flex items-center justify-between shadow-lg`}
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mb-1">
                    {card.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">
                    {card.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {card.desc}
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl ${card.bgColor} ${card.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
