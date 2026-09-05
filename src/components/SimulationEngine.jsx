import React, { useState } from 'react';
import { 
  DC_PRESETS 
} from '../data/flowchartData';
import { 
  Sliders, ShieldCheck, Sparkles, CheckCircle2, 
  HelpCircle, AlertCircle, RefreshCw, Layers, ArrowRight,
  TrendingUp, Award, DollarSign
} from 'lucide-react';

export default function SimulationEngine({
  constraints,
  onConstraintsChange,
  onViewFlowchart
}) {
  const [selectedPreset, setSelectedPreset] = useState('admitted_govt_aiming_ju');

  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    const found = DC_PRESETS.find(p => p.id === presetId);
    if (found && onConstraintsChange) {
      onConstraintsChange(found.constraints);
    }
  };

  const updateField = (field, value) => {
    setSelectedPreset('custom');
    if (onConstraintsChange) {
      onConstraintsChange({
        ...constraints,
        [field]: value
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Candidate Constraint Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Configure your scenario to dynamically map your path on the flowchart
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
              <span>View Mapped Flowchart</span>
            </button>
          )}

          <button
            onClick={() => handlePresetSelect('admitted_govt_aiming_ju')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            title="Reset to default preset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700 bg-slate-50/50">
        
        {/* Preset Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Choose a Preset Scenario or Customize:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPreset === preset.id
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-sm ring-1 ring-indigo-500/30'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{preset.label}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Current Admission & Centralised Counselling Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <span className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>1. Centralised Counselling (CC) Status</span>
            <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Clause 5 & 14</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { val: 'admitted', label: 'Admitted in a College (Holding Confirmed Seat)', sub: 'Category I' },
              { val: 'allotted_unadmitted', label: 'Allotted Seat in CC but Not Admitted', sub: 'Category II' },
              { val: 'unallotted', label: 'Participated in CC, No Seat Allotted', sub: 'Category III' },
              { val: 'unregistered', label: 'Never Registered / Did Not Participate in CC', sub: 'Category IV / V' }
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => updateField('ccStatus', opt.val)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  constraints.ccStatus === opt.val
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-semibold">{opt.label}</div>
                <div className={`text-[10px] mt-0.5 ${constraints.ccStatus === opt.val ? 'text-indigo-100' : 'text-slate-500'}`}>{opt.sub}</div>
              </button>
            ))}
          </div>

          {/* Seat Protection Toggle */}
          {constraints.ccStatus === 'admitted' && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">
                    Seat Protection Guarantee (Clause 14)
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Protect and retain currently admitted CC seat 100% while participating in DC
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={constraints.retainSeat}
                onChange={(e) => updateField('retainSeat', e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Section 2: Rank & Domicile Profile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <span className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>2. Merit Rank & Reservation Category</span>
            <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Clause 8 & 9</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Rank Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Merit Rank Type
              </label>
              <select
                value={constraints.rankType}
                onChange={(e) => updateField('rankType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="gmr">WBJEE GMR (Tier 1 Priority - Highest)</option>
                <option value="jee_main">JEE Main CRL (Tier 2 Priority)</option>
                <option value="hmr">10+2 Merit HMR (Tier 3)</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reservation Category
              </label>
              <select
                value={constraints.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="GEN">General / Unreserved</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC-A">OBC-A</option>
                <option value="OBC-B">OBC-B</option>
                <option value="EWS">EWS (Economically Weaker)</option>
                <option value="TFW">TFW (Tuition Fee Waiver)</option>
                <option value="PWD">PwD (Person with Disability)</option>
              </select>
            </div>

            {/* Domicile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Domicile Status
              </label>
              <select
                value={constraints.domicile}
                onChange={(e) => updateField('domicile', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="wb_domicile">West Bengal Domicile (Form a1/a2/b)</option>
                <option value="non_domicile">Non-Domicile (Open / Pvt Seats)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Section 3: Target Institution & DC Phase Choice */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <span className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>3. Target Institutions & Participation Rounds</span>
            <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Clause 13 & 14</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Target Institution Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Institute Type
              </label>
              <select
                value={constraints.instType}
                onChange={(e) => updateField('instType', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="govt_univ">State University (JU, CU, Kalyani)</option>
                <option value="govt_college">Govt Engg College (KGEC, JGEC)</option>
                <option value="private_college">Private Engineering College</option>
              </select>
            </div>

            {/* Target Phase */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Participation Rounds
              </label>
              <select
                value={constraints.targetPhase}
                onChange={(e) => updateField('targetPhase', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="both">Both Phase 1 & Phase 2 (Recommended)</option>
                <option value="phase1_only">Phase 1 Only</option>
                <option value="phase2_only">Phase 2 Only</option>
              </select>
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Objective
              </label>
              <select
                value={constraints.primaryGoal}
                onChange={(e) => updateField('primaryGoal', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="upgrade_college">Upgrade to Higher-Tier College</option>
                <option value="upgrade_branch_same">Upgrade Branch in Same College</option>
                <option value="fresh_admission">Secure Fresh B.Tech Seat</option>
              </select>
            </div>

          </div>
        </div>

        {/* Section 4: Current Fees (Clause 18 Refund Calculator) */}
        {constraints.ccStatus === 'admitted' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
            <span className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>4. Fee Refund & Transfer Inputs</span>
              <span className="text-[11px] font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Clause 18 (Refund Policy)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tuition Fee Paid to Current College (₹)
                </label>
                <input
                  type="number"
                  value={constraints.currentCollegeFee}
                  onChange={(e) => updateField('currentCollegeFee', Number(e.target.value))}
                  placeholder="e.g. 25000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current College Type
                </label>
                <select
                  value={constraints.currentCollegeType}
                  onChange={(e) => updateField('currentCollegeType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                >
                  <option value="govt">Government Institution (₹1,000 max deduction)</option>
                  <option value="private">Private Institution (₹2,000 max deduction)</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
