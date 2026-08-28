import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Copy, Check, ExternalLink, ShieldCheck, 
  User, Hash, School, Smartphone, CheckCircle2, Globe,
  RotateCcw, Edit3
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

  // Editable Subject & Body State
  const [subject, setSubject] = useState(EMAIL_SUBJECT);
  const [body, setBody] = useState(() => generateMegaDraft({}));
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const [copiedType, setCopiedType] = useState(null); // 'all' | 'subject' | 'body'
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Auto-fill template unless user has manually customized the body text
  useEffect(() => {
    if (!isManuallyEdited) {
      setBody(generateMegaDraft(formData));
    }
  }, [formData, isManuallyEdited]);

  // Real-time mailto and web urls using current editable subject and body
  const mailtoUrl = buildMailtoUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);
  const webGmailUrl = buildGmailComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Body text change handler
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsManuallyEdited(true);
  };

  // Subject text change handler
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Reset to default template
  const handleResetDraft = () => {
    setIsManuallyEdited(false);
    setSubject(EMAIL_SUBJECT);
    setBody(generateMegaDraft(formData));
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
      textToCopy = `To: ${PRIMARY_TO_RECIPIENTS.join(', ')}\nCc: ${CC_RECIPIENTS.join(', ')}\nSubject: ${subject}\n\n${body}`;
    } else if (type === 'subject') {
      textToCopy = subject;
    } else {
      textToCopy = body;
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
            Direct 1-click dispatch to WBJEEB (<span className="text-white font-mono">TO</span>), DTE & Higher Education Dept (<span className="text-white font-mono">CC</span>). You can freely edit both subject and body.
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
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sen"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <Hash className="w-3.5 h-3.5 text-rose-400" />
                    <span>WBJEE Roll / Rank Number *</span>
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
                    <div>• info@wbjeeb.in (WBJEEB Official Desk)</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-amber-400 text-[11px] mb-0.5">DTE, GOVT, HIGHER ED & CMO (CC):</div>
                  <div className="font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-0.5">
                    <div>• dtewbgovt@gmail.com (Directorate of Technical Ed)</div>
                    <div>• techedndirectoratewb@gmail.com (Tech Ed Directorate)</div>
                    <div>• highereducationwb@gmail.com (Higher Ed General)</div>
                    <div>• dpihedn@gmail.com (Director of Public Instruction)</div>
                    <div>• jdpidd1@gmail.com (Joint DPI)</div>
                    <div>• adhikarisuvenduwb1@gmail.com (Hon'ble CM Shri Suvendu Adhikari)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Editable Preview & Dispatch (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 sm:p-6">
              
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center space-x-1.5">
                    <Edit3 className="w-4 h-4 text-rose-400" />
                    <span>Editable Representation Draft</span>
                  </h3>
                </div>

                <button
                  onClick={handleResetDraft}
                  className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  title="Reset to default template"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Draft</span>
                </button>
              </div>

              {/* Editable Subject */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <span>Subject Line (Editable):</span>
                  </label>
                  <button
                    onClick={() => handleCopy('subject')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-semibold"
                  >
                    {copiedType === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'subject' ? 'Copied' : 'Copy Subject'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={handleSubjectChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              {/* Editable Email Body */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Email Body (Editable - Type or refine text below):
                  </label>
                  <button
                    onClick={() => handleCopy('body')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-semibold"
                  >
                    {copiedType === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'body' ? 'Copied' : 'Copy Body'}</span>
                  </button>
                </div>

                <textarea
                  value={body}
                  onChange={handleBodyChange}
                  rows={13}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:border-rose-500 transition-all resize-y"
                  placeholder="Draft content..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                
                {/* 1. Native Mobile Email App Button */}
                <a
                  href={mailtoUrl}
                  onClick={triggerCelebration}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-900/40 transition-all cursor-pointer text-center"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Send via Email App (Android / iPhone / Mail)</span>
                </a>

                {/* 2. Web Browser & Manual Copy Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={webGmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerCelebration}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all text-center"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Open in Web Gmail</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleCopy('all')}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all"
                  >
                    {copiedType === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">All Text Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Complete Email</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 shadow-xl animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Representation Triggered!</strong> Thank you for taking a stand for WBJEE students.
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
