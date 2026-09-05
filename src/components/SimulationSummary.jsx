import React from 'react';
import { 
  ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, 
  DollarSign, FileText, Sparkles, Scale, Info, CheckSquare, 
  TrendingUp, Award, ExternalLink, Layers 
} from 'lucide-react';

export default function SimulationSummary({
  simulationResult,
  onViewFlowchart
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
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Personalized Strategy Dossier
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {eligibleCategory}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onViewFlowchart && (
            <button
              onClick={onViewFlowchart}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View On Flowchart</span>
            </button>
          )}

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono shrink-0">
            Official Rules
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700 bg-slate-50/50">
        
        {/* Top 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Seat Protection */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Seat Protection</span>
            </div>
            <div className="text-base font-bold text-emerald-600">
              {seatProtectionGuaranteed ? '100% Protected' : 'Fresh Attempt'}
            </div>
            <div className="text-[11px] text-slate-400">
              {seatProtectionGuaranteed ? 'Clause 14: CC Seat Intact' : 'No prior seat at risk'}
            </div>
          </div>

          {/* Replacement Quota Meter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Phase 1 Quota</span>
            </div>
            <div className="text-base font-bold text-indigo-600">
              0 / 1 Used (Intact)
            </div>
            <div className="text-[11px] text-slate-400">
              DC Phase 1 = Fresh Admission
            </div>
          </div>

          {/* Merit Priority Tier */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs">
              <Scale className="w-4 h-4 text-sky-600" />
              <span>Merit Priority</span>
            </div>
            <div className="text-base font-bold text-sky-600 truncate">
              {meritPriorityTier.split(':')[0]}
            </div>
            <div className="text-[11px] text-slate-400">
              Statutory Ranking Hierarchy
            </div>
          </div>

          {/* Net Fee Refund */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Net Refundable</span>
            </div>
            <div className="text-base font-bold text-amber-600">
              {totalPaid > 0 ? `₹${netRefundable.toLocaleString('en-IN')}` : 'N/A (Fresh)'}
            </div>
            <div className="text-[11px] text-slate-400">
              {totalPaid > 0 ? `Max fee deduction: ₹${estimatedDeduction}` : 'Zero prior deposits'}
            </div>
          </div>

        </div>

        {/* Step-by-Step Action Plan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Strategic Action Plan for Your Scenario</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">5 Concrete Steps</span>
          </div>

          <div className="space-y-3">
            {actionPlan.map((item) => (
              <div 
                key={item.step}
                className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                      {item.clause}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Scenario Projections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>3 Scenario Projections & Safety Analysis</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Risk Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {scenarioOutcomes.map((sc, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    {idx === 0 ? '🟢' : idx === 1 ? '🔵' : '🛡️'}
                    <span>{sc.title.split(':')[0]}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sc.outcome}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-emerald-700">
                  {sc.safetyScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Checklist */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Mandatory Physical Reporting Checklist (Clause 15)</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Originals Required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {requiredDocuments.map((doc, i) => (
              <div 
                key={i}
                className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                  doc.required
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-50/50 border-slate-100 text-slate-400'
                }`}
              >
                <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${doc.required ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="font-semibold text-xs text-slate-900">{doc.name}</div>
                  <div className="text-[11px] text-slate-500">{doc.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span>Crucial Warnings & Do's and Don'ts</span>
            </h3>
            <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Strict Rules</span>
          </div>

          <div className="space-y-2.5">
            {criticalWarnings.map((w, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex items-start space-x-3 ${
                  w.level === 'critical'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${w.level === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                <div>
                  <div className="font-bold text-xs mb-0.5">{w.title}</div>
                  <p className="text-xs leading-relaxed opacity-95">{w.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
