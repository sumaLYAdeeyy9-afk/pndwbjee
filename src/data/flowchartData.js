// Official Decision Tree Model and Logic Engine for WBJEE 2026 Centralised & Decentralised Counselling
// Derived from Official Notification No. WBE/C-02/26 (14 Pages) & State Guidelines

export const DC_PRESETS = [
  {
    id: 'admitted_govt_aiming_ju',
    label: 'Admitted in CC, Aiming for Better College in DC',
    description: 'Holding a confirmed CC seat and exploring DC Phase 1 & 2 without losing current seat.',
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

export const FLOWCHART_TREE_NODES = {
  // Level 1: Start
  node_start_phase1: {
    id: 'node_start_phase1',
    label: 'Start Phase 1 (Choices)',
    sublabel: 'Choice Locking & Preference Submission',
    type: 'root',
    clause: 'Clause 6 (Page 3)',
    description: 'Candidate submits choice preference list and registers on the counselling portal.',
    guidance: 'List preferred branches and colleges strictly in order of priority.'
  },
  // Level 2: Allotment Round 1 Decision
  node_round1_decision: {
    id: 'node_round1_decision',
    label: 'Phase 1 Round 1 Allotment',
    type: 'decision_diamond',
    clause: 'Clause 13.1 (Page 6)',
    description: 'System processes submitted choices against rank and category seat matrix.',
    guidance: 'Check allotment result on candidate portal.'
  },
  // Level 3A: No Seat Allotted
  node_no_seat_allotted: {
    id: 'node_no_seat_allotted',
    label: 'No Seat Allotted',
    sublabel: 'Ranks higher than cutoff',
    type: 'action_box',
    clause: 'Clause 13.1 (Page 6)',
    description: 'Candidate rank did not meet cutoff for any submitted choice in Round 1.',
    guidance: 'Candidate automatically moves to Round 2 without any penalty or action required.'
  },
  // Level 3B: Seat Allotted
  node_seat_allotted: {
    id: 'node_seat_allotted',
    label: 'Seat Allotted',
    sublabel: 'Provisional Seat Allotment Letter Generated',
    type: 'action_box',
    clause: 'Clause 13.1 (Page 6)',
    description: 'Candidate allotted a provisional seat based on merit and category.',
    guidance: 'Must choose between paying SAF and reporting, or forfeiting.'
  },
  // Level 4A: Pay SAF & Skip Verification (Penalty)
  node_penalty_debarred: {
    id: 'node_penalty_debarred',
    label: 'Permanently Debarred (Clause 17.5 Penalty)',
    sublabel: 'Seat Cancelled + Barred from Subsequent Rounds',
    type: 'penalty_pill',
    clause: 'Clause 17.5 (Page 10)',
    description: 'Paying Seat Acceptance Fee (SAF) but failing to physically report for document verification results in immediate cancellation and debarment.',
    guidance: 'Never skip physical reporting if you pay SAF.'
  },
  // Level 4B: Ignore Portal (Penalty)
  node_penalty_ignored: {
    id: 'node_penalty_ignored',
    label: 'Ignore Portal (Non-Response)',
    sublabel: 'Allotment Forfeited',
    type: 'penalty_pill',
    clause: 'Clause 17.3 (Page 10)',
    description: 'Failing to take any action within the deadline leads to automatic cancellation of the allotted seat.',
    guidance: 'Take action before deadline expires.'
  },
  // Level 4C: Pay SAF & Complete Verification
  node_pay_saf_verified: {
    id: 'node_pay_saf_verified',
    label: 'Pay SAF & Complete Verification',
    sublabel: '₹5,000 SAF Paid + Physical Verification Passed',
    type: 'action_box',
    clause: 'Clause 15 (Page 8)',
    description: 'Paid ₹5,000 Seat Acceptance Fee and successfully verified original documents at Reporting Centre.',
    guidance: 'Candidate now holds a confirmed valid provisional seat.'
  },
  // Level 5: Round 2 Auto-Upgradation Decision
  node_round2_decision: {
    id: 'node_round2_decision',
    label: 'Phase 1 Round 2 (Auto-Upgradation)',
    type: 'decision_diamond',
    clause: 'Clause 13.2 (Page 6)',
    description: 'System automatically checks for higher preference vacancies in Round 2.',
    guidance: 'If upgraded, earlier seat is cancelled. If not upgraded, earlier seat is preserved.'
  },
  // Level 6: Centralised Counselling Outcome / DC Transition
  node_start_phase2_dc: {
    id: 'node_start_phase2_dc',
    label: 'Start Phase 2 / Decentralised Counselling (DC)',
    sublabel: 'Institutional Level Vacancy Rounds',
    type: 'section_header',
    clause: 'Clause 5 & 14 (Page 2, 7)',
    description: 'Decentralised Counselling conducted directly by universities and colleges for remaining vacant seats.',
    guidance: 'Eligible for both admitted candidates (holding CC seat) and fresh candidates.'
  },
  // Level 7: Seat Protection Guarantee
  node_seat_protection_guarantee: {
    id: 'node_seat_protection_guarantee',
    label: 'Seat Protection Guarantee (Clause 14)',
    sublabel: 'Original CC Admission 100% Protected & Safe',
    type: 'protection_box',
    clause: 'Clause 14 (Page 7)',
    description: 'Admitted candidates do NOT need to surrender their seat to participate in DC. Your seat remains 100% safe.',
    guidance: 'Never surrender your current seat prior to securing verified DC admission.'
  },
  // Level 8: DC Online Registration
  node_dc_portal_registration: {
    id: 'node_dc_portal_registration',
    label: 'DC Portal Registration & Fee',
    sublabel: '₹250 Application Fee per Institute Portal',
    type: 'action_box',
    clause: 'Clause 6 (Page 3)',
    description: 'Candidate applies online on individual institute portals (e.g. JU, KGEC, JGEC, CU) with rank card.',
    guidance: 'Pay ₹250 per institute. Apply to multiple institutes to maximize chances.'
  },
  // Level 9: Merit Priority Hierarchy
  node_dc_merit_hierarchy: {
    id: 'node_dc_merit_hierarchy',
    label: 'Merit Priority Hierarchy (Clause 9)',
    sublabel: 'GMR (Tier 1) > JEE Main (Tier 2) > HMR (Tier 3)',
    type: 'action_box',
    clause: 'Clause 9 (Page 4)',
    description: 'Institutes prepare merit lists prioritizing WBJEE GMR candidates first, followed by JEE Main and 10+2 HMR.',
    guidance: 'GMR candidates get statutory first right of admission on vacant seats.'
  },
  // Level 10: DC Phase 1 Allotment Decision
  node_dc_phase1_decision: {
    id: 'node_dc_phase1_decision',
    label: 'DC Phase 1 Seat Allotment',
    type: 'decision_diamond',
    clause: 'Clause 13 (Page 6)',
    description: 'Institute publishes Phase 1 merit allotment list.',
    guidance: 'If allotted, report immediately with original documents.'
  },
  // Level 11A: DC Phase 1 Fresh Admission
  node_dc_phase1_admission: {
    id: 'node_dc_phase1_admission',
    label: 'DC Phase 1 Fresh Admission',
    sublabel: 'Replacement Quota: 0/1 Used (Quota Intact!)',
    type: 'success_box',
    clause: 'Clause 14 & Mandatory Ruling',
    description: 'Taking admission in DC Phase 1 is a FRESH ADMISSION. Your replacement quota is NOT exhausted.',
    guidance: 'You still have your 1 replacement quota available for Phase 2.'
  },
  // Level 11B: DC Phase 1 No Allotment (Safe Holding)
  node_dc_phase1_safe_retain: {
    id: 'node_dc_phase1_safe_retain',
    label: 'No DC Phase 1 Allotment (Safe Holding)',
    sublabel: 'Current CC Seat Remains 100% Intact',
    type: 'safe_box',
    clause: 'Clause 14 (Page 7)',
    description: 'Candidate did not get allotted in DC Phase 1. Previous CC admission continues uninterrupted without risk.',
    guidance: 'You can still participate in DC Phase 2.'
  },
  // Level 12: DC Phase 2 Upgradation Decision
  node_dc_phase2_decision: {
    id: 'node_dc_phase2_decision',
    label: 'DC Phase 2 (Vacancy & Upgradation Round)',
    type: 'decision_diamond',
    clause: 'Clause 13.2 & 14.2 (Page 6, 7)',
    description: 'Conducted for remaining institute vacancies.',
    guidance: 'Admitted candidates can upgrade to a higher preference branch.'
  },
  // Level 13A: DC Phase 2 Upgraded
  node_dc_phase2_upgraded: {
    id: 'node_dc_phase2_upgraded',
    label: 'DC Phase 2 Seat Replaced & Upgraded',
    sublabel: 'Replacement Quota: 1/1 Consumed (Exhausted)',
    type: 'success_box',
    clause: 'Clause 14.2 & Mandatory Ruling',
    description: 'Candidate upgrades to higher branch in Phase 2. The earlier DC Phase 1 seat is replaced, consuming replacement quota.',
    guidance: 'Lock your upgraded seat and complete registration.'
  },
  // Level 13B: DC Phase 2 Retain
  node_dc_phase2_retain: {
    id: 'node_dc_phase2_retain',
    label: 'DC Phase 2 Retain Confirmed Seat',
    sublabel: 'Final Admitted Branch Secure',
    type: 'safe_box',
    clause: 'Clause 14 (Page 7)',
    description: 'No higher upgrade in Phase 2. Candidate retains their confirmed Phase 1 (or CC) seat securely.',
    guidance: 'Your confirmed seat is fully secured.'
  },
  // Level 14: Fee Refund (Clause 18)
  node_fee_refund_clause18: {
    id: 'node_fee_refund_clause18',
    label: 'Fee Refund Policy (Clause 18)',
    sublabel: '₹5,000 SAF + Tuition Fees Refund Process',
    type: 'financial_box',
    clause: 'Clause 18 (Page 11)',
    description: 'When switching institutions under WBJEEB DC rules, submit DC admission proof to previous college for fee refund/adjustment.',
    guidance: 'Previous college must refund tuition fee and ₹5,000 SAF minus permissible processing fee.'
  },
  // Level 15: Final Enrolled State
  node_final_enrolled_state: {
    id: 'node_final_enrolled_state',
    label: 'Final Enrolled B.Tech Status 2026',
    sublabel: 'Official Admission Complete',
    type: 'final_box',
    clause: 'Clause 19 (Page 13)',
    description: 'Academic session begins. Candidate is officially enrolled with registered university roll number.',
    guidance: 'Welcome to your B.Tech 2026 program!'
  }
};

/**
 * Deterministic Simulation Engine: Maps candidate constraints to active nodes & generates strategy
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
  let eligibleCategory = 'Category I: Admitted via Centralised Counselling';
  if (isAdmitted) eligibleCategory = 'Category I: Admitted via Centralised Counselling';
  else if (isAllottedNotAdmitted) eligibleCategory = 'Category II: Allotted in CC but Not Admitted';
  else if (isUnallotted) eligibleCategory = 'Category III: Registered in CC but Unallotted';
  else if (isUnregistered) eligibleCategory = 'Category IV: Not Registered / Did Not Participate in CC';
  else if (isJee) eligibleCategory = 'Category V: All-India / JEE Main Candidate';

  // Active Nodes on Flowchart
  const activeNodes = new Set(['node_start_phase1', 'node_round1_decision']);

  if (isAdmitted) {
    activeNodes.add('node_seat_allotted');
    activeNodes.add('node_pay_saf_verified');
    activeNodes.add('node_round2_decision');
    activeNodes.add('node_start_phase2_dc');
    if (c.retainSeat) {
      activeNodes.add('node_seat_protection_guarantee');
    }
  } else if (isAllottedNotAdmitted) {
    activeNodes.add('node_seat_allotted');
    activeNodes.add('node_penalty_ignored');
    activeNodes.add('node_start_phase2_dc');
  } else if (isUnallotted) {
    activeNodes.add('node_no_seat_allotted');
    activeNodes.add('node_round2_decision');
    activeNodes.add('node_start_phase2_dc');
  } else {
    activeNodes.add('node_start_phase2_dc');
  }

  activeNodes.add('node_dc_portal_registration');
  activeNodes.add('node_dc_merit_hierarchy');
  activeNodes.add('node_dc_phase1_decision');

  if (!wantsPhase2Only) {
    activeNodes.add('node_dc_phase1_admission');
    if (isAdmitted && c.currentCollegeFee > 0) {
      activeNodes.add('node_fee_refund_clause18');
    }
  }

  if (wantsBothPhases || wantsPhase2Only) {
    activeNodes.add('node_dc_phase2_decision');
    activeNodes.add('node_dc_phase2_upgraded');
    activeNodes.add('node_dc_phase2_retain');
    if (isAdmitted || c.primaryGoal === 'upgrade_college') {
      activeNodes.add('node_fee_refund_clause18');
    }
  }

  activeNodes.add('node_final_enrolled_state');

  // Quota & Safety
  const seatProtectionGuaranteed = isAdmitted && c.retainSeat;
  const replacementQuotaUsedInPhase1 = false;
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
