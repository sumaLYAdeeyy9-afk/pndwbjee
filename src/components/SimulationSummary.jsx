import React from 'react';
import { 
  ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, 
  DollarSign, FileText, Sparkles, Scale, Info, CheckSquare, 
  TrendingUp, Award, ExternalLink 
} from 'lucide-react';

export default function SimulationSummary({
  simulationResult,
  onNavigateToClause
}) {
  if (!simulationResult) return null;

  const {
    eligibleCategory,
    seatProtectionGuaranteed,
    meritPriorityTier,
    totalPaid,
    estimatedDeduction,
    netRefundable,
    actionPlan,
    requiredDocuments,
    criticalWarnings,
    scenarioOutcomes
  } = simulationResult;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Personalized Strategy Dossier
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              {eligibleCategory}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono shrink-0">
          WBJEE 2026 DC Rules
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs text-slate-200">
        
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Seat Protection */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Seat Protection</span>
            </div>
            <div className="text-sm font-bold text-emerald-400">
              {seatProtectionGuaranteed ? '100% Protected' : 'Fresh Attempt'}
            </div>
            <div className="text-[10px] text-slate-500">
              {seatProtectionGuaranteed ? 'Clause 14: CC Seat Intact' : 'No prior seat at risk'}
            </div>
          </div>

          {/* Replacement Quota Meter */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Phase 1 Quota Status</span>
            </div>
            <div className="text-sm font-bold text-indigo-400">
              0 / 1 Used (Intact)
            </div>
            <div className="text-[10px] text-slate-500">
              DC Phase 1 = Fresh Admission
            </div>
          </div>

          {/* Merit Priority Tier */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <Scale className="w-4 h-4 text-sky-400" />
              <span>Merit Priority</span>
            </div>
            <div className="text-sm font-bold text-sky-400 truncate">
              {meritPriorityTier.split(':')[0]}
            </div>
            <div className="text-[10px] text-slate-500">
              Statutory Ranking Hierarchy
            </div>
          </div>

          {/* Net Fee Refund */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Net Refundable</span>
            </div>
            <div className="text-sm font-bold text-amber-400">
              {totalPaid > 0 ? `₹${netRefundable.toLocaleString('en-IN')}` : 'N/A (Fresh)'}
            </div>
            <div className="text-[10px] text-slate-500">
              {totalPaid > 0 ? `Max fee deduction: ₹${estimatedDeduction}` : 'Zero prior deposits'}
            </div>
          </div>

        </div>

        {/* Step-by-Step Action Plan */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Tailored Action Plan for Your Scenario</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">5 Strategic Steps</span>
          </div>

          <div className="space-y-2.5">
            {actionPlan.map((item) => (
              <div 
                key={item.step}
                className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-100">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.clause}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Scenario Projections */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>3 Scenario Projections & Safety Analysis</span>
            </h3>
            <span className="text-[10px] font-mono text-teal-400">Risk Assessment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarioOutcomes.map((sc, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="font-bold text-xs text-slate-100 flex items-center space-x-1.5">
                    {idx === 0 ? '🟢' : idx === 1 ? '🔵' : '🛡️'}
                    <span>{sc.title.split(':')[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {sc.outcome}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-semibold text-emerald-400">
                  {sc.safetyScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Checklist */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Mandatory Physical Reporting Checklist (Clause 15)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Originals Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requiredDocuments.map((doc, i) => (
              <div 
                key={i}
                className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  doc.required
                    ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800/50 text-slate-500'
                }`}
              >
                <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${doc.required ? 'text-indigo-400' : 'text-slate-600'}`} />
                <div>
                  <div className="font-semibold text-xs">{doc.name}</div>
                  <div className="text-[10px] text-slate-400">{doc.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Warnings */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Crucial Warnings & Do's and Don'ts</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400">Strict Guidelines</span>
          </div>

          <div className="space-y-2">
            {criticalWarnings.map((w, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  w.level === 'critical'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${w.level === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />
                <div>
                  <div className="font-bold text-xs mb-0.5">{w.title}</div>
                  <p className="text-[11px] leading-relaxed opacity-90">{w.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
