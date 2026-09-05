// Official Decision Tree Model and Logic Engine for WBJEE 2026 Decentralised Counselling (DC)
// Derived from Official Notification No. WBE/C-02/26 (14 Pages)

export const DC_PRESETS = [
  {
    id: 'admitted_govt_aiming_ju',
    label: 'Admitted in Govt/Pvt College, Aiming for Better College in DC',
    description: 'Holding a confirmed CC seat and wanting to participate in DC Phase 1 & 2 without losing current seat.',
    constraints: {
      ccStatus: 'admitted',
      retainSeat: true,
      targetPhase: 'both',
      rankType: 'gmr',
      category: 'GEN',
      domicile: 'wb_domicile',
      instType: 'govt_univ',
      primaryGoal: 'upgrade_college',
      currentCollegeFee: 35000,
      currentCollegeType: 'private'
    }
  },
  {
    id: 'admitted_branch_upgrade',
    label: 'Admitted Candidate Upgrading Branch in Same College',
    description: 'Admitted in a college, aiming to shift to CSE/IT/ECE in DC Phase 1.',
    constraints: {
      ccStatus: 'admitted',
      retainSeat: true,
      targetPhase: 'both',
      rankType: 'gmr',
      category: 'GEN',
      domicile: 'wb_domicile',
      instType: 'govt_college',
      primaryGoal: 'upgrade_branch_same',
      currentCollegeFee: 12000,
      currentCollegeType: 'govt'
    }
  },
  {
    id: 'unallotted_fresh_dc',
    label: 'No Seat in Centralised Counselling (Fresh Attempt)',
    description: 'Participated in CC Round 1/2/Mop-Up but did not receive any allotment.',
    constraints: {
      ccStatus: 'unallotted',
      retainSeat: false,
      targetPhase: 'both',
      rankType: 'gmr',
      category: 'OBC-A',
      domicile: 'wb_domicile',
      instType: 'govt_college',
      primaryGoal: 'fresh_admission',
      currentCollegeFee: 0,
      currentCollegeType: 'govt'
    }
  },
  {
    id: 'jee_main_non_domicile',
    label: 'All-India / JEE Main Candidate (Non-Domicile)',
    description: 'Applying through JEE Main score for private engineering colleges or open seats.',
    constraints: {
      ccStatus: 'unregistered',
      retainSeat: false,
      targetPhase: 'both',
      rankType: 'jee_main',
      category: 'GEN',
      domicile: 'non_domicile',
      instType: 'private_college',
      primaryGoal: 'fresh_admission',
      currentCollegeFee: 0,
      currentCollegeType: 'private'
    }
  }
];

export const FLOWCHART_NODES = [
  // Stage 0: Initial State
  {
    id: 'node_start',
    label: 'Candidate Starting Point',
    sublabel: 'Centralised Counselling (CC) Status',
    stage: 'start',
    clause: 'Clause 5 (Page 2)',
    description: 'Candidate determines their eligibility based on their final status after WBJEE Centralised Counselling Rounds 1, 2, and Mop-Up.',
    category: 'info'
  },
  // Stage 1: Eligibility Assessment
  {
    id: 'node_eligibility_check',
    label: 'Eligibility & Category Verification',
    sublabel: 'Category I, II, III, IV, or V',
    stage: 'eligibility',
    clause: 'Clause 5 (Page 2-3)',
    description: 'Eligible categories: Cat I (Admitted via CC), Cat II (Allotted not admitted), Cat III (Unallotted), Cat IV (Did not register/participate), Cat V (All-India/JEE Main candidates).',
    category: 'decision'
  },
  // Stage 2: Registration & Fee
  {
    id: 'node_dc_registration',
    label: 'DC Online Registration',
    sublabel: 'Application Fee: ₹250 per Institute',
    stage: 'registration',
    clause: 'Clause 6 (Page 3)',
    description: 'Register online separately for each participating institute portal. Pay non-refundable ₹250 application fee per institute.',
    category: 'action'
  },
  // Stage 3: Seat Retention & Protection
  {
    id: 'node_seat_protection',
    label: 'Seat Protection Guarantee',
    sublabel: 'Original CC Seat 100% Protected',
    stage: 'protection',
    clause: 'Clause 14 (Page 7)',
    description: 'Candidates who are already admitted do NOT need to surrender their existing seat. The confirmed admission remains 100% safe and intact while participating in DC.',
    category: 'protection'
  },
  // Stage 4: Choice Filling & Merit List
  {
    id: 'node_merit_compilation',
    label: 'Merit List Priority Compilation',
    sublabel: 'GMR (Tier 1) > JEE Main (Tier 2) > HMR (Tier 3)',
    stage: 'merit',
    clause: 'Clause 9 (Page 4-5)',
    description: 'Institutes prepare merit lists following strict statutory hierarchy: WBJEE GMR candidates receive first priority. Vacant seats then go to JEE Main rank holders, followed by 10+2 HMR candidates.',
    category: 'action'
  },
  // Stage 5: DC Phase 1 Allotment
  {
    id: 'node_phase1_allotment',
    label: 'DC Phase 1 Seat Allotment',
    sublabel: 'Merit-Based Allotment Published',
    stage: 'phase1',
    clause: 'Clause 13 (Page 6)',
    description: 'Institutes publish the Phase 1 provisional allotment list based on available vacancy seat matrix and candidate merit.',
    category: 'decision'
  },
  // Stage 6A: Phase 1 Allotted -> Physical Reporting
  {
    id: 'node_phase1_reporting',
    label: 'Phase 1 Physical Verification & Reporting',
    sublabel: 'Document Check & Allotment Acceptance',
    stage: 'phase1',
    clause: 'Clause 15 (Page 8-9)',
    description: 'Physically report to the allotted institute with original documents: Domicile, Rank Card, Class 10/12 marksheets, Category Certificate, and Seat Acceptance Slip.',
    category: 'action'
  },
  // Stage 6B: Phase 1 Fresh Admission
  {
    id: 'node_phase1_admission',
    label: 'Phase 1 Fresh Admission Confirmed',
    sublabel: 'Replacement Quota: 0/1 Used (Intact!)',
    stage: 'phase1',
    clause: 'Clause 14 & Mandatory Ruling',
    description: 'Taking admission in DC Phase 1 is officially counted as a FRESH ADMISSION. Your single replacement quota is NOT consumed yet.',
    category: 'success'
  },
  // Stage 6C: Phase 1 No Allotment (Safe Holding)
  {
    id: 'node_phase1_no_allotment',
    label: 'Phase 1 Not Allotted (Safe Holding)',
    sublabel: 'Original CC Seat Remains Safe & Valid',
    stage: 'phase1',
    clause: 'Clause 14 (Page 7)',
    description: 'If you do not get allotted in Phase 1, you lose nothing. Your previously admitted seat continues safely without penalty.',
    category: 'safe'
  },
  // Stage 7: DC Phase 2 (Vacancy & Upgradation Round)
  {
    id: 'node_phase2_round',
    label: 'DC Phase 2 (Upgradation Round)',
    sublabel: 'Remaining Vacancy Re-Allotment',
    stage: 'phase2',
    clause: 'Clause 13 & 14 (Page 6-7)',
    description: 'Phase 2 is conducted for remaining vacancies. Admitted candidates can seek higher preference upgradation.',
    category: 'decision'
  },
  // Stage 8A: Phase 2 Upgraded -> Replacement Quota Consumed
  {
    id: 'node_phase2_upgraded',
    label: 'Phase 2 Seat Replaced & Upgraded',
    sublabel: 'Replacement Quota: 1/1 Consumed',
    stage: 'phase2',
    clause: 'Clause 14.2 & Mandatory Ruling',
    description: 'When you accept an upgraded seat in Phase 2, your earlier DC Phase 1 seat is replaced. Your replacement quota is now fully exhausted.',
    category: 'success'
  },
  // Stage 8B: Phase 2 Retain Confirmed Seat
  {
    id: 'node_phase2_retain',
    label: 'Phase 2 No Upgrade (Retain Current Seat)',
    sublabel: 'Final Admitted Seat Secure',
    stage: 'phase2',
    clause: 'Clause 14 (Page 7)',
    description: 'If Phase 2 does not yield a higher branch, you comfortably retain your Phase 1 (or CC) admitted seat.',
    category: 'safe'
  },
  // Stage 9: Fee Transfer & Refund
  {
    id: 'node_fee_refund',
    label: 'Fee Adjustment & Refund Process',
    sublabel: '₹5,000 SAF + College Tuition Refund',
    stage: 'refund',
    clause: 'Clause 18 (Page 11-12)',
    description: 'When switching institutions under WBJEEB rules, apply with the DC admission letter. Previous colleges must refund/adjust paid fees as per state guidelines.',
    category: 'financial'
  },
  // Stage 10: Final Outcome
  {
    id: 'node_final_outcome',
    label: 'Final Enrolled B.Tech Status 2026',
    sublabel: 'Official Admission Complete',
    stage: 'final',
    clause: 'Clause 19 (Page 13)',
    description: 'Academic session begins. Candidate is officially enrolled with registered university roll number.',
    category: 'final'
  }
];

export const FLOWCHART_EDGES = [
  { id: 'e1', source: 'node_start', target: 'node_eligibility_check', label: 'Verify Category' },
  { id: 'e2', source: 'node_eligibility_check', target: 'node_dc_registration', label: 'Eligible (Cat I-V)' },
  { id: 'e3_prot', source: 'node_dc_registration', target: 'node_seat_protection', label: 'If Admitted in CC' },
  { id: 'e3_fresh', source: 'node_dc_registration', target: 'node_merit_compilation', label: 'Fresh Candidate' },
  { id: 'e4', source: 'node_seat_protection', target: 'node_merit_compilation', label: 'Fill Choices' },
  { id: 'e5', source: 'node_merit_compilation', target: 'node_phase1_allotment', label: 'Publish Allotment' },
  { id: 'e6_allotted', source: 'node_phase1_allotment', target: 'node_phase1_reporting', label: 'Seat Allotted' },
  { id: 'e6_unallotted', source: 'node_phase1_allotment', target: 'node_phase1_no_allotment', label: 'No Allotment' },
  { id: 'e7_adm', source: 'node_phase1_reporting', target: 'node_phase1_admission', label: 'Docs Verified' },
  { id: 'e8_p2_from_adm', source: 'node_phase1_admission', target: 'node_phase2_round', label: 'Opt for Upgradation' },
  { id: 'e8_p2_from_safe', source: 'node_phase1_no_allotment', target: 'node_phase2_round', label: 'Try in Phase 2' },
  { id: 'e9_p2_upg', source: 'node_phase2_round', target: 'node_phase2_upgraded', label: 'Higher Choice Allotted' },
  { id: 'e9_p2_stay', source: 'node_phase2_round', target: 'node_phase2_retain', label: 'No Upgrade' },
  { id: 'e10_refund1', source: 'node_phase1_admission', target: 'node_fee_refund', label: 'Switching Colleges' },
  { id: 'e10_refund2', source: 'node_phase2_upgraded', target: 'node_fee_refund', label: 'Claim Fee Refund' },
  { id: 'e11_final_from_p1', source: 'node_phase1_admission', target: 'node_final_outcome', label: 'Lock Admission' },
  { id: 'e11_final_from_p2', source: 'node_phase2_upgraded', target: 'node_final_outcome', label: 'Final Enrolled' },
  { id: 'e11_final_from_retain', source: 'node_phase2_retain', target: 'node_final_outcome', label: 'Retain Seat' }
];

/**
 * Deterministic Simulation Engine: Calculates exact active path and personalized strategy
 */
export function simulateDcPath(c) {
  const isAdmitted = c.ccStatus === 'admitted';
  const isUnallotted = c.ccStatus === 'unallotted';
  const isAllottedNotAdmitted = c.ccStatus === 'allotted_unadmitted';
  const isUnregistered = c.ccStatus === 'unregistered';
  const wantsBothPhases = c.targetPhase === 'both';
  const wantsPhase1Only = c.targetPhase === 'phase1_only';
  const wantsPhase2Only = c.targetPhase === 'phase2_only';
  const isGmr = c.rankType === 'gmr';
  const isJee = c.rankType === 'jee_main';

  // Determine Category I to V
  let eligibleCategory = 'Category I (Admitted Candidate)';
  if (isAdmitted) eligibleCategory = 'Category I: Admitted via Centralised Counselling';
  else if (isAllottedNotAdmitted) eligibleCategory = 'Category II: Allotted in CC but Not Admitted';
  else if (isUnallotted) eligibleCategory = 'Category III: Registered in CC but Unallotted';
  else if (isUnregistered) eligibleCategory = 'Category IV: Not Registered / Did Not Participate in CC';
  else if (isJee) eligibleCategory = 'Category V: All-India / JEE Main Candidate';

  // Active Nodes computation
  const activeNodes = new Set(['node_start', 'node_eligibility_check', 'node_dc_registration']);
  const activeEdges = new Set(['e1', 'e2']);

  if (isAdmitted && c.retainSeat) {
    activeNodes.add('node_seat_protection');
    activeEdges.add('e3_prot');
    activeEdges.add('e4');
  } else {
    activeEdges.add('e3_fresh');
  }

  activeNodes.add('node_merit_compilation');
  activeNodes.add('node_phase1_allotment');
  activeEdges.add('e5');

  if (!wantsPhase2Only) {
    activeNodes.add('node_phase1_reporting');
    activeNodes.add('node_phase1_admission');
    activeEdges.add('e6_allotted');
    activeEdges.add('e7_adm');

    if (isAdmitted && c.currentCollegeFee > 0) {
      activeNodes.add('node_fee_refund');
      activeEdges.add('e10_refund1');
    }
  }

  if (wantsBothPhases || wantsPhase2Only) {
    activeNodes.add('node_phase2_round');
    if (!wantsPhase2Only) {
      activeEdges.add('e8_p2_from_adm');
    } else {
      activeNodes.add('node_phase1_no_allotment');
      activeEdges.add('e6_unallotted');
      activeEdges.add('e8_p2_from_safe');
    }

    activeNodes.add('node_phase2_upgraded');
    activeNodes.add('node_phase2_retain');
    activeEdges.add('e9_p2_upg');
    activeEdges.add('e9_p2_stay');

    if (isAdmitted || c.primaryGoal === 'upgrade_college') {
      activeNodes.add('node_fee_refund');
      activeEdges.add('e10_refund2');
    }
  }

  activeNodes.add('node_final_outcome');
  activeEdges.add('e11_final_from_p1');
  if (wantsBothPhases || wantsPhase2Only) {
    activeEdges.add('e11_final_from_p2');
    activeEdges.add('e11_final_from_retain');
  }

  // Quota & Safety
  const seatProtectionGuaranteed = isAdmitted && c.retainSeat;
  const replacementQuotaUsedInPhase1 = false; // By official mandatory ruling, Phase 1 is fresh admission!
  const replacementQuotaUsedInPhase2 = true;

  // Merit Priority Tier
  const meritPriorityTier = isGmr 
    ? 'Tier 1: WBJEE GMR (Highest Statutory Priority - Clause 9.1)' 
    : isJee 
    ? 'Tier 2: JEE Main CRL (Considered after GMR list - Clause 9.2)' 
    : 'Tier 3: Higher Secondary HMR (Considered after JEE Main - Clause 9.3)';

  // Fee Refund Estimations (Clause 18)
  const paidFee = Number(c.currentCollegeFee) || 0;
  const seatAcceptanceFee = isAdmitted ? 5000 : 0;
  const totalPaid = paidFee + seatAcceptanceFee;
  const estimatedDeduction = isAdmitted ? (c.currentCollegeType === 'govt' ? 1000 : 2000) : 0;
  const netRefundable = Math.max(0, totalPaid - estimatedDeduction);

  // Step-by-Step Action Plan
  const actionPlan = [
    {
      step: 1,
      title: 'Register on Target Institute Portals (Clause 6)',
      details: `Apply online with your ${c.rankType.toUpperCase()} rank card. Pay ₹250 per institute. ${seatProtectionGuaranteed ? 'DO NOT cancel or surrender your currently confirmed admission.' : 'Keep documents ready.'}`,
      clause: 'Clause 6 (Page 3)'
    },
    {
      step: 2,
      title: 'Choice Filling & Preference Locking',
      details: `List branches strictly in order of your genuine preference. In ${c.instType === 'govt_univ' ? 'State Universities (e.g. Jadavpur Univ / CU)' : 'Colleges'}, ${c.category} seats follow state reservation rosters.`,
      clause: 'Clause 8 (Page 4)'
    },
    {
      step: 3,
      title: 'DC Phase 1 Result & Physical Verification (Clause 13 & 15)',
      details: `If allotted in Phase 1, physically report within 48-72 hours. Your admission in DC Phase 1 is a FRESH ADMISSION — your replacement quota remains 100% UNUSED (0/1).`,
      clause: 'Clause 13 & 15 (Pages 6 & 8)'
    },
    {
      step: 4,
      title: 'DC Phase 2 Strategy & Upgradation',
      details: wantsBothPhases 
        ? `If you desire a higher branch, opt for Phase 2. If upgraded in Phase 2, your earlier seat is replaced and your replacement quota is consumed (1/1). If not upgraded, you safely keep your Phase 1 seat.`
        : `Lock your confirmed Phase 1 seat and complete university registration.`,
      clause: 'Clause 14.2 (Page 7)'
    },
    {
      step: 5,
      title: 'Claim Fee Refund from Previous College (Clause 18)',
      details: isAdmitted 
        ? `Submit your new DC Admission Slip + application to the previous college principal. Under state rules, paid tuition fees and the ₹5,000 SAF must be refunded/adjusted.`
        : `No prior fees to claim. Proceed with standard semester payment.`,
      clause: 'Clause 18 (Page 11)'
    }
  ];

  // Document Checklist
  const requiredDocuments = [
    { name: 'WBJEE 2026 / JEE Main 2026 Rank Card', required: true, note: 'Original + 3 self-attested copies' },
    { name: 'DC Online Registration & Choice Confirmation Slip', required: true, note: 'Showing ₹250 payment transaction ID' },
    { name: 'Class 10 Admit Card / Birth Certificate', required: true, note: 'For Date of Birth verification' },
    { name: 'Class 12 Marksheet & Pass Certificate', required: true, note: 'Minimum PCM 45% (40% for SC/ST/OBC)' },
    { 
      name: `West Bengal Domicile Certificate (${c.domicile === 'wb_domicile' ? 'Form a1/a2/b' : 'Not Required for Open Seats'})`, 
      required: c.domicile === 'wb_domicile' || c.category !== 'GEN', 
      note: 'Issued by BDO/SDO/DM/Headmaster as per WBJEE Proforma' 
    },
    { 
      name: `Category Certificate (${c.category})`, 
      required: c.category !== 'GEN', 
      note: 'Must be issued by competent West Bengal state authority with active validity' 
    },
    { 
      name: 'Existing College Admission Receipt & Retention Slip', 
      required: isAdmitted, 
      note: 'Proves current valid admission under Clause 14 protection' 
    }
  ];

  // Critical Warnings
  const criticalWarnings = [
    {
      level: 'critical',
      title: 'NEVER Cancel Existing Seat Before DC Allotment',
      description: 'Clause 14 explicitly protects your current admission. Cancelling prematurely will leave you completely without a seat if DC cutoffs rise.'
    },
    {
      level: 'important',
      title: 'Replacement Quota Rules',
      description: 'DC Phase 1 admission is a Fresh Admission (Quota 0/1). Only accepting a re-allotment in DC Phase 2 exhausts your single replacement quota (Quota 1/1).'
    },
    {
      level: 'note',
      title: 'Physical Reporting Mandatory',
      description: 'Allotments in DC are strictly provisional. Failure to report physically during the institutional window leads to immediate forfeiture.'
    }
  ];

  // 3 Scenario Projections
  const scenarioOutcomes = [
    {
      type: 'best_case',
      title: 'Best Case: Allotted Desired Branch in DC Phase 1',
      outcome: 'You secure your top preference branch/college. Take fresh admission in Phase 1 without consuming replacement quota. Previous fees are refunded.',
      safetyScore: '100% Safe (Original seat protected until verified admission)'
    },
    {
      type: 'upgraded_case',
      title: 'Upgraded Case: Upgraded in DC Phase 2',
      outcome: 'You take Phase 1 seat, opt for Phase 2 upgradation, and secure a higher branch. Replacement quota becomes 1/1. You reach your dream branch.',
      safetyScore: '100% Guaranteed (No seat loss risk)'
    },
    {
      type: 'fallback_case',
      title: 'Fallback Safe Case: No DC Allotment',
      outcome: isAdmitted 
        ? 'Cutoffs do not reach your rank in DC. You comfortably retain your Centralised Counselling seat with zero academic or financial loss.'
        : 'You do not receive an allotment. Consider private college management quota or next counselling cycle.',
      safetyScore: isAdmitted ? '100% Protected under Clause 14' : 'No prior seat at risk'
    }
  ];

  return {
    activeNodes: Array.from(activeNodes),
    activeEdges: Array.from(activeEdges),
    eligibleCategory,
    seatProtectionGuaranteed,
    replacementQuotaUsedInPhase1,
    replacementQuotaUsedInPhase2,
    meritPriorityTier,
    totalPaid,
    estimatedDeduction,
    netRefundable,
    actionPlan,
    requiredDocuments,
    criticalWarnings,
    scenarioOutcomes
  };
}
