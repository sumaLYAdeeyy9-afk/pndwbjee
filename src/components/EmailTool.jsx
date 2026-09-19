import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Copy, Check, ExternalLink, ShieldCheck, 
  User, Hash, School, Phone, CheckCircle2, Globe,
  RotateCcw, Edit3, AlertCircle, Shuffle, GraduationCap,
  Users, Building, BookOpen, Sparkles, Award
} from 'lucide-react';
import { 
  PRIMARY_TO_RECIPIENTS, CC_RECIPIENTS, SENDER_ROLES,
  generateUniversalRepresentation, buildMailtoUrl, buildGmailComposeUrl, 
  buildOutlookComposeUrl, buildYahooComposeUrl 
} from '../data/emailTemplates';
import { saveStudentSubmission } from '../lib/submissionStore';

export default function EmailTool({ onActionCompleted }) {
  // Selected Sender Persona ('candidate' | 'senior' | 'alumni' | 'guardian')
  const [activeRole, setActiveRole] = useState('candidate');

  // Form states for all 4 sender personas
  const [formData, setFormData] = useState({
    // Candidate fields
    studentName: '',
    rollOrRank: '',
    currentInstitute: '',
    contactInfo: '',
    // Senior fields
    seniorCollege: '',
    seniorDeptYear: '',
    // Alumni fields
    alumniCollege: '',
    alumniBatchDept: '',
    // Guardian fields
    guardianName: '',
    wardDetails: '',
    wardAllotment: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // Dynamic variation seed (starts on a random number between 1 and 100 on page open)
  const [variationSeed, setVariationSeed] = useState(() => {
    return Math.floor(Math.random() * 100) + 1;
  });

  // Input refs for automatic focus on validation error
  const nameRef = useRef(null);
  const rollRankRef = useRef(null);
  const collegeRef = useRef(null);
  const phoneRef = useRef(null);
  const seniorCollegeRef = useRef(null);
  const seniorDeptYearRef = useRef(null);
  const alumniCollegeRef = useRef(null);
  const alumniBatchDeptRef = useRef(null);
  const guardianNameRef = useRef(null);
  const wardDetailsRef = useRef(null);
  const wardAllotmentRef = useRef(null);

  // Editable Subject & Body State
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  const [copiedType, setCopiedType] = useState(null); // 'all' | 'subject' | 'body'
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Synchronize draft dynamically when role, formData, or variationSeed changes (unless manually edited)
  useEffect(() => {
    if (!isManuallyEdited) {
      const generated = generateUniversalRepresentation({ 
        role: activeRole,
        ...formData, 
        seed: variationSeed 
      });
      setSubject(generated.subject);
      setBody(generated.body);
    }
  }, [activeRole, formData, variationSeed, isManuallyEdited]);

  // Handle role tab change
  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    setFormErrors({});
    setShowValidationAlert(false);
    setIsManuallyEdited(false);
    // Pick a new random seed for the new persona
    const newSeed = Math.floor(Math.random() * 100) + 1;
    setVariationSeed(newSeed);
  };

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

  // Quick select None handler for Candidate
  const handleSelectNone = () => {
    setFormData(prev => ({ ...prev, currentInstitute: 'None' }));
    if (formErrors.currentInstitute) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.currentInstitute;
        return next;
      });
    }
  };

  // Quick select None handler for Guardian's ward
  const handleSelectNoneWard = () => {
    setFormData(prev => ({ ...prev, wardAllotment: 'None' }));
    if (formErrors.wardAllotment) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.wardAllotment;
        return next;
      });
    }
  };

  // Quick college selector helper for Senior
  const handleQuickSeniorCollege = (collegeName) => {
    setFormData(prev => ({ ...prev, seniorCollege: collegeName }));
    if (formErrors.seniorCollege) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.seniorCollege;
        return next;
      });
    }
  };

  // Quick college selector helper for Alumni
  const handleQuickAlumniCollege = (collegeName) => {
    setFormData(prev => ({ ...prev, alumniCollege: collegeName }));
    if (formErrors.alumniCollege) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.alumniCollege;
        return next;
      });
    }
  };

  // Body text change handler
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsManuallyEdited(true);
  };

  // Shuffle to another unique representation out of 100+
  const handleShuffleDraft = () => {
    let nextSeed = Math.floor(Math.random() * 100) + 1;
    if (nextSeed === variationSeed) nextSeed = ((variationSeed + 7) % 100) + 1;
    setVariationSeed(nextSeed);
    
    const generated = generateUniversalRepresentation({ 
      role: activeRole,
      ...formData, 
      seed: nextSeed 
    });
    setSubject(generated.subject);
    setBody(generated.body);
    setIsManuallyEdited(false);
  };

  // Reset body to default generated template
  const handleResetDraft = () => {
    const generated = generateUniversalRepresentation({ 
      role: activeRole,
      ...formData, 
      seed: variationSeed 
    });
    setSubject(generated.subject);
    setBody(generated.body);
    setIsManuallyEdited(false);
  };

  // Validate that all required fields for active role are filled
  const validateForm = () => {
    const errors = {};

    if (activeRole === 'candidate') {
      if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
        errors.studentName = 'Full Name is mandatory';
      }
      if (!formData.rollOrRank.trim() || formData.rollOrRank.trim().length < 2) {
        errors.rollOrRank = 'WBJEE Roll Number or Rank (GMR) is mandatory';
      }
      if (!formData.currentInstitute.trim()) {
        errors.currentInstitute = 'Please enter your allotted college or select "None"';
      }
      if (!formData.contactInfo.trim() || formData.contactInfo.trim().length < 6) {
        errors.contactInfo = 'Valid Contact Number is mandatory';
      }
    } else if (activeRole === 'senior') {
      if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
        errors.studentName = 'Your Full Name is mandatory';
      }
      if (!formData.seniorCollege.trim() || formData.seniorCollege.trim().length < 2) {
        errors.seniorCollege = 'Institution / University Name is mandatory';
      }
      if (!formData.seniorDeptYear.trim() || formData.seniorDeptYear.trim().length < 2) {
        errors.seniorDeptYear = 'Department & Year of Study is mandatory';
      }
      if (!formData.contactInfo.trim() || formData.contactInfo.trim().length < 6) {
        errors.contactInfo = 'Contact Number or Email is mandatory';
      }
    } else if (activeRole === 'alumni') {
      if (!formData.studentName.trim() || formData.studentName.trim().length < 2) {
        errors.studentName = 'Your Full Name is mandatory';
      }
      if (!formData.alumniCollege.trim() || formData.alumniCollege.trim().length < 2) {
        errors.alumniCollege = 'Alma Mater / College Name is mandatory';
      }
      if (!formData.alumniBatchDept.trim() || formData.alumniBatchDept.trim().length < 2) {
        errors.alumniBatchDept = 'Department & Graduation Batch is mandatory';
      }
      if (!formData.contactInfo.trim() || formData.contactInfo.trim().length < 6) {
        errors.contactInfo = 'Contact Number or Email is mandatory';
      }
    } else if (activeRole === 'guardian') {
      if (!formData.guardianName.trim() || formData.guardianName.trim().length < 2) {
        errors.guardianName = 'Parent / Guardian Full Name is mandatory';
      }
      if (!formData.wardDetails.trim() || formData.wardDetails.trim().length < 2) {
        errors.wardDetails = 'Ward’s Name and WBJEE Roll/Rank is mandatory';
      }
      if (!formData.wardAllotment.trim()) {
        errors.wardAllotment = 'Please enter ward’s allotted college or select "None"';
      }
      if (!formData.contactInfo.trim() || formData.contactInfo.trim().length < 6) {
        errors.contactInfo = 'Valid Contact Number is mandatory';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowValidationAlert(true);
      // Focus first error field
      if (activeRole === 'candidate') {
        if (errors.studentName && nameRef.current) nameRef.current.focus();
        else if (errors.rollOrRank && rollRankRef.current) rollRankRef.current.focus();
        else if (errors.currentInstitute && collegeRef.current) collegeRef.current.focus();
        else if (errors.contactInfo && phoneRef.current) phoneRef.current.focus();
      } else if (activeRole === 'senior') {
        if (errors.studentName && nameRef.current) nameRef.current.focus();
        else if (errors.seniorCollege && seniorCollegeRef.current) seniorCollegeRef.current.focus();
        else if (errors.seniorDeptYear && seniorDeptYearRef.current) seniorDeptYearRef.current.focus();
        else if (errors.contactInfo && phoneRef.current) phoneRef.current.focus();
      } else if (activeRole === 'alumni') {
        if (errors.studentName && nameRef.current) nameRef.current.focus();
        else if (errors.alumniCollege && alumniCollegeRef.current) alumniCollegeRef.current.focus();
        else if (errors.alumniBatchDept && alumniBatchDeptRef.current) alumniBatchDeptRef.current.focus();
        else if (errors.contactInfo && phoneRef.current) phoneRef.current.focus();
      } else if (activeRole === 'guardian') {
        if (errors.guardianName && guardianNameRef.current) guardianNameRef.current.focus();
        else if (errors.wardDetails && wardDetailsRef.current) wardDetailsRef.current.focus();
        else if (errors.wardAllotment && wardAllotmentRef.current) wardAllotmentRef.current.focus();
        else if (errors.contactInfo && phoneRef.current) phoneRef.current.focus();
      }
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
    let nameToSave = formData.studentName.trim();
    let rollToSave = formData.rollOrRank.trim();
    let collegeToSave = formData.currentInstitute.trim();

    if (activeRole === 'senior') {
      nameToSave = `${formData.studentName.trim()} (Senior Student)`;
      rollToSave = formData.seniorDeptYear.trim();
      collegeToSave = formData.seniorCollege.trim();
    } else if (activeRole === 'alumni') {
      nameToSave = `${formData.studentName.trim()} (Alumnus)`;
      rollToSave = formData.alumniBatchDept.trim();
      collegeToSave = formData.alumniCollege.trim();
    } else if (activeRole === 'guardian') {
      nameToSave = `${formData.guardianName.trim()} (Guardian)`;
      rollToSave = formData.wardDetails.trim();
      collegeToSave = formData.wardAllotment.trim();
    }

    saveStudentSubmission({
      studentName: nameToSave || 'Bonafide Citizen',
      rollNumber: rollToSave || 'Specified in Body',
      rankGmr: rollToSave || '',
      currentInstitute: collegeToSave || '',
      contactInfo: formData.contactInfo.trim(),
      subject: subject,
      templateType: `offline_dc_${activeRole}`,
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
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Universal Representation Dispatcher</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span className="text-amber-400 font-semibold lowercase">#DemandOfflineDC</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
            Send Official Email Representation to <span className="text-rose-500">WBJEEB, DTE & JU VC</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Select your profile below. The representation letter, tone, and legal perspective will automatically calibrate to who is sending.
          </p>
        </div>

        {/* PROFILE / ROLE SELECTOR TABS (4 DISTINCT PROFILES) */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            
            {/* 1. Candidate Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('candidate')}
              className={`p-2.5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                activeRole === 'candidate'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-950 ring-1 ring-rose-400'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === 'candidate' ? 'bg-white/20' : 'bg-slate-800 text-rose-400'}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs block truncate">Candidate</span>
                <span className={`text-[10px] block truncate ${activeRole === 'candidate' ? 'text-rose-100' : 'text-slate-400'}`}>
                  1st Yr Aspirant
                </span>
              </div>
            </button>

            {/* 2. Senior Student Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('senior')}
              className={`p-2.5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                activeRole === 'senior'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-950 ring-1 ring-amber-400'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === 'senior' ? 'bg-white/20' : 'bg-slate-800 text-amber-400'}`}>
                <School className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs block truncate">Senior Student</span>
                <span className={`text-[10px] block truncate ${activeRole === 'senior' ? 'text-amber-100' : 'text-slate-400'}`}>
                  2nd/3rd/4th Year
                </span>
              </div>
            </button>

            {/* 3. College Alumni Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('alumni')}
              className={`p-2.5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                activeRole === 'alumni'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-950 ring-1 ring-blue-400'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === 'alumni' ? 'bg-white/20' : 'bg-slate-800 text-blue-400'}`}>
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs block truncate">College Alumnus</span>
                <span className={`text-[10px] block truncate ${activeRole === 'alumni' ? 'text-blue-100' : 'text-slate-400'}`}>
                  Graduate Engineer
                </span>
              </div>
            </button>

            {/* 4. Parent / Guardian Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('guardian')}
              className={`p-2.5 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                activeRole === 'guardian'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950 ring-1 ring-emerald-400'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeRole === 'guardian' ? 'bg-white/20' : 'bg-slate-800 text-emerald-400'}`}>
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs block truncate">Parent / Guardian</span>
                <span className={`text-[10px] block truncate ${activeRole === 'guardian' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Concerned Family
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* Validation Error Banner */}
        {showValidationAlert && (
          <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/50 text-rose-300 flex items-center space-x-3 text-xs sm:text-sm shadow-xl animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-bold text-white block">Mandatory Information Required:</strong>
              <span>Please fill all required fields marked with an asterisk (*) before dispatching your representation.</span>
            </div>
          </div>
        )}

        {/* 1. Dynamic Candidate Details & Live Draft Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto mb-8">
          
          {/* Left Column: Dynamic Persona Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-bold text-sm text-white">
                {activeRole === 'candidate' && <GraduationCap className="w-4 h-4 text-rose-400" />}
                {activeRole === 'senior' && <School className="w-4 h-4 text-amber-400" />}
                {activeRole === 'alumni' && <Award className="w-4 h-4 text-blue-400" />}
                {activeRole === 'guardian' && <Users className="w-4 h-4 text-emerald-400" />}
                <span>
                  {activeRole === 'candidate' && 'Candidate Verification Details'}
                  {activeRole === 'senior' && 'Senior Undergrad Details'}
                  {activeRole === 'alumni' && 'Alumnus / Graduate Details'}
                  {activeRole === 'guardian' && 'Guardian & Ward Details'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                Mandatory *
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeRole === 'candidate' && 'Your credentials will be attached to the official representation signature to certify bonafide candidate status.'}
              {activeRole === 'senior' && 'Representing your university department as an enrolled senior in solidarity with incoming juniors against seat wastage.'}
              {activeRole === 'alumni' && 'Representing your alma mater as an engineering graduate to protect institutional excellence and meritocracy.'}
              {activeRole === 'guardian' && 'Representing as parents and guardians to appeal against unjust seat-blocking and financial distress.'}
            </p>

            <div className="space-y-3.5 pt-1">
              
              {/* ================= CANDIDATE FIELDS ================= */}
              {activeRole === 'candidate' && (
                <>
                  {/* Candidate Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Candidate Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={nameRef}
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

                  {/* Unified Roll / Rank */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WBJEE 2026 Roll Number / Rank (GMR) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={rollRankRef}
                        type="text"
                        name="rollOrRank"
                        value={formData.rollOrRank}
                        onChange={handleInputChange}
                        placeholder="e.g. Roll: 26010045892 or GMR: 12450"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.rollOrRank 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        }`}
                      />
                    </div>
                    {formErrors.rollOrRank && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.rollOrRank}
                      </span>
                    )}
                  </div>

                  {/* Allotted College with quick None button */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Allotted College <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectNone}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                          formData.currentInstitute.trim().toLowerCase() === 'none'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-800 text-rose-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        Select "None" (Unallotted)
                      </button>
                    </div>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={collegeRef}
                        type="text"
                        name="currentInstitute"
                        value={formData.currentInstitute}
                        onChange={handleInputChange}
                        placeholder="e.g. KGEC / HIT / or click None above"
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
                </>
              )}

              {/* ================= SENIOR STUDENT FIELDS ================= */}
              {activeRole === 'senior' && (
                <>
                  {/* Senior Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={nameRef}
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Anirban Mukherjee"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.studentName 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {formErrors.studentName && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.studentName}
                      </span>
                    )}
                  </div>

                  {/* Senior College / University */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current College / University <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={seniorCollegeRef}
                        type="text"
                        name="seniorCollege"
                        value={formData.seniorCollege}
                        onChange={handleInputChange}
                        placeholder="e.g. Jadavpur University / KGEC / CU"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.seniorCollege 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {/* Quick College Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['Jadavpur University', 'Calcutta University', 'KGEC Kalyani', 'JGEC Jalpaiguri'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleQuickSeniorCollege(col)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                    {formErrors.seniorCollege && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.seniorCollege}
                      </span>
                    )}
                  </div>

                  {/* Department & Year of Study */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department & Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={seniorDeptYearRef}
                        type="text"
                        name="seniorDeptYear"
                        value={formData.seniorDeptYear}
                        onChange={handleInputChange}
                        placeholder="e.g. 3rd Year CSE / 2nd Year ME / 4th Year EE"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.seniorDeptYear 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        }`}
                      />
                    </div>
                    {formErrors.seniorDeptYear && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.seniorDeptYear}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* ================= ALUMNI FIELDS ================= */}
              {activeRole === 'alumni' && (
                <>
                  {/* Alumni Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={nameRef}
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sayantan Banerjee"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.studentName 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {formErrors.studentName && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.studentName}
                      </span>
                    )}
                  </div>

                  {/* Alma Mater */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Alma Mater / College Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={alumniCollegeRef}
                        type="text"
                        name="alumniCollege"
                        value={formData.alumniCollege}
                        onChange={handleInputChange}
                        placeholder="e.g. Jadavpur University / KGEC / CU"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.alumniCollege 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {/* Quick College Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['Jadavpur University', 'Calcutta University', 'KGEC Kalyani', 'JGEC Jalpaiguri'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleQuickAlumniCollege(col)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                    {formErrors.alumniCollege && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.alumniCollege}
                      </span>
                    )}
                  </div>

                  {/* Department & Graduation Batch */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department & Graduation Batch <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={alumniBatchDeptRef}
                        type="text"
                        name="alumniBatchDept"
                        value={formData.alumniBatchDept}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Tech Mechanical (Batch of 2023) / CSE 2024"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.alumniBatchDept 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    {formErrors.alumniBatchDept && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.alumniBatchDept}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* ================= GUARDIAN FIELDS ================= */}
              {activeRole === 'guardian' && (
                <>
                  {/* Guardian Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Parent / Guardian Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={guardianNameRef}
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        placeholder="e.g. Subir Kumar Dey"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.guardianName 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {formErrors.guardianName && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.guardianName}
                      </span>
                    )}
                  </div>

                  {/* Ward Details */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ward’s Name & WBJEE Roll No. / Rank (GMR) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={wardDetailsRef}
                        type="text"
                        name="wardDetails"
                        value={formData.wardDetails}
                        onChange={handleInputChange}
                        placeholder="e.g. Sourav Dey (Roll: 26010045892 / GMR 8420)"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.wardDetails 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {formErrors.wardDetails && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.wardDetails}
                      </span>
                    )}
                  </div>

                  {/* Ward Allotment with None button */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Ward's Allotted College <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectNoneWard}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                          formData.wardAllotment.trim().toLowerCase() === 'none'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        Select "None" (Unallotted)
                      </button>
                    </div>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        ref={wardAllotmentRef}
                        type="text"
                        name="wardAllotment"
                        value={formData.wardAllotment}
                        onChange={handleInputChange}
                        placeholder="e.g. Unallotted / None / GCETTS"
                        className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                          formErrors.wardAllotment 
                            ? 'border-rose-500 ring-1 ring-rose-500' 
                            : 'border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {formErrors.wardAllotment && (
                      <span className="text-[11px] text-rose-400 font-medium mt-0.5 block">
                        {formErrors.wardAllotment}
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Contact Number (Common to all roles) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Number / Phone <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={phoneRef}
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
                Targeted Official Recipients (All Addressed):
              </span>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TO (Primary):</span>
                  <span className="font-mono text-rose-400 font-bold">info@wbjeeb.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CC (JU VC Desk):</span>
                  <span className="font-mono text-emerald-400 font-semibold">vc@jadavpuruniversity.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CC (FETSU JU):</span>
                  <span className="font-mono text-amber-400 font-semibold">fetsujadavpuruniversity@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CC (State Desks):</span>
                  <span className="text-slate-400 font-mono text-[10px]">DTE, Higher Ed, DPI, CMO</span>
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
                  <span className="text-sm font-bold text-white">Live Representation Draft</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold border border-slate-700 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Variant #{variationSeed} of 100+</span>
                  </span>
                  {isManuallyEdited && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      Customized
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Shuffle Representation Button */}
                  <button
                    type="button"
                    onClick={handleShuffleDraft}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/30 to-amber-600/30 hover:from-rose-600/50 hover:to-amber-600/50 text-white text-xs font-bold flex items-center space-x-1.5 transition-all border border-rose-500/40 shadow-sm cursor-pointer active:scale-95"
                    title="Shuffle between 100+ diverse AI-crafted representation templates"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Shuffle Draft (100+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDraft}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700 cursor-pointer"
                    title="Reset to Template"
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
                    Subject Line (Calibrated to {activeRole.toUpperCase()}):
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy('subject')}
                    className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1 cursor-pointer"
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
                    Representation Body (Universally Addressed & Auto-Signed):
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy('body')}
                    className="text-[11px] text-rose-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedType === 'body' ? <span>Copied!</span> : <span>Copy Body Text</span>}
                  </button>
                </div>
                <textarea
                  rows={16}
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
                <span>Universally addressed to WBJEEB, DTE, JU VC, Higher Ed & DPI</span>
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
                Dispatch Representation to All Statutory Desks
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Click below to launch your email client with verified recipients (WBJEEB, JU VC, DTE & Higher Ed), tailored subject line, and your signed appeal pre-loaded.
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
