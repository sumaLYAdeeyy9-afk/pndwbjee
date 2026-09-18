// WBJEE Official Grievance Email Targets & Offline DC Representation Generator

export const PRIMARY_TO_RECIPIENTS = [
  'info@wbjeeb.in'
];

export const CC_RECIPIENTS = [
  'dtewbgovt@gmail.com',
  'vc@jadavpuruniversity.in',
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
    id: 'vc_ju',
    name: 'Hon’ble Vice-Chancellor, Jadavpur University',
    email: 'vc@jadavpuruniversity.in',
    designation: 'Office of the Vice-Chancellor, Jadavpur University',
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

// Dynamic Subject Line Variants for Deliverability
export const SUBJECT_VARIANTS = [
  "Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "URGENT: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "Representation: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "Formal Appeal: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "WBJEE 2026 Candidate Appeal: Request for Genuine Offline Decentralised Counselling",
  "Submission of WBJEE 2026 Aspirants: Request for Genuine Offline Decentralised Counselling",
  "Urgent Representation to WBJEEB, DTE & JU: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "Appeal for Physical Campus Spot Rounds: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
  "Grievance & Appeal: Request for Genuine Offline Decentralised Counselling for WBJEE 2026 Remaining Vacant Seats",
  "Mass Student Representation: Request for Genuine Offline Decentralised Counselling for WBJEE 2026"
];

/**
 * Generate Universal Offline DC Representation Addressed to All Key Authorities
 */
export function generateOfflineDcBody({
  studentName = '',
  rollOrRank = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = ''
}) {
  const unifiedRollRank = (rollOrRank || '').trim() || (rollNumber.trim() && rankGmr.trim() ? `${rollNumber.trim()} (GMR: ${rankGmr.trim()})` : (rollNumber.trim() || rankGmr.trim()));
  const hasDetails = Boolean(studentName.trim() || unifiedRollRank);

  let signature = 'Concerned WBJEE 2026 Candidates & Bonafide Aspirants';

  if (hasDetails) {
    const lines = [];
    if (studentName.trim()) lines.push(studentName.trim());
    else lines.push('Concerned WBJEE 2026 Candidate');

    if (unifiedRollRank) lines.push(`WBJEE 2026 Roll No. / Rank (GMR): ${unifiedRollRank}`);
    if (currentInstitute.trim()) lines.push(`Allotted College: ${currentInstitute.trim()}`);
    if (contactInfo.trim()) lines.push(`Contact Number: ${contactInfo.trim()}`);

    signature = lines.join('\n');
  }

  return `To,
1. The Chairman / Competent Authority, West Bengal Joint Entrance Examinations Board (WBJEEB)
2. The Director of Technical Education (DTE), Government of West Bengal
3. The Vice-Chancellor, Jadavpur University
4. The Principal Secretary, Department of Higher Education, Government of West Bengal
5. The Director of Public Instruction (DPI), Government of West Bengal
6. The Chief Minister's Office & Higher Education Wing, Government of West Bengal

Subject: Request for Genuine Offline Decentralised Counselling for WBJEE 2026

Respected Authorities / Respected Sir/Madam,

We, the undersigned WBJEE 2026 candidates and aspirants, respectfully submit this joint representation to WBJEEB, DTE, the Higher Education Department, and Participating University Administrations to urgently address the present counselling situation and consider conducting a genuine offline Decentralised Counselling (DC) for the remaining vacant seats.

Students are concerned that multiple allocation/holding of seats by candidates across counselling processes may be contributing to unusually high cut-offs while substantial numbers of seats remain vacant. This has created difficulties for candidates who are genuinely willing to take admission, particularly those who depend on the comparatively affordable fees of government institutions and state universities.

Furthermore, Phase 1 of Decentralised Counselling (DCAP Phase 1) has now been completed, yet the number of vacant seats across institutions has gone down by only a negligible margin. This clearly signifies the deeply faulty and ineffective mechanism of the current online centralised DC process, where seats continue to remain blocked online without resulting in genuine physical admissions on campus.

A genuine offline DC at the respective college and university campuses could help ensure that vacant seats reach candidates who are actually willing to join. Physical reporting would allow candidates to:

* Verify documents and eligibility directly at the institution;
* Choose from seats actually vacant at that time;
* Accept a seat immediately; and
* Reduce the possibility of seats being held by candidates without genuine intention to join.

We therefore request WBJEEB, the Directorate of Technical Education, and the Higher Education Authorities to consider:

1. Conducting physical, college-level DC for remaining vacant seats;
2. Publishing college-wise, branch-wise and category-wise vacancy data beforehand;
3. Following a transparent process based on merit, eligibility and applicable reservation rules;
4. Providing adequate advance notice for candidates to arrange travel;
5. Publishing the seats filled and remaining vacant after each phase; and
6. Providing an official schedule at the earliest possible opportunity.

Many students cannot afford expensive private alternatives or another academic year. We therefore respectfully request the competent authorities to examine the present counselling mechanism and provide eligible candidates with a transparent opportunity to fill genuinely vacant seats.

Yours faithfully,
${signature}`;
}

/**
 * Universal dynamic email builder
 */
export function generateUniqueEmail({
  studentName = '',
  rollOrRank = '',
  rollNumber = '',
  rankGmr = '',
  currentInstitute = '',
  contactInfo = '',
  seed = 1
}) {
  const seedNum = Number(seed) || 1;
  const subjectIndex = (seedNum - 1) % SUBJECT_VARIANTS.length;
  const subject = SUBJECT_VARIANTS[subjectIndex];
  const body = generateOfflineDcBody({
    studentName,
    rollOrRank,
    rollNumber,
    rankGmr,
    currentInstitute,
    contactInfo
  });

  return { subject, body };
}

/**
 * Build mailto: URL string with clean URI encoding (%20 for spaces, not +)
 */
export function buildMailtoUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  const parts = [];

  if (ccArr && ccArr.length > 0) {
    parts.push(`cc=${encodeURIComponent(ccArr.join(','))}`);
  }

  parts.push(`subject=${encodeURIComponent(subject)}`);

  // Proper CRLF line breaks for mail clients
  const formattedBody = (body || '').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  parts.push(`body=${encodeURIComponent(formattedBody)}`);

  return `mailto:${toStr}?${parts.join('&')}`;
}

/**
 * Build direct web Gmail compose URL (%20 for spaces, not +)
 */
export function buildGmailComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toStr)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(','))}`;
  }

  return url;
}

/**
 * Build direct web Outlook compose URL (%20 for spaces, not +)
 */
export function buildOutlookComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(';');
  let url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(toStr)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(';'))}`;
  }

  return url;
}

/**
 * Build direct web Yahoo compose URL (%20 for spaces, not +)
 */
export function buildYahooComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  let url = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(toStr)}&subj=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(','))}`;
  }

  return url;
}
