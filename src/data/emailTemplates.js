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
    name: 'Hon’ble Chief Minister Shri Suvendu Adhikari',
    email: 'adhikarisuvenduwb1@gmail.com',
    designation: "Chief Minister's Secretariat / Office, Govt of West Bengal",
    category: 'CC'
  }
];

export const EMAIL_SUBJECT = 'DEMAND FOR OFFLINE DECENTRALIZED COUNSELING: Representation against Online DC & WBJEEB Experimental Framework for WBJEE 2026';

export function generateMegaDraft({ 
  studentName = '', 
  rollNumber = '', 
  rankGmr = '', 
  currentInstitute = '', 
  contactInfo = '' 
}) {
  const namePlaceholder = studentName.trim() || '[Your Full Name]';
  const rollPlaceholder = rollNumber.trim() || '[Your WBJEE Roll Number]';
  const rankPlaceholder = rankGmr.trim() || '[Your WBJEE GMR / Rank]';
  const institutePlaceholder = currentInstitute.trim() || '[Your Currently Allotted Institute & Branch / None]';
  const contactPlaceholder = contactInfo.trim() || '[Your Registered Email / Mobile]';

  return `To,
The Chairman / Competent Authority,
West Bengal Joint Entrance Examinations Board (WBJEEB),
RUPANNA, DB-118, Sector-I, Salt Lake City, Kolkata - 700064.

Copy forwarded for urgent perusal and immediate administrative intervention to:
1. Directorate of Technical Education (DTE), Bikash Bhavan (dtewbgovt@gmail.com)
2. Department of Higher Education, Govt. of West Bengal (highereducationwb@gmail.com)
3. Hon'ble Chief Minister Shri Suvendu Adhikari (adhikarisuvenduwb1@gmail.com)

Subject: URGENT: Demand to Scrap Online DC and Conduct OFFLINE Decentralized Counseling as per Historical Precedent for WBJEE 2026.

Respected Authorities,

I am writing this representation as a bonafide candidate of WBJEE 2026 to register my strong protest, anguish, and collective demand regarding the proposed Decentralized Counseling (DC) modality for the 2026 academic session.

Candidate Credentials:
- Full Name: ${namePlaceholder}
- WBJEE Roll Number: ${rollPlaceholder}
- WBJEE GMR / Rank: ${rankPlaceholder}
- Currently Allotted Institute/Branch: ${institutePlaceholder}
- Contact Details: ${contactPlaceholder}

Grounds for Grievance & Core Demands:

1. Contradiction of the "Decentralized" Concept & Historical Convention:
By definition, "Decentralized Counseling" must not and cannot be conducted through a centralized online portal. Historically and consistently across previous academic years, Decentralized / Spot Counseling in West Bengal has ALWAYS been conducted OFFLINE directly at the respective university and college campuses (including Jadavpur University, Calcutta University, KGEC, JGEC, MAKAUT in-house, and other government/private institutes). Attempting to centralize a decentralized process breaks time-tested administrative precedent.

2. WBJEE 2026 Students Refuse to be an "Experimental Batch":
WBJEE 2026 candidates have already suffered immense mental trauma, seat anomalies, and academic loss due to experimental changes introduced during the centralized rounds. Forcing another untested online system for decentralized admissions will only compound the crisis. We firmly demand an end to experimental policies on our careers.

3. Fatal Inherent Flaws of Online Decentralized Counseling:
a) Multiple Allotments & Rampant Seat Blocking: An online portal permits candidates to virtually hold allotments across multiple colleges without physical commitment, keeping real cutoffs artificially elevated and causing massive final vacancies.
b) Fresh Registration in Each Round: Permitting continuous fresh registrations dilutes merit, distorts cutoffs, and destabilizes genuine rank holders who participated diligently from Round 1.
c) Absence of Real "Yes-Upgradation": Online procedures leave admitted students without a transparent, dynamic upgrade path, trapping high-rankers in sub-optimal branches while top government seats remain vacant.

4. The Proven Efficacy of Offline On-Campus Spot Counseling:
Offline spot counseling held at institute premises ensures 100% genuine physical attendance, immediate merit-based GMR verification, and zero ghost vacancies. When an admitted student upgrades on the spot, their vacated seat is immediately allotted to the next waiting candidate in the hall in real time, ensuring complete fairness and total seat utilization.

PRAYERS & IMMEDIATE DEMANDS:
In the interest of justice, merit, and thousands of engineering aspirants of West Bengal, we demand:
1. Immediate scrapping of any proposed centralized Online Decentralized Counseling portal.
2. Directives empowering universities and engineering colleges to independently conduct OFFLINE Decentralized / Spot Counseling on their respective campuses.
3. Full and unconditional eligibility for ALL WBJEE 2026 candidates (admitted and non-admitted) to participate in offline spot counseling for branch and institute upgrades.

We earnestly appeal to your immediate administrative intervention to protect our academic year and restore the established convention.

Yours faithfully,
${namePlaceholder}
WBJEE 2026 Aspirant
Roll Number: ${rollPlaceholder}
GMR: ${rankPlaceholder}
Contact: ${contactPlaceholder}`;
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
