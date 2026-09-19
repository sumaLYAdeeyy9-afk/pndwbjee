import React from 'react';
import { TrendingUp, Mail, Building2, ShieldCheck } from 'lucide-react';

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
      desc: 'Submissions sent to WBJEEB, DTE, JU VC, FETSU & Higher Ed'
    },
    {
      id: 'desks',
      label: 'Targeted Authorities & Bodies',
      value: '9 Desks & Bodies',
      icon: Building2,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      desc: 'WBJEEB, DTE, JU VC, FETSU, Higher Ed, DPI & CMO'
    },
    {
      id: 'demand',
      label: 'Unified Student Demand',
      value: '100% Offline DC',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      desc: 'Conduct Offline Spot Rounds at Campuses'
    }
  ];

  return (
    <section id="metrics" className="py-8 bg-slate-900/50 border-b border-slate-800/80 scroll-mt-16">
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
            Real-time counter tracking bonafide WBJEE representations dispatched to official desks
          </p>
        </div>

        {/* 3-Card Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {counterCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                className={`p-5 rounded-2xl bg-slate-900/90 border ${card.borderColor} shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {card.label}
                  </span>
                  <div className={`p-2 rounded-xl ${card.bgColor}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className={`text-3xl sm:text-4xl font-black tracking-tight ${card.color}`}>
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
