import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Copy, Check, ExternalLink, ShieldCheck, 
  User, Hash, School, Smartphone, CheckCircle2, Globe 
} from 'lucide-react';
import { 
  PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, EMAIL_SUBJECT, 
  generateMegaDraft, buildMailtoUrl, buildGmailComposeUrl 
} from '../data/emailTemplates';

export default function EmailTool({ onActionCompleted }) {
  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    currentInstitute: ''
  });

  const [copiedType, setCopiedType] = useState(null); // 'all' | 'subject' | 'body'
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Dynamic Subject and Body
  const generatedSubject = EMAIL_SUBJECT;
  const generatedBody = generateMegaDraft(formData);

  // Real-time mailto and web urls
  const mailtoUrl = buildMailtoUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, generatedSubject, generatedBody);
  const webGmailUrl = buildGmailComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, generatedSubject, generatedBody);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Trigger celebration & counter increment
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ef4444', '#fbbf24', '#38bdf8']
    });
    if (onActionCompleted) {
      onActionCompleted('emails');
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  // Handle Copy
  const handleCopy = (type = 'all') => {
    let textToCopy = '';
    if (type === 'all') {
      textToCopy = `To: ${PRIMARY_TO_RECIPIENTS.join(', ')}\nCc: ${CC_RECIPIENTS.join(', ')}\nSubject: ${generatedSubject}\n\n${generatedBody}`;
    } else if (type === 'subject') {
      textToCopy = generatedSubject;
    } else {
      textToCopy = generatedBody;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
      triggerCelebration();
    });
  };

  return (
    <section id="email-tool" className="py-14 bg-slate-950 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Action 1: Mass Email Blast</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Send Unified Mega-Draft to WB Authorities
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Direct 1-click dispatch to the WBJEE Board (<span className="text-white font-mono">TO</span>) and Higher Education Department (<span className="text-white font-mono">CC</span>).
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form & Targets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Input Form */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Enter Your Details</span>
                <span className="text-[10px] text-slate-400">Auto-fills into draft</span>
              </h3>

              <div className="space-y-3">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-rose-400" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <Hash className="w-3.5 h-3.5 text-rose-400" />
                    <span>WBJEE Roll Number *</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 2410108920"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Current Allotted Institute */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <School className="w-3.5 h-3.5 text-rose-400" />
                    <span>Current Allotted Institute *</span>
                  </label>
                  <input
                    type="text"
                    name="currentInstitute"
                    value={formData.currentInstitute}
                    onChange={handleInputChange}
                    placeholder="e.g. Heritage CSE / KGEC Mechanical / None"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Recipients Summary Card */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl text-xs">
              <h4 className="font-bold text-white text-xs mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Direct Target Desk List</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>7 Key Desks</span>
                </span>
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="font-bold text-rose-400 text-[11px] mb-0.5">PRIMARY (TO):</div>
                  <div className="font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-0.5">
                    <div>• info@wbjeeb.in (WBJEEB Official)</div>
                    <div>• helpdesk@wbjeeb.in (WBJEEB Support)</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-amber-400 text-[11px] mb-0.5">DTE, GOVT & HIGHER ED (CC):</div>
                  <div className="font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-0.5">
                    <div>• dtewbgovt@gmail.com (Directorate of Technical Ed)</div>
                    <div>• techedndirectoratewb@gmail.com (Tech Ed Directorate)</div>
                    <div>• highereducationwb@gmail.com (Higher Ed General)</div>
                    <div>• dpihedn@gmail.com (Director of Public Instruction)</div>
                    <div>• jdpidd1@gmail.com (Joint DPI)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Draft Preview & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              
              {/* Card Titlebar */}
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono">
                  Draft Representation
                </span>

                <button
                  onClick={() => handleCopy('subject')}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                >
                  {copiedType === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Subject</span>
                </button>
              </div>

              {/* Headers */}
              <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-1.5 text-xs">
                <div className="flex gap-2">
                  <span className="font-bold text-slate-400 w-12 shrink-0">TO:</span>
                  <span className="text-rose-300 font-mono break-all">
                    {PRIMARY_TO_RECIPIENTS.join(', ')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold text-slate-400 w-12 shrink-0">CC:</span>
                  <span className="text-amber-300 font-mono break-all">
                    {CC_RECIPIENTS.join(', ')}
                  </span>
                </div>
                <div className="flex gap-2 pt-1 border-t border-slate-800">
                  <span className="font-bold text-white w-12 shrink-0">SUBJ:</span>
                  <span className="text-white font-bold">{generatedSubject}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 max-h-[340px] overflow-y-auto text-slate-200 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap select-text">
                {generatedBody}
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
                
                {/* 1. Primary Action: Native Mailto Link (Triggers Gmail App / Mobile Mail App) */}
                <a
                  href={mailtoUrl}
                  onClick={triggerCelebration}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-rose-950 transition-all text-center"
                >
                  <Smartphone className="w-4 h-4 text-white" />
                  <span>Open in Mail / Gmail Mobile App</span>
                  <Send className="w-4 h-4 ml-1" />
                </a>

                {/* 2. Secondary Action: Web Browser Fallback for Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={webGmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerCelebration}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    <span>Open in Web Gmail (Browser)</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleCopy('all')}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    {copiedType === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Full Email!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Email & Recipients</span>
                      </>
                    )}
                  </button>
                </div>

                {showSuccessToast && (
                  <div className="p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Email launched! Now fire off your tweet below!</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
