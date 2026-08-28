// WBJEE Grievance Email Targets & Unified Mega-Draft

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
    name: 'Shri Suvendu Adhikari (Leader of Opposition)',
    email: 'adhikarisuvenduwb1@gmail.com',
    designation: 'Office of the Leader of Opposition, West Bengal',
    category: 'CC'
  }
];

export const EMAIL_SUBJECT = 'URGENT: Representation against WBJEEB Decentralized Counseling Notification dated 27.08.2026';

export function generateMegaDraft({ studentName = '', rollNumber = '', currentInstitute = '' }) {
  const namePlaceholder = studentName.trim() || '[Your Full Name]';
  const rollPlaceholder = rollNumber.trim() || '[Your WBJEE Roll / Rank Number]';
  const institutePlaceholder = currentInstitute.trim() || '[Your Currently Allotted Institute & Branch / None]';

  return `To,
The Chairman / Competent Authority,
West Bengal Joint Entrance Examinations Board (WBJEEB),
Kolkata, West Bengal.

Copy forwarded for urgent perusal and intervention to:
1. Directorate of Technical Education (DTE), Bikash Bhavan (dtewbgovt@gmail.com)
2. Department of Higher Education, Govt. of West Bengal (highereducationwb@gmail.com)
3. Shri Suvendu Adhikari, Leader of Opposition (adhikarisuvenduwb1@gmail.com)

Subject: URGENT: Representation regarding severe distress and academic loss caused by WBJEEB Decentralized Counseling Notification dated 27.08.2026.

Respected Authorities,

I am writing this representation as a bonafide candidate of WBJEE 2026 to register my deep anguish, distress, and formal grievance against the sudden notification issued on 27.08.2026 regarding Decentralized Counseling (DC).

Candidate Credentials:
- Name: ${namePlaceholder}
- WBJEE Roll / Rank: ${rollPlaceholder}
- Currently Allotted Institute/Branch: ${institutePlaceholder}

Grounds for Grievance & Appeal:

1. Violation of Established Precedent & Legitimate Expectation:
Historically and consistently across previous academic years, Decentralized Counseling in West Bengal has ALWAYS permitted already admitted students to participate and upgrade to their preferred branches/institutions (including Jadavpur University, Calcutta University, KGEC, JGEC, etc.) without forfeiting their existing seats. Millions of students planned their counseling choices relying in good faith on this established convention.

2. Flawed Centralized Counseling Framework & Artificial Cutoff Compression:
During the WBJEE 2026 centralized rounds, permitting fresh registrations across all 3 rounds caused an artificial compression of cutoffs rather than expected relaxation. This resulted in unprecedented anomalies, widespread seat blocking, and arbitrary allocations that forced merit-holding students to freeze seats in sub-optimal branches just to secure an academic year.

3. Unjust Trapping of Meritorious Candidates & Creation of Artificial Vacancies:
The sudden notification dated 27.08.2026 barring admitted candidates effectively locks high-rankers into colleges while allowing lower-ranked or unregistered candidates to claim vacant seats in premier government institutes. This directly penalizes merit and violates equitable access to higher education in our state.

Prayer / Demands:
In the greater interest of justice and the future of thousands of West Bengal engineering aspirants, I humbly request:
a) Immediate withdrawal or reconsideration of the restrictive clause in the 27.08.2026 notification.
b) Unconditional permission for ALL admitted WBJEE 2026 candidates to participate in Decentralized Counseling across all state universities and government/private colleges.
c) Directives ensuring uniform, transparent, and merit-based spot/decentralized counseling across all institutions.

I earnestly appeal to the competent authorities to intervene at the earliest to prevent irreparable career and academic damage.

Yours faithfully,
${namePlaceholder}
WBJEE 2026 Aspirant
Roll/Rank: ${rollPlaceholder}
Contact: Through Registered Email`;
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
    cc: ccStr,
    su: subject,
    body: body
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}
