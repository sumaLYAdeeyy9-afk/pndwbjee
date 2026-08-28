import React from 'react';
import { TrendingUp, Mail, Users, FileText, Target } from 'lucide-react';
import { TwitterIcon } from './Icons';

export default function LiveCounter({ stats }) {
  const totalActions = (stats.emails || 0) + (stats.tweets || 0) + (stats.stories || 0);

  const counterCards = [
    {
      id: 'emails',
      label: 'Emails Sent to Authorities',
      value: (stats.emails || 0).toLocaleString(),
      icon: Mail,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30'
    },
    {
      id: 'tweets',
      label: 'Posts Fired on X (Twitter)',
      value: (stats.tweets || 0).toLocaleString(),
      icon: TwitterIcon,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30'
    },
    {
      id: 'stories',
      label: 'Grievance Cases Documented',
      value: (stats.stories || 0).toLocaleString(),
      icon: FileText,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'mobilized',
      label: 'Total Real Actions Taken',
      value: totalActions.toLocaleString(),
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    }
  ];

  return (
    <section className="py-10 bg-slate-900/50 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Momentum Tracker</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Live Community Protest Metrics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-2 md:mt-0 max-w-md">
            Every candidate who sends an email, posts a tweet, or documents an incident updates this counter in real-time.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {counterCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`bg-slate-950/80 rounded-xl p-4 border ${card.borderColor} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Live
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    {card.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5">
                    {card.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
