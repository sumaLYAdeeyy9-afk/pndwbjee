// WBJEE Grievance Email Targets & Dynamic Multi-Variant Draft Generator (200+ Unique Permutations)

export const PRIMARY_TO_RECIPIENTS = [
  'info@wbjeeb.in'
];

export const CC_RECIPIENTS = [
  'dtewbgovt@gmail.com',
  'techedndirectoratewb@gmail.com',
  'highereducationwb@gmail.com',
  'dpihedn@gmail.com',
  'jdpidd1@gmail.com',
  'adhikarisuvenduwb1@gmail.com'
];

export const OFFICIAL_RECIPIENTS = [
  {
    id: 'wbjeeb_official',
    name: 'WBJEEB Official Desk',
    email: 'info@wbjeeb.in',
    designation: 'West Bengal Joint Entrance Examinations Board',
    category: 'TO'
  },
  {
    id: 'dte_wb_govt',
    name: 'Directorate of Technical Education (DTE)',
    email: 'dtewbgovt@gmail.com',
    designation: 'Directorate of Technical Education, Bikash Bhavan 10th Floor',
    category: 'CC'
  },
  {
    id: 'tech_edn_dir',
    name: 'Technical Education Directorate WB',
    email: 'techedndirectoratewb@gmail.com',
    designation: 'Technical Education Wing, Govt of WB',
    category: 'CC'
  },
  {
    id: 'higher_edu_gen',
    name: 'Higher Education Dept (General)',
    email: 'highereducationwb@gmail.com',
    designation: 'Department of Higher Education, Govt of WB',
    category: 'CC'
  },
  {
    id: 'dpi_hedn',
    name: 'Director of Public Instruction (DPI)',
    email: 'dpihedn@gmail.com',
    designation: 'Directorate of Public Instruction, Bikash Bhavan',
    category: 'CC'
  },
  {
    id: 'jdpi_hedn',
    name: 'Joint Director of Public Instruction',
    email: 'jdpidd1@gmail.com',
    designation: 'Joint DPI, Higher Education Dept',
    category: 'CC'
  },
  {
    id: 'suvendu_adhikari',
    name: 'Hon’ble Chief Minister Shri Suvendu Adhikari',
    email: 'adhikarisuvenduwb1@gmail.com',
    designation: "Chief Minister's Secretariat / Office, Govt of West Bengal",
    category: 'CC'
  }
];

// 25+ Base Subject Line Variants with diverse formal tones
const SUBJECT_VARIANTS = [
  "DEMAND FOR OFFLINE DECENTRALIZED COUNSELING: Representation against Online DC, Category Injustice & Fee Refund Clarification (WBJEE 2026)",
  "URGENT: Formal Representation to Scrap Online DC, Restore In-Person Spot Rounds & Confirm Fee Refund Policy - WBJEE 2026",
  "Representation on WBJEE 2026 Decentralized Counseling: Demand for Offline Campus Counseling, Category Restoration & Fee Refund Protection",
  "URGENT PETITION: Demand for Offline Decentralized Counseling as per Historical Precedent & Inter-College Fee Refund (WBJEE 2026)",
  "Grievance & Appeal: Demand to Scrap Experimental Online DC, Allow Offline Spot Rounds & Clarify Fee Refund - WBJEE 2026 Aspirant",
  "Subject: Respect Historical Precedent — Conduct Decentralized Counseling OFFLINE at Institute Campuses (WBJEE 2026)",
  "Submission of Bonafide Aspirant: Demands regarding WBJEE 2026 Decentralized Counseling (Offline Mode, Category Re-option, Fee Refund Rules)",
  "Urgent Representation to WBJEEB & DTE: Preserve Campus Spot Counseling, Re-opt Categories & Ensure College Change Fee Refund (WBJEE 2026)",
  "Candidate Appeal: Demand for In-Person Offline Spot Admission, Category Restoration & Guaranteed Fee Refund on College Switch (WBJEE 2026)",
  "Representation against Experimental Centralized Online DC: Demand for Conventional Offline Campus Counseling - WBJEE 2026",
  "URGENT INTERVENTION REQUESTED: Demand for Offline Decentralized Counseling and Mandatory Fee Refund on College Switch (WBJEE 2026)",
  "Mass Aspirants Representation: Request for Direct Offline Spot Counseling at Institute Campuses & Fee Refund Certainty (WBJEE 2026)",
  "Formal Appeal to Chairman WBJEEB & DTE: Demand for In-Person Spot Counseling and Protection of Student Rights (WBJEE 2026)",
  "WBJEE 2026 Candidate Grievance: Scrap Online DC, Allow Offline Spot Rounds & Ensure Inter-College Fee Refund Policy",
  "Urgent Representation: Modalities of WBJEE 2026 Decentralized Counseling - Demand for Offline Spot Rounds & Category Correction",
  "Petition on Behalf of WBJEE 2026 Aspirants: Offline Campus Counseling, Category Restoration, and Fee Refund Protection",
  "CRITICAL APPEAL: Stop Centralizing Decentralized Counseling - Conduct Offline Spot Rounds & Protect Student Career Rights (WBJEE 2026)",
  "Representation: Demand for Offline Decentralized Counseling, Category Correction for Delayed Certificates & Fee Refund Enforceability",
  "URGENT: Demand for Immediate Notification on Offline Decentralized Counseling and Fee Refund Mechanism for WBJEE 2026 Candidates",
  "Formal Aspirant Grievance: Conduct Offline Spot Counseling at Respective Colleges (JU/CU/KGEC/JGEC) and Clarify Fee Refund Policy",
  "WBJEE 2026 Representation: Immediate Need to Scrap Online DC, Implement Campus Spot Rounds & Enforce Fee Refund Guidelines",
  "Appeal for Justice in WBJEE 2026: Demand for Offline Spot Admission, Preservation of Merit & Inter-Institutional Fee Refund",
  "Statutory Representation: Rejection of Online DC Portal, Demand for Physical Campus Counseling & Category Re-option (WBJEE 2026)",
  "Urgent Grievance regarding WBJEE 2026 Decentralized Counseling: Demand for In-Person College Rounds & Clarification on Fee Refund Policy",
  "Aspirant Appeal: Scrap Flawed Online Decentralized Counseling, Restore Offline Campus Precedent & Protect Fee Refunds"
];

// Salutation / Address Variations
const SALUTATION_VARIANTS = [
  `To,
The Chairman / Competent Authority,
West Bengal Joint Entrance Examinations Board (WBJEEB),
RUPANNA, DB-118, Sector-I, Salt Lake City, Kolkata - 700064.

Copy forwarded for urgent perusal and immediate administrative intervention to:
1. Directorate of Technical Education (DTE), Bikash Bhavan (dtewbgovt@gmail.com)
2. Department of Higher Education, Govt. of West Bengal (highereducationwb@gmail.com)
3. Hon'ble Chief Minister Shri Suvendu Adhikari (adhikarisuvenduwb1@gmail.com)`,

  `To,
The Chairman, West Bengal Joint Entrance Examinations Board (WBJEEB),
Kolkata - 700064.

Copy submitted with highest priority to:
- Director of Technical Education (DTE), Govt. of West Bengal (dtewbgovt@gmail.com)
- Higher Education Department, Govt. of West Bengal (highereducationwb@gmail.com)
- Office of the Hon'ble Chief Minister Shri Suvendu Adhikari (adhikarisuvenduwb1@gmail.com)`,

  `To,
The Competent Statutory Authorities,
West Bengal Joint Entrance Examinations Board (WBJEEB), Salt Lake, Kolkata.

In Copy To:
1. Directorate of Technical Education (DTE), Bikash Bhavan, Kolkata
2. Department of Higher Education, Government of West Bengal
3. Hon'ble Chief Minister Shri Suvendu Adhikari`
];

// Opening Premise Variations
const OPENING_VARIANTS = [
  `Respected Authorities,

I am writing this formal representation as a bonafide candidate of WBJEE 2026 to register my strong protest, anguish, and collective demand regarding the proposed Decentralized Counseling (DC) modality for the 2026 academic session.`,

  `Respected Sir/Madam,

As an aggrieved aspirant of WBJEE 2026, I submit this formal petition to convey the deep distress of the student community regarding the proposed centralized online framework for Decentralized Counseling and to demand the immediate restoration of conventional offline spot admissions.`,

  `Respected Statutory Authorities,

I place on record this formal representation on behalf of thousands of WBJEE 2026 candidates, urging your immediate intervention to scrap the proposed Online Decentralized Counseling portal and conduct counseling strictly in offline mode at respective institute campuses.`,

  `Hon'ble Authorities,

I am addressing this official representation as a dedicated candidate of WBJEE 2026, highlighting severe concerns over the proposed centralization of Decentralized Counseling and seeking binding directives for offline campus spot admissions along with urgent fee refund clarifications.`
];

// Ground 1: Decentralized Concept & Historical Precedent Variations
const GROUND_1_VARIANTS = [
  `1. Contradiction of the "Decentralized" Concept & Historical Convention:
By definition, "Decentralized Counseling" must not and cannot be conducted through a centralized online portal. Historically and consistently across previous academic years, Decentralized / Spot Counseling in West Bengal has ALWAYS been conducted OFFLINE directly at the respective university and college campuses (including Jadavpur University, Calcutta University, KGEC, JGEC, MAKAUT in-house, and other government/private institutes). Attempting to centralize a decentralized process breaks time-tested administrative precedent.`,

  `1. Violation of the Core Principle of Decentralization:
If a counseling process is titled "Decentralized", it is an inherent contradiction to administer it centrally online. Over past decades, Decentralized Spot rounds in West Bengal have always taken place in physical offline mode directly within individual university and college premises (such as JU, CU, KGEC, JGEC, and government engineering colleges). Deviating from this established convention deprives colleges of their autonomy and harms candidates.`,

  `1. Preservation of Time-Tested Offline Campus Precedent:
The essence of Decentralized Counseling is local institute-level autonomy. Historical convention in West Bengal dictates that individual engineering institutes and universities independently conduct offline spot rounds on their own campuses. Forcing an online centralized system contradicts established administrative practice and must be abandoned immediately.`
];

// Ground 2: Refusal to be Experimental Batch
const GROUND_2_VARIANTS = [
  `2. WBJEE 2026 Students Refuse to be an "Experimental Batch":
WBJEE 2026 candidates have already suffered immense mental trauma, seat anomalies, and academic loss due to experimental changes introduced during the centralized rounds. Forcing another untested online system for decentralized admissions will only compound the crisis. We firmly demand an end to experimental policies on our careers.`,

  `2. Students Cannot Bear the Cost of Bureaucratic Experiments:
The 2026 batch of WBJEE candidates has already weathered unprecedented turbulence, cutoff compression, and procedural flaws during the centralized online phases. Imposing yet another untested digital layer for decentralized rounds will jeopardize our academic futures. We categorically refuse to be treated as an experimental cohort.`,

  `2. Rejection of Flawed and Untested Online Experiments:
Having already experienced severe anxiety and administrative glitches during centralized rounds, WBJEE 2026 aspirants cannot be subjected to further experimental online procedures during decentralized counseling. Conventional, proven offline methods must be preserved.`
];

// Ground 3: Inherent Flaws of Online DC
const GROUND_3_VARIANTS = [
  `3. Fatal Inherent Flaws of Online Decentralized Counseling:
a) Multiple Allotments & Rampant Seat Blocking: An online portal permits candidates to virtually hold allotments across multiple colleges without physical commitment, keeping real cutoffs artificially elevated and causing massive final vacancies.
b) Fresh Registration in Each Round: Permitting continuous fresh registrations dilutes merit, distorts cutoffs, and destabilizes genuine rank holders who participated diligently from Round 1.
c) Absence of Real "Yes-Upgradation": Online procedures leave admitted students without a transparent, dynamic upgrade path, trapping high-rankers in sub-optimal branches while top government seats remain vacant.`,

  `3. Structural Defects in Online Centralized DC:
- Multiple Virtual Allotments: Students hold seats across multiple institutions online without physical reporting, creating artificial seat hoarding and locking out deserving lower-rank candidates.
- Unchecked Fresh Registrations: Introducing fresh applicants at every stage destabilizes the merit ladder and penalizes dedicated candidates.
- Failure of Dynamic Upgradation: Online algorithms fail to execute instantaneous intra-college and inter-college seat shifts, leaving premier engineering seats permanently unoccupied.`,

  `3. Severe Operational Failures of Online DC Systems:
1) Massive seat blocking due to multi-college allotments without on-spot verification.
2) Merit dilution caused by repeated fresh registration windows.
3) Inability to provide instant, real-time upgradation for already admitted candidates.`
];

// Ground 4: Efficacy of Offline Spot Counseling
const GROUND_4_VARIANTS = [
  `4. The Proven Efficacy of Offline On-Campus Spot Counseling:
Offline spot counseling held at institute premises ensures 100% genuine physical attendance, immediate merit-based GMR verification, and zero ghost vacancies. When an admitted student upgrades on the spot, their vacated seat is immediately allotted to the next waiting candidate in the hall in real time, ensuring complete fairness and total seat utilization.`,

  `4. Maximum Transparency Through In-Person Campus Counseling:
Physical counseling at university/college campuses guarantees that only genuinely interested students attend in person. As upgrades happen in real-time inside the counseling hall, vacated seats are filled immediately by next eligible rank holders, resulting in zero seat wastage and complete transparency.`,

  `4. Guaranteed 100% Seat Utilization via Physical Spot Rounds:
In-person campus counseling eliminates ghost candidates. Every seat vacancy created by a spot upgrade is instantaneously offered to the next candidate present, ensuring no engineering seat in West Bengal goes wasted.`
];

// Ground 5: SC/ST/OBC/EWS Category Restoration
const GROUND_5_VARIANTS = [
  `5. Urgent Request for SC/ST/OBC/EWS Category Restoration in Decentralized Counseling:
We earnestly request permission for eligible SC/ST/OBC/EWS candidates, whose category was changed to General due to non-submission of certificates during Centralized Counseling, to opt for their correct category at the time of registration for Decentralized Counseling. Bonafide candidates were unable to submit category certificates earlier solely because certificates had not been issued by the competent authority within the stipulated timeline owing to procedural/administrative delays entirely beyond students' control. They must now be allowed to participate under their rightful category upon presenting valid certificates.`,

  `5. Restoration of Rightful Reserved Category Status (SC/ST/OBC/EWS):
A large number of reserved category aspirants were converted to General during centralized counseling due to procedural delays in certificate issuance by competent government authorities—delays entirely outside the students' control. We urge that all such bonafide candidates be permitted to restore and select their rightful category (SC/ST/OBC-A/OBC-B/EWS) during Decentralized Counseling upon production of newly issued valid certificates.`,

  `5. Category Re-option for Deserving SC/ST/OBC/EWS Candidates:
Procedural bottlenecks in administrative certificate issuance should not permanently deprive meritorious students of their statutory reservation rights. Candidates whose categories were converted to General must be granted the opportunity to claim their original category during decentralized counseling.`
];

// Ground 6: Fee Refund Policy Clarification (NEW POINT)
const GROUND_6_VARIANTS = [
  `6. Urgent Clarification on the Fee Refund Policy on College Change:
A previous government notification explicitly stated that if a student's allotted college changes during the counselling process, the fees paid to the former institution would be refunded upon taking admission to the newly allotted college. We urgently seek confirmation from the Board and Higher Education Department regarding whether this exact fee refund policy remains valid and enforceable for institution changes made through this upcoming decentralized counselling as well, ensuring students and middle-class parents do not suffer double financial burden.`,

  `6. Mandatory Confirmation & Enforceability of Inter-College Fee Refund:
In accordance with prior government orders, any student who migrates to a different college/university during counseling is entitled to a full refund of tuition and admission fees deposited at the previous institution. We demand explicit clarification and formal notification confirming that this exact fee refund protection applies unconditionally to all college changes made during the upcoming Decentralized Counseling.`,

  `6. Protection of Student Fees upon Institutional Migration:
Clear directives must be issued reaffirming the government notification on fee refunds: when a student secures admission in a newly allotted institution during decentralized spot rounds, the fees paid to the former institution must be refunded promptly to prevent severe financial distress for families.`
];

// Prayers Variations
const PRAYERS_VARIANTS = [
  `PRAYERS & IMMEDIATE DEMANDS:
In the interest of justice, merit, and thousands of engineering aspirants of West Bengal, we demand:
1. Immediate scrapping of any proposed centralized Online Decentralized Counseling portal.
2. Directives empowering universities and engineering colleges to independently conduct OFFLINE Decentralized / Spot Counseling on their respective campuses.
3. Full and unconditional eligibility for ALL WBJEE 2026 candidates (admitted and non-admitted) to participate in offline spot counseling for branch and institute upgrades.
4. Permission for eligible SC/ST/OBC/EWS candidates, whose category was converted to General due to administrative certificate delays, to opt for and claim their correct category during Decentralized Counseling.
5. Formal notification confirming that the fee refund policy on institution change remains fully valid and binding for Decentralized Counseling admissions.`,

  `OUR PRAYERS & RELIEFS SOUGHT:
We respectfully pray for the following immediate administrative actions:
1. Complete withdrawal of the centralized online DC scheme in favor of traditional offline spot counseling.
2. Authorization for individual institutions (JU, CU, KGEC, JGEC, etc.) to publish notifications and conduct in-person campus counseling based on GMR merit.
3. Equal opportunity for all registered WBJEE 2026 rank holders to participate in spot rounds without restrictive barriers.
4. Enabling SC/ST/OBC/EWS candidates to present their issued certificates and reclaim their rightful category for decentralized rounds.
5. Strict enforcement of the Fee Refund order ensuring seamless return of previously paid fees upon taking admission into a new college.`,

  `COLLECTIVE ASPIRANTS' PRAYERS:
1. Scrap the Online DC portal and restore 100% Offline Decentralized Spot Counseling at institute campuses.
2. Preserve college autonomy to conduct transparent, spot-allotment counseling sessions.
3. Permit category re-selection for SC/ST/OBC/EWS candidates affected by earlier administrative certificate delays.
4. Guarantee and notify the validity of inter-institutional fee refunds for candidates upgrading colleges in Decentralized Counseling.
5. Immediate publication of clear spot counseling schedules to save the academic year.`
];

// Sign-off Variations
const SIGNOFF_VARIANTS = [
  (name, roll, gmr, contact) => {
    const lines = [
      `We earnestly appeal for your prompt administrative intervention to uphold justice and convention.`,
      ``,
      `Yours faithfully,`,
      `${name}`,
      `WBJEE 2026 Aspirant`,
      `Roll Number: ${roll}`
    ];
    if (gmr) lines.push(`WBJEE GMR: ${gmr}`);
    if (contact) lines.push(`Contact: ${contact}`);
    return lines.join('\n');
  },
  (name, roll, gmr, contact) => {
    const lines = [
      `Hoping for your empathetic and immediate decision in the best interest of students.`,
      ``,
      `Sincerely,`,
      `${name}`,
      `Candidate, WBJEE 2026 Examination`,
      `WBJEE Roll No: ${roll}`
    ];
    if (gmr) lines.push(`GMR / Rank: ${gmr}`);
    if (contact) lines.push(`Registered Contact: ${contact}`);
    return lines.join('\n');
  },
  (name, roll, gmr, contact) => {
    const lines = [
      `Thanking you in anticipation of urgent corrective action.`,
      ``,
      `With regards,`,
      `${name}`,
      `WBJEE 2026 Candidate`,
      `Roll No: ${roll}`
    ];
    if (gmr) lines.push(`General Merit Rank (GMR): ${gmr}`);
    if (contact) lines.push(`Phone / Email: ${contact}`);
    return lines.join('\n');
  }
];

export const TOTAL_PRESET_VARIATIONS = 200;

export const EMAIL_SUBJECT = SUBJECT_VARIANTS[0];

/**
 * Deterministically or pseudo-randomly generates a unique subject and body draft
 * based on the provided candidate credentials and variation seed (1 to 200+).
 */
export function generateUniqueEmail({
  studentName = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = '',
  seed = 1
} = {}) {
  const normSeed = Math.abs(parseInt(seed, 10) || 1);

  // Derive variation indices
  const subjectIdx = (normSeed - 1) % SUBJECT_VARIANTS.length;
  const salutationIdx = (normSeed * 3) % SALUTATION_VARIANTS.length;
  const openingIdx = (normSeed * 7) % OPENING_VARIANTS.length;
  const ground1Idx = (normSeed * 2) % GROUND_1_VARIANTS.length;
  const ground2Idx = (normSeed * 5) % GROUND_2_VARIANTS.length;
  const ground3Idx = (normSeed * 11) % GROUND_3_VARIANTS.length;
  const ground4Idx = (normSeed * 13) % GROUND_4_VARIANTS.length;
  const ground5Idx = (normSeed * 17) % GROUND_5_VARIANTS.length;
  const ground6Idx = (normSeed * 19) % GROUND_6_VARIANTS.length;
  const prayersIdx = (normSeed * 23) % PRAYERS_VARIANTS.length;
  const signoffIdx = (normSeed * 29) % SIGNOFF_VARIANTS.length;

  const namePlaceholder = studentName.trim() || '[Your Full Name]';
  const rollPlaceholder = rollNumber.trim() || '[Your WBJEE Roll Number]';

  // Format candidate credentials
  const creds = [
    `- Full Name: ${namePlaceholder}`,
    `- WBJEE Roll Number: ${rollPlaceholder}`
  ];
  if (rankGmr.trim()) creds.push(`- WBJEE GMR / Rank: ${rankGmr.trim()}`);
  if (currentInstitute.trim()) creds.push(`- Currently Allotted Institute/Branch: ${currentInstitute.trim()}`);
  if (contactInfo.trim()) creds.push(`- Contact Details: ${contactInfo.trim()}`);

  const rawSubject = SUBJECT_VARIANTS[subjectIdx];
  const salutation = SALUTATION_VARIANTS[salutationIdx];
  const opening = OPENING_VARIANTS[openingIdx];
  const g1 = GROUND_1_VARIANTS[ground1Idx];
  const g2 = GROUND_2_VARIANTS[ground2Idx];
  const g3 = GROUND_3_VARIANTS[ground3Idx];
  const g4 = GROUND_4_VARIANTS[ground4Idx];
  const g5 = GROUND_5_VARIANTS[ground5Idx];
  const g6 = GROUND_6_VARIANTS[ground6Idx];
  const prayers = PRAYERS_VARIANTS[prayersIdx];
  const signoff = SIGNOFF_VARIANTS[signoffIdx](
    namePlaceholder,
    rollPlaceholder,
    rankGmr.trim(),
    contactInfo.trim()
  );

  const body = `${salutation}

Subject: ${rawSubject}

${opening}

Candidate Information:
${creds.join('\n')}

Key Grievance Grounds & Justifications:

${g1}

${g2}

${g3}

${g4}

${g5}

${g6}

${prayers}

${signoff}`;

  return {
    subject: rawSubject,
    body,
    variationNumber: ((normSeed - 1) % TOTAL_PRESET_VARIATIONS) + 1,
    totalVariations: TOTAL_PRESET_VARIATIONS
  };
}

/**
 * Standard generator fallback matching previous API signature
 */
export function generateMegaDraft(formData = {}, seed = 1) {
  return generateUniqueEmail({ ...formData, seed }).body;
}

/**
 * Builds standard mailto URL (RFC 6068 compliant) with unencoded @ symbols in recipients
 */
export function buildMailtoUrl(toEmails, ccEmails, subject, body) {
  const toStr = Array.isArray(toEmails) ? toEmails.join(',') : toEmails;
  const ccStr = Array.isArray(ccEmails) ? ccEmails.join(',') : ccEmails;

  const params = [];
  if (ccStr) {
    params.push(`cc=${ccStr}`);
  }
  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  return `mailto:${toStr}?${params.join('&')}`;
}

/**
 * Builds direct Web Gmail compose URL
 */
export function buildGmailComposeUrl(toEmails, ccEmails, subject, body) {
  const toStr = Array.isArray(toEmails) ? toEmails.join(',') : toEmails;
  const ccStr = Array.isArray(ccEmails) ? ccEmails.join(',') : ccEmails;

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: toStr,
    su: subject,
    body: body
  });

  if (ccStr) {
    params.append('cc', ccStr);
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
}
