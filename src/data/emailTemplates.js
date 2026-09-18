// WBJEE Official Grievance Email Targets & Dynamic Multi-Variant Draft Generator

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

// 30+ Dynamic Subject Line Variants focused strictly on Offline DC & Phase 2 Rules
export const SUBJECT_VARIANTS_OFFLINE_DC = [
  "URGENT APPEAL: Demand for Genuine Offline Decentralized Counselling & Physical Spot Admission at College Campuses (WBJEE 2026)",
  "Representation on WBJEE 2026 Counselling Flaws: Demand for Physical College-Level Offline DC to Fill Vacant Seats",
  "URGENT: Formal Appeal to Conduct Offline Decentralized Counselling and Eliminate Seat-Blocking Flaws (WBJEE 2026)",
  "Demand for Offline Decentralized Counselling as per Historical Precedent to Fill Vacant Engineering Seats - WBJEE 2026",
  "Grievance & Appeal: Demand to Conduct In-Person College-Level Spot DC & Publish Vacancy Position (WBJEE 2026)",
  "Subject: Respect Historical Precedent — Conduct Decentralized Counselling OFFLINE at Institute Campuses (WBJEE 2026)",
  "Submission of Bonafide Aspirants: Urgent Demand for Physical Reporting & Genuine Offline DC for WBJEE 2026",
  "Urgent Representation to WBJEEB & DTE: Restore Physical Campus Spot Counselling to Prevent Loss of Academic Year (WBJEE 2026)",
  "Candidate Appeal: Demand for In-Person Offline Spot Admission & Elimination of Online DC Seat-Blocking (WBJEE 2026)",
  "Representation regarding Unnatural Cut-Off Inflation & Vacant Seats: Demand for Offline Campus DC - WBJEE 2026",
  "URGENT INTERVENTION REQUESTED: Demand for Genuine Offline Decentralized Counselling at College Campuses (WBJEE 2026)",
  "Mass Aspirants Representation: Request for Direct Offline Spot Counselling at Institute Campuses (WBJEE 2026)",
  "Formal Appeal to Chairman WBJEEB & DTE: Demand for In-Person Spot Counselling and Protection of Student Future (WBJEE 2026)",
  "WBJEE 2026 Candidate Grievance: Conduct Offline Spot Rounds & Save Thousands of Students from Losing an Academic Year",
  "Urgent Representation: Modalities of WBJEE 2026 Decentralized Counselling - Demand for Offline Physical Reporting at Colleges",
  "Petition on Behalf of WBJEE 2026 Aspirants: Offline Campus Counselling & Transparent Vacant Seat Allocation",
  "CRITICAL APPEAL: Stop Centralizing Decentralized Counselling - Conduct Offline Spot Rounds at Colleges (WBJEE 2026)",
  "Representation: Demand for Genuine Offline Decentralized Counselling with Physical Verification & Instant Seat Allocation",
  "URGENT: Demand for Immediate Notification on Offline Decentralized Counselling Schedule for WBJEE 2026 Candidates",
  "Formal Aspirant Grievance: Conduct Offline Spot Counselling at Respective Colleges (JU/CU/KGEC/JGEC/GCECT etc.)",
  "WBJEE 2026 Representation: Urgent Need to Implement Physical Campus Spot Rounds & Fill Vacant Engineering Seats",
  "Appeal for Justice in WBJEE 2026: Demand for Offline Spot Admission and Transparent Vacancy Matrix Publication",
  "Statutory Representation: Rejection of Flawed Online DC, Demand for Physical Campus Counselling (WBJEE 2026)",
  "Urgent Grievance regarding WBJEE 2026 Counselling: Students Willing to Travel for Offline DC at College Campuses",
  "Aspirant Appeal: Restore Offline Campus Precedent & Protect Thousands of Engineering Aspirants from Losing One Year"
];

export const SUBJECT_VARIANTS_PHASE2_RULES = [
  "Request for Revision of Eligibility Rules for DCAP 2026 Phase 2 Counselling",
  "URGENT: Representation to Reconsider DCAP 2026 Phase 2 Eligibility to Protect Unadmitted Candidates",
  "Appeal for DCAP 2026 Phase 2: Exclude Already Admitted Candidates to Fill Remaining Vacancies for Unallotted Students",
  "Formal Representation regarding WBJEE 2026 DCAP Phase 2: Prioritise Unadmitted Candidates for Remaining Vacant Seats",
  "Urgent Request to WBJEEB: Bar Already Admitted CC/DC Phase 1 Candidates from Blocking DCAP Phase 2 Vacancies"
];

export const TOTAL_PRESET_VARIATIONS = 200;

/**
 * Generate Primary Template 1: Demand for Genuine Offline Decentralized Counselling
 */
export function generateOfflineDcBody({
  studentName = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = '',
  seed = 1
}) {
  const nameDisplay = studentName.trim() || 'Concerned WBJEE 2026 Candidates & Bonafide Aspirants';
  const appDisplay = rollNumber.trim() ? `\nWBJEE-2026 Application Number / Roll: ${rollNumber.trim()}` : '';
  const rankDisplay = rankGmr.trim() ? `\nWBJEE-2026 Rank / GMR: ${rankGmr.trim()}` : '';
  const collegeDisplay = currentInstitute.trim() ? `\nCurrent Allotted / Interested Institution: ${currentInstitute.trim()}` : '';
  const phoneDisplay = contactInfo.trim() ? `\nContact Number: ${contactInfo.trim()}` : '';

  const isIndividual = Boolean(studentName.trim() || rollNumber.trim() || rankGmr.trim());

  return `To,
The Chairman / Competent Authority,
West Bengal Joint Entrance Examinations Board (WBJEEB)
& Directorate of Technical Education (DTE), Government of West Bengal

Respected Sir/Madam,

We, the undersigned students and prospective candidates of WBJEE 2026, are writing to express our serious concern and immense frustration regarding the current state and pace of the WBJEE counselling process. It is an appeal concerning the counselling mechanism itself, whether centralised or decentralised, and the thousands of students whose higher-education plans are being severely affected by the present situation.

The current counselling process has created an extraordinary situation in which cut-offs for government and private engineering colleges across West Bengal have risen to levels that are drastically different from the established patterns observed in previous years. This includes even relatively new government engineering institutions and colleges that historically remained accessible at considerably higher GMRs. At the same time, a substantial number of seats are reportedly still vacant across engineering colleges in the state, including both government and private institutions. This creates a fundamental contradiction: if a large number of seats compared to past years remain vacant, why are genuine candidates unable to access those seats through a timely and effective counselling mechanism?

The present situation is not merely a question of cut-offs:
We understand that cut-offs naturally fluctuate depending on various factors. However, the present situation appears fundamentally different. Government engineering colleges, including relatively new institutions with limited historical placement and academic records, and also private colleges which accepted students within and even beyond 50,000 GMR are closing around the first few thousands. This suggests that the issue cannot simply be explained by an increase in student preference. There appears to be a significant counselling-flow and seat-allocation flaw.

The distinction between centralized and decentralized counselling must be understood clearly:
The term Decentralized Counselling should not merely refer to just another round of online seat allocation. A genuine decentralized counselling process, as conducted in previous years, provides colleges with an opportunity to fill their remaining vacant seats through a physical, college-level process. This process also naturally filters out candidates who are merely holding seats without genuine intent to join. Candidates can:
• Travel to the respective institution;
• Physically report at the college;
• Verify their documents;
• Exercise their choices based on the seats actually available;
• Accept a seat immediately; and
• Allow vacant seats to be filled by candidates who are genuinely willing to join.
This mechanism is fundamentally different from simply conducting another centralized online round.

Thousands of students cannot afford to lose an academic year:
For many families, an engineering degree from a private institution costing several lakhs of rupees is simply not financially feasible, even more so via direct admission. Students from lower- and middle-income families often depend upon the comparatively affordable fee structures of government institutions. Therefore, when government seats remain vacant while students are unable to obtain those seats through the counselling system, the consequences are much more serious than an ordinary counselling inconvenience. Students may be forced to: abandon otherwise viable engineering plans; take admission in institutions that are financially unaffordable; lose an academic year; discontinue their education; or make educational decisions under severe financial pressure. For a student and their family, an additional year is not merely a number on a calendar. It represents tuition, living expenses, preparation costs and, most importantly, lost time.

Vacant seats and unusually high cut-offs cannot coexist indefinitely:
If tens of thousands of seats remain vacant across the counselling system, the authorities should urgently examine why these seats are not reaching eligible candidates. A candidate who is willing to physically report to a government engineering college and accept a vacant seat should not be effectively excluded merely because an online counselling process has failed to match the candidate with that seat.

Students are willing to take responsibility and travel physically:
We specifically wish to emphasise that the demand for offline DC is not a demand for convenience. On the contrary, a genuine offline DC requires students to take considerable responsibility. Candidates are willing to travel to institutions across West Bengal, often covering hundreds of kilometres, to report physically and secure a seat. This process also naturally filters out candidates who are merely holding seats without genuine intent to join. A student who physically travels to a college and completes admission formalities has demonstrated a considerably stronger intention to occupy that seat than someone who continues to hold multiple options through an online counselling process.

The present delay is causing uncertainty for students:
The prolonged counselling process is also creating uncertainty regarding academic sessions. Students cannot indefinitely remain in limbo while simultaneously making decisions regarding accommodation, fees, transportation, books, preparation, and their future academic plans. Every additional delay increases the possibility that: students will be forced to accept expensive alternatives; vacant seats will remain vacant; students will withdraw from the counselling process altogether; and the academic calendar will be further disrupted. This is particularly concerning for candidates who have deliberately chosen West Bengal's government engineering system because it provides an affordable pathway to higher education.

Our specific request:
We therefore respectfully request the competent authorities to urgently consider conducting a genuine offline Decentralized Counselling process for WBJEE 2026, preferably at the respective college campuses, with the following principles:
1. Physical reporting at the concerned institution for eligible candidates.
2. Publication of the college-wise, branch-wise and category-wise vacant-seat position before counselling.
3. A transparent and publicly accessible procedure for determining the order of admission strictly according to applicable merit, eligibility and reservation rules.
4. Adequate advance notice so that candidates from every district can arrange travel and accommodation.
5. Clear reporting of the seats filled and remaining vacant after each phase of DC.
6. A mechanism preventing candidates from indefinitely blocking seats that they do not intend to occupy.
7. Publication of an official schedule at the earliest possible opportunity so that students can make informed decisions.

This is a collective student appeal:
Our request is simply that eligible students should be given a genuine and transparent opportunity to compete for vacant seats, particularly when they are willing to physically report to the institutions and accept those seats. The present situation is causing considerable anxiety among students and families who have limited financial resources and depend upon affordable public engineering education. We therefore respectfully urge the WBJEE Board and the Government of West Bengal to intervene at the earliest and introduce a proper, transparent and genuinely decentralized offline counselling mechanism for the remaining vacant seats.

Yours faithfully,
${nameDisplay}${appDisplay}${rankDisplay}${collegeDisplay}${phoneDisplay}`;
}

/**
 * Generate Template 2: Request for Revision of Eligibility Rules for DCAP 2026 Phase 2 Counselling
 */
export function generatePhase2RulesBody({
  studentName = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = '',
  seed = 1
}) {
  const nameDisplay = studentName.trim() || '[Your Full Name]';
  const appDisplay = rollNumber.trim() || '[Application Number]';
  const rankDisplay = rankGmr.trim() || '[Rank]';
  const phoneDisplay = contactInfo.trim() || '[Mobile Number]';

  return `To,
The Chairman / Competent Authority,
West Bengal Joint Entrance Examinations Board (WBJEEB)
& Directorate of Technical Education, Government of West Bengal

Subject: Request for Revision of Eligibility Rules for DCAP 2026 Phase 2 Counselling

Dear Sir/Madam,

I am writing to respectfully request the West Bengal Joint Entrance Examinations Board to reconsider the participation rules for Phase 2 of Decentralised Counselling (DCAP) 2026, with particular consideration for eligible candidates who have not yet secured admission.

I request that candidates who have already taken admission through WBJEE-2026 Centralised Counselling or Phase 1 of Decentralised Counselling be made ineligible to participate in DCAP 2026 Phase 2. This would allow the remaining vacancies to be considered exclusively for eligible candidates who are still without admission.

Candidates further down the merit list, including those with ranks approaching 20,000, may depend on this phase for an opportunity to secure admission to a suitable college and branch. Allowing candidates with confirmed admissions to compete again for these vacancies could limit the options available to those still seeking their first admission.

While I recognise the importance of merit and candidates’ academic preferences, I respectfully submit that Phase 2 should give particular consideration to students who remain without a confirmed seat. Allocating the remaining vacancies among these candidates, in merit order and subject to applicable reservation and eligibility requirements, could improve their access to suitable educational opportunities.

I therefore request the Board to consider:

1. Revising Phase 2 eligibility to exclude candidates already admitted through Centralised Counselling or DCAP Phase 1.
2. Verifying candidates’ admission status through the counselling portal and institutional records.
3. Publishing a clear notification explaining any revised eligibility conditions before Phase 2 commences.

Kindly consider this representation and communicate the Board’s decision. Thank you for your time and consideration.

Yours faithfully,  
${nameDisplay}  
WBJEE-2026 Application Number: ${appDisplay}  
WBJEE-2026 Rank: ${rankDisplay}  
Contact Number: ${phoneDisplay}`;
}

/**
 * Universal dynamic email builder with template switcher and seed permutation
 */
export function generateUniqueEmail({
  templateType = 'offline_dc', // 'offline_dc' | 'phase2_rules'
  studentName = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = '',
  seed = 1
}) {
  const seedNum = Number(seed) || 1;

  if (templateType === 'phase2_rules') {
    const subjectIndex = (seedNum - 1) % SUBJECT_VARIANTS_PHASE2_RULES.length;
    const subject = SUBJECT_VARIANTS_PHASE2_RULES[subjectIndex];
    const body = generatePhase2RulesBody({
      studentName,
      rollNumber,
      rankGmr,
      currentInstitute,
      contactInfo,
      seed: seedNum
    });
    return { subject, body };
  }

  // Default: Primary Offline DC Representation
  const subjectIndex = (seedNum - 1) % SUBJECT_VARIANTS_OFFLINE_DC.length;
  const subject = SUBJECT_VARIANTS_OFFLINE_DC[subjectIndex];
  const body = generateOfflineDcBody({
    studentName,
    rollNumber,
    rankGmr,
    currentInstitute,
    contactInfo,
    seed: seedNum
  });

  return { subject, body };
}

/**
 * Build mailto: URL string with clean URI encoding
 */
export function buildMailtoUrl(toArr, ccArr, subject, body) {
  const toStr = toArr.join(',');
  const params = new URLSearchParams();

  if (ccArr && ccArr.length > 0) {
    params.set('cc', ccArr.join(','));
  }
  params.set('subject', subject);
  params.set('body', body);

  return `mailto:${toStr}?${params.toString()}`;
}

/**
 * Build direct web Gmail compose URL
 */
export function buildGmailComposeUrl(toArr, ccArr, subject, body) {
  const toStr = toArr.join(',');
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: toStr,
    su: subject,
    body: body
  });

  if (ccArr && ccArr.length > 0) {
    params.set('cc', ccArr.join(','));
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Build direct web Outlook compose URL
 */
export function buildOutlookComposeUrl(toArr, ccArr, subject, body) {
  const toStr = toArr.join(';');
  const params = new URLSearchParams({
    path: '/mail/action/compose',
    to: toStr,
    subject: subject,
    body: body
  });

  if (ccArr && ccArr.length > 0) {
    params.set('cc', ccArr.join(';'));
  }

  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`;
}

/**
 * Build direct web Yahoo compose URL
 */
export function buildYahooComposeUrl(toArr, ccArr, subject, body) {
  const toStr = toArr.join(',');
  const params = new URLSearchParams({
    to: toStr,
    subj: subject,
    body: body
  });

  if (ccArr && ccArr.length > 0) {
    params.set('cc', ccArr.join(','));
  }

  return `https://compose.mail.yahoo.com/?${params.toString()}`;
}
