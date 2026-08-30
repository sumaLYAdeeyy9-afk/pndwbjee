import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Copy, Check, ExternalLink, ShieldCheck, 
  User, Hash, Award, School, Phone, Smartphone, CheckCircle2, Globe,
  RotateCcw, Edit3, AlertCircle, Database, Lock
} from 'lucide-react';
import { 
  PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, EMAIL_SUBJECT, 
  generateMegaDraft, buildMailtoUrl, buildGmailComposeUrl 
} from '../data/emailTemplates';
import { saveStudentSubmission } from '../lib/submissionStore';

export default function EmailTool({ onActionCompleted, onOpenAdmin }) {
  // Form State with candidate fields
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    rankGmr: '',
    currentInstitute: '',
    contactInfo: ''
  });

  const [validationError, setValidationError] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationError) {
      setValidationError(false);
    }
  };

  // Body text change handler
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsManuallyEdited(true);
  };

  // Reset body to default template with current form data
  const handleResetDraft = () => {
    setSubject(EMAIL_SUBJECT);
    setBody(generateMegaDraft(formData));
    setIsManuallyEdited(false);
  };

  // Points 1 & 2 are REQUIRED, Points 3, 4, 5 are OPTIONAL
  const isFormComplete = Boolean(
    formData.studentName.trim().length >= 2 &&
    formData.rollNumber.trim().length >= 3
  );

  // Copy handler without incrementing counters
  const handleCopy = (type) => {
    let textToCopy = '';
    if (type === 'all') {
      textToCopy = `TO: ${PRIMARY_TO_RECIPIENTS.join(', ')}\nCC: ${CC_RECIPIENTS.join(', ')}\nSUBJECT: ${subject}\n\n${body}`;
    } else if (type === 'subject') {
      textToCopy = subject;
    } else if (type === 'body') {
      textToCopy = body;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fbbf24', '#38bdf8']
    });
    if (onActionCompleted) {
      onActionCompleted('emails');
    }
  };

  // Primary Dispatch Validator: Only complete required data allows dispatch & metric increment
  const handleDispatch = async (e, mode = 'app') => {
    setAttemptedSubmit(true);

    if (!isFormComplete) {
      e.preventDefault();
      setValidationError(true);
      setShowSuccessToast(false);
      return false;
    }

    setValidationError(false);

    // 1. Log & Store student submission
    try {
      await saveStudentSubmission(formData);
    } catch (err) {
      console.warn('Submission log warning:', err);
    }

    // 2. Increment live metrics & celebrate
    triggerCelebration();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 8000);

    return true;
  };

  // Real-time mailto and web urls using current editable subject and body
  const mailtoUrl = buildMailtoUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);
  const webGmailUrl = buildGmailComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);

  return (
    <section id="email-tool" className="py-14 bg-slate-950 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Action 1: Formal Representation Blast</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Send Verified Representation to WB Authorities
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Fill your details below to generate and send an official representation to WBJEEB (<span className="text-white font-mono">TO</span>), DTE, Higher Education Dept & Hon'ble CM (<span className="text-white font-mono">CC</span>).
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form & Targets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Input Form */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <h3 className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-rose-400" />
                  <span>Enter Candidate Details</span>
                </h3>
                {isFormComplete ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Ready to Send</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-semibold">
                    * Name & Roll required
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {/* 1. Student Name (REQUIRED) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-rose-400" />
                      <span>1. Full Name <span className="text-rose-400">*</span></span>
                    </span>
                    {formData.studentName.trim().length >= 2 && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sen"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                      attemptedSubmit && formData.studentName.trim().length < 2
                        ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30'
                        : 'border-slate-700 focus:border-rose-500'
                    }`}
                  />
                </div>

                {/* 2. WBJEE Roll Number (REQUIRED) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Hash className="w-3.5 h-3.5 text-rose-400" />
                      <span>2. WBJEE Roll Number <span className="text-rose-400">*</span></span>
                    </span>
                    {formData.rollNumber.trim().length >= 3 && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 2410108920"
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                      attemptedSubmit && formData.rollNumber.trim().length < 3
                        ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/30'
                        : 'border-slate-700 focus:border-rose-500'
                    }`}
                  />
                </div>

                {/* 3. WBJEE GMR / Rank (OPTIONAL) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>3. WBJEE GMR / Rank <span className="text-slate-400 font-normal text-[11px]">(Optional)</span></span>
                    </span>
                    {formData.rankGmr.trim().length >= 1 && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="rankGmr"
                    value={formData.rankGmr}
                    onChange={handleInputChange}
                    placeholder="e.g. GMR 3420 (optional)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* 4. Current Allotted Institute & Branch (OPTIONAL) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <School className="w-3.5 h-3.5 text-rose-400" />
                      <span>4. Currently Allotted College & Branch <span className="text-slate-400 font-normal text-[11px]">(Optional)</span></span>
                    </span>
                    {formData.currentInstitute.trim().length >= 1 && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="currentInstitute"
                    value={formData.currentInstitute}
                    onChange={handleInputChange}
                    placeholder="e.g. KGEC IT / None (optional)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {/* 5. Contact Info (Email / Mobile) (OPTIONAL) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <span>5. Registered Email / Mobile <span className="text-slate-400 font-normal text-[11px]">(Optional)</span></span>
                    </span>
                    {formData.contactInfo.trim().length >= 1 && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul.sen@gmail.com / 9876543210 (optional)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Incomplete Form Warning Banner */}
              {validationError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="font-bold text-rose-300 block">
                      Name & Roll Number Required
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      Please enter your Full Name and WBJEE Roll Number so your representation can be verified and counted in community metrics.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Target Desks Summary Box */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-lg text-xs">
              <h4 className="font-bold text-white text-xs mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Direct Target Desks (7 Authorities)</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Official Desks</span>
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
                  <div className="font-bold text-amber-400 text-[11px] mb-0.5">DTE, HIGHER ED & CMO (CC):</div>
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
                    <span>Auto-Generated Representation Draft</span>
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
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setIsManuallyEdited(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-medium focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              {/* Editable Body */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Official Representation Body (Editable):
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
                  href={isFormComplete ? mailtoUrl : '#'}
                  onClick={(e) => handleDispatch(e, 'app')}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all text-center ${
                    isFormComplete
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-900/40 cursor-pointer'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 cursor-pointer'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>
                    {isFormComplete
                      ? 'Send via Email App (Android / iPhone / Mail)'
                      : 'Enter Name & Roll Number Above to Send Email'}
                  </span>
                </a>

                {/* 2. Web Browser & Manual Copy Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={isFormComplete ? webGmailUrl : '#'}
                    target={isFormComplete ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    onClick={(e) => handleDispatch(e, 'web')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all text-center ${
                      isFormComplete
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                        : 'bg-slate-900/70 text-slate-400 border-slate-800 cursor-pointer'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Open in Web Gmail</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleCopy('all')}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all cursor-pointer"
                  >
                    {copiedType === 'all' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">All Text Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Complete Draft</span>
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
                  <strong>Representation Logged & Dispatched!</strong> Your candidate details have been recorded and your representation is ready to send.
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
