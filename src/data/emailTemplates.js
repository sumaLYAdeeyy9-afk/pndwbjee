// WBJEE Grievance Email Targets & Unified Mega-Draft

export const PRIMARY_TO_RECIPIENTS = [
  'info@wbjeeb.in',
  'helpdesk@wbjeeb.in'
];

export const CC_RECIPIENTS = [
  'highereducationwb@gmail.com',
  'dpihedn@gmail.com',
  'jdpidd1@gmail.com'
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
    id: 'wbjeeb_support',
    name: 'WBJEEB Support / Helpdesk',
    email: 'helpdesk@wbjeeb.in',
    designation: 'WBJEEB Candidate Support',
    category: 'TO'
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
  }
];

export const EMAIL_SUBJECT = 'URGENT: Revoke Aug 27 Notification Restricting Admitted Students from WBJEE 2026 Decentralized Counseling';

export function generateMegaDraft(data) {
  const name = data.studentName?.trim() || '[Student Name]';
  const roll = data.rollNumber?.trim() || '[Roll Number]';
  const institute = data.currentInstitute?.trim() || '[Allotted Institute]';

  return `To the Hon'ble Chairman of WBJEEB and Officials of the Higher Education Department,

I am writing to urgently register my protest against the WBJEEB notification issued on August 27, 2026, which abruptly bars already admitted students from participating in the Decentralized Counseling (DC) rounds.

Thousands of students, myself included, secured and locked our admissions based on the clear historical precedent that DC allows admitted students to upgrade their branches at esteemed state universities. Altering this fundamental rule after the primary admission phases have concluded is unjust and severely penalizes merit-holding students who trusted the process.

By restricting upgrades, the Board is trapping students in colleges or branches they would not have otherwise finalized. We urgently appeal to the Board and the Higher Education Department to intervene, suspend this notification, and restore our right to participate in Decentralized Counseling.

Sincerely,
${name}
WBJEE Roll Number: ${roll}
Current Allotted Institute: ${institute}`;
}

/**
 * Generates RFC 6068 compliant mailto link for Android/iOS Native Mail & Gmail Apps
 */
export function buildMailtoUrl(toEmails, ccEmails, subject, body) {
  const to = Array.isArray(toEmails) ? toEmails.join(',') : toEmails;
  const cc = Array.isArray(ccEmails) ? ccEmails.join(',') : ccEmails;
  
  const params = [];
  if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${to}${queryString}`;
}

/**
 * Web browser fallback for desktop Gmail
 */
export function buildGmailComposeUrl(toEmails, ccEmails, subject, body) {
  const to = Array.isArray(toEmails) ? toEmails.join(',') : toEmails;
  const cc = Array.isArray(ccEmails) ? ccEmails.join(',') : ccEmails;

  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to,
    su: subject,
    body: body
  });

  if (cc) {
    params.append('cc', cc);
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
}
