import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Copy, Check, ExternalLink, ShieldCheck, 
  User, Hash, Award, School, Phone, CheckCircle2, Globe,
  RotateCcw, Edit3, AlertCircle, Shuffle
} from 'lucide-react';
import { 
  PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, 
  generateUniqueEmail, buildMailtoUrl, buildGmailComposeUrl, 
  buildOutlookComposeUrl, buildYahooComposeUrl 
} from '../data/emailTemplates';
import { saveStudentSubmission } from '../lib/submissionStore';

export default function EmailTool({ onActionCompleted }) {
  // Mandatory candidate info state
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    rankGmr: '',
    currentInstitute: '',
    contactInfo: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const nameInputRef = useRef(null);
  const rollInputRef = useRef(null);
  const rankInputRef = useRef(null);
  const collegeInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Dynamic variation seed (starts on a random variation)
  const [variationSeed, setVariationSeed] = useState(() => {
    return Math.floor(Math.random() * 10) + 1;
  });

  // Editable Subject & Body State initialized with dynamic variation
  const [subject, setSubject] = useState(() => {
    const initial = generateUniqueEmail({ seed: 1 });
    return initial.subject;
  });
  const [body, setBody] = useState(() => {
    const initial = generateUniqueEmail({ seed: 1 });
    return initial.body;
  });
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const [copiedType, setCopiedType] = useState(null); // 'all' | 'subject' | 'body'
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Synchronize draft dynamically with formData and variationSeed unless manually edited
  useEffect(() => {
    if (!isManuallyEdited) {
      const generated = generateUniqueEmail({ 
        ...formData, 
        seed: variationSeed 
      });
      setSubject(generated.subject);
      setBody(generated.body);
    }
  }, [formData, variationSeed, isManuallyEdited]);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Body text change handler
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsManuallyEdited(true);
  };

  // Shuffle to next unique subject line
  const handleShuffleDraft = () => {
    const nextSeed = (variationSeed % 10) + 1;
    setVariationSeed(nextSeed);
    const generated = generateUniqueEmail({ 
      ...formData, 
      seed: nextSeed 
    });
    setSubject(generated.subject);
    setBody(generated.body);
    setIsManuallyEdited(false);
  };

  // Reset body to default template
  const handleResetDraft = () => {
    const generated = generateUniqueEmail({ 
      ...formData, 
      seed: variationSeed 
    });
    setSubject(generated.subject);
    setBody(generated.body);
    setIsManuallyEdited(false);
  };

  // Validate that all required candidate fields are filled
  const validateForm = () => {
    const errors = {};
    if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
      errors.studentName = 'Full Name is mandatory';
    }
    if (!formData.rollNumber.trim() || formData.rollNumber.trim().length < 3) {
      errors.rollNumber = 'WBJEE Application Number is mandatory';
    }
    if (!formData.rankGmr.trim()) {
      errors.rankGmr = 'WBJEE Rank / GMR is mandatory';
    }
    if (!formData.currentInstitute.trim()) {
      errors.currentInstitute = 'Interested or Allotted College is mandatory';
    }
    if (!formData.contactInfo.trim() || formData.contactInfo.trim().length < 6) {
      errors.contactInfo = 'Valid Contact Number is mandatory';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowValidationAlert(true);
      // Focus first error field
      if (errors.studentName && nameInputRef.current) nameInputRef.current.focus();
      else if (errors.rollNumber && rollInputRef.current) rollInputRef.current.focus();
      else if (errors.rankGmr && rankInputRef.current) rankInputRef.current.focus();
      else if (errors.currentInstitute && collegeInputRef.current) collegeInputRef.current.focus();
      else if (errors.contactInfo && phoneInputRef.current) phoneInputRef.current.focus();
      return false;
    }

    setShowValidationAlert(false);
    return true;
  };

  // Real-time mailto and web urls using current editable subject and body
  const mailtoUrl = buildMailtoUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);
  const webGmailUrl = buildGmailComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);
  const webOutlookUrl = buildOutlookComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);
  const webYahooUrl = buildYahooComposeUrl(PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, subject, body);

  // Record submission in database, notify parent counter & trigger UI celebration
  const recordSubmissionAndCelebrate = () => {
    saveStudentSubmission({
      studentName: formData.studentName.trim(),
      rollNumber: formData.rollNumber.trim(),
      rankGmr: formData.rankGmr.trim(),
      currentInstitute: formData.currentInstitute.trim(),
      contactInfo: formData.contactInfo.trim(),
      subject: subject,
      templateType: 'offline_dc',
      isAnonymous: false
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    if (typeof onActionCompleted === 'function') {
      onActionCompleted('emails');
    }

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  // Copy handler
  const handleCopy = (type) => {
    let textToCopy = '';
    if (type === 'all') {
      if (!validateForm()) return;
      textToCopy = `TO: ${PRIMARY_TO_RECIPIENTS.join(', ')}\nCC: ${CC_RECIPIENTS.join(', ')}\nSUBJECT: ${subject}\n\n${body}`;
      recordSubmissionAndCelebrate();
    } else if (type === 'subject') {
      textToCopy = subject;
    } else if (type === 'body') {
      textToCopy = body;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Direct dispatch action strictly requiring validation
  const executeDispatch = (mode) => {
    if (!validateForm()) return;

    recordSubmissionAndCelebrate();

    if (mode === 'app') {
      window.location.href = mailtoUrl;
    } else if (mode === 'gmail') {
      window.open(webGmailUrl, '_blank');
    } else if (mode === 'outlook') {
      window.open(webOutlookUrl, '_blank');
    } else if (mode === 'yahoo') {
      window.open(webYahooUrl, '_blank');
    }
  };

  return (
    <section id="email-tool" className="py-10 bg-slate-950 border-b border-slate-800 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Formal Representation Dispatcher</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span className="text-amber-400 font-semibold lowercase">#DemandOfflineDC</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
            Send Official Email Representation to <span className="text-rose-500">WBJEEB & Govt</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Fill your mandatory candidate credentials to generate your bonafide representation and dispatch directly to WBJEEB, DTE & Higher Education Department.
          </p>
        </div>

        {/* Validation Error Banner */}
        {showValidationAlert && (
          <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/50 text-rose-300 flex items-center space-x-3 text-xs sm:text-sm shadow-xl animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-bold text-white block">Mandatory Candidate Information Required:</strong>
              <span>Please fill in all candidate details below (Name, WBJEE Application Number, Rank/GMR, College & Contact Number) before dispatching.</span>
            </div>
          </div>
        )}

        {/* 1. Candidate Details & Live Draft Editor Grid (FIRST) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto mb-8">
          
          {/* Left Column: Mandatory Candidate Info Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Candidate Information (Mandatory)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                Required *
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              All representations must carry verified candidate credentials to maintain official legal validity and merit standing.
            </p>

            <div className="space-y-3 pt-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Candidate Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sen"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.studentName 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
                {formErrors.studentName && (
                  <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                    {formErrors.studentName}
                  </span>
                )}
              </div>

              {/* Application / Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WBJEE 2026 Application Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={rollInputRef}
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 26010045892"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.rollNumber 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
                {formErrors.rollNumber && (
                  <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                    {formErrors.rollNumber}
                  </span>
                )}
              </div>

              {/* WBJEE Rank / GMR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WBJEE 2026 Rank / GMR <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={rankInputRef}
                    type="text"
                    name="rankGmr"
                    value={formData.rankGmr}
                    onChange={handleInputChange}
                    placeholder="e.g. GMR 12450"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.rankGmr 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
                {formErrors.rankGmr && (
                  <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                    {formErrors.rankGmr}
                  </span>
                )}
              </div>

              {/* Interested / Allotted Institute */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Interested / Allotted College <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={collegeInputRef}
                    type="text"
                    name="currentInstitute"
                    value={formData.currentInstitute}
                    onChange={handleInputChange}
                    placeholder="e.g. Jadavpur Univ / KGEC / Unallotted"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.currentInstitute 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
                {formErrors.currentInstitute && (
                  <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                    {formErrors.currentInstitute}
                  </span>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={phoneInputRef}
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="e.g. 9830XXXXXX"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      formErrors.contactInfo 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
                {formErrors.contactInfo && (
                  <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                    {formErrors.contactInfo}
                  </span>
                )}
              </div>

            </div>

            {/* Official Recipients Mini-Card */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[11px]">
                Targeted Official Recipients:
              </span>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TO (Primary):</span>
                  <span className="font-mono text-rose-400 font-bold">info@wbjeeb.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CC (State Desks):</span>
                  <span className="text-slate-400 font-mono">DTE, Higher Ed, DPI, CM Desk</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Representation Draft & Editor */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            
            <div>
              {/* Draft Header Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4 text-rose-400" />
                  <span className="text-sm font-bold text-white">Representation Draft Preview</span>
                  {isManuallyEdited && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      Customized
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleShuffleDraft}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                    title="Shuffle Subject Line"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle Subject</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDraft}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700"
                    title="Reset to Original Template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Subject Line Field */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Subject Line:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy('subject')}
                    className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1"
                  >
                    {copiedType === 'subject' ? <span>Copied!</span> : <span>Copy Subject</span>}
                  </button>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setIsManuallyEdited(true);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Body Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Representation Body (Auto-Signed with Your Mandatory Details):
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy('body')}
                    className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1"
                  >
                    {copiedType === 'body' ? <span>Copied!</span> : <span>Copy Body Text</span>}
                  </button>
                </div>
                <textarea
                  rows={15}
                  value={body}
                  onChange={handleBodyChange}
                  className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-rose-500 resize-y"
                  placeholder="Official representation text..."
                />
              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Formal, verified representation addressed to WBJEEB & DTE</span>
              </span>
            </div>

          </div>

        </div>

        {/* 2. 1-Click Action Dispatch Card (LOWER DOWN) */}
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border-2 border-rose-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
            <div className="text-left space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Choose Your Preferred Dispatch Mode
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Dispatch Representation to Official Desks
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Click below to launch your email client with verified recipients, tailored subject line, and your signed appeal pre-loaded.
              </p>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full md:w-auto">
              
              {/* Primary: Native Mail App */}
              <button
                type="button"
                onClick={() => executeDispatch('app')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-600/30 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Send via Mail App</span>
              </button>

              {/* Web Gmail */}
              <button
                type="button"
                onClick={() => executeDispatch('gmail')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Gmail Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Web Outlook */}
              <button
                type="button"
                onClick={() => executeDispatch('outlook')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center space-x-2 transition-all active:scale-95 hidden sm:flex cursor-pointer"
              >
                <span>Outlook Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Copy Full Representation */}
              <button
                type="button"
                onClick={() => handleCopy('all')}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                {copiedType === 'all' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-bold">Draft Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Copy Full Draft</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Representation Recorded!</span>
            <span>Thank you for adding your verified voice to the WBJEE Offline DC demand.</span>
          </div>
        </div>
      )}

    </section>
  );
}
