// Target Handles Database for WBJEE 2026 Strike Hub
// High-Profile Targets across Journalists, Legal/Education Advocates, Youth Leaders, and Politicians

export const TARGET_CATEGORIES = [
  { id: 'all', label: 'All Targets', icon: '⚡' },
  { id: 'politician', label: 'Politicians & Leaders', icon: '🏛️' },
  { id: 'journalist', label: 'Journalists & Media', icon: '📰' },
  { id: 'advocate', label: 'Advocates & RTI Activists', icon: '⚖️' },
  { id: 'student', label: 'Student & Youth Leaders', icon: '✊' },
];

export const TARGET_HANDLES = [
  // 1. First Position Target (Priority 1)
  {
    id: 'target-1',
    name: 'Jagannath Chattopadhyay',
    handle: 'iamJagannathC',
    category: 'politician',
    role: 'Education Minister / State Leadership, WB',
    priority: 'critical',
    bio: 'Education Minister / State Leader; active communicator on student issues, meritocracy, and state governance.',
    tags: ['EducationMinister', 'Leadership', 'Bengal', 'Advocacy', 'TopPriority']
  },

  // 2. Journalists & Media
  {
    id: 'target-2',
    name: 'Tamal Saha',
    handle: 'Tamal0401',
    category: 'journalist',
    role: 'Journalist / Ground Reporter',
    priority: 'high',
    bio: 'Extensively covers West Bengal politics, youth grievances, and education ground reality.',
    tags: ['Media', 'Bengal', 'Ground']
  },
  {
    id: 'target-3',
    name: 'Snigdhendu Bhattacharya',
    handle: 'snigspeak',
    category: 'journalist',
    role: 'Journalist & Author',
    priority: 'high',
    bio: 'Senior journalist & author writing on socio-political affairs and institutional policies.',
    tags: ['Media', 'Author', 'Analysis']
  },
  {
    id: 'target-4',
    name: 'Mayukh Ranjan Ghosh',
    handle: 'mayukhrghosh',
    category: 'journalist',
    role: 'Senior Journalist / Anchor',
    priority: 'high',
    bio: 'High youth and student viewership across West Bengal media networks.',
    tags: ['Media', 'PrimeTime', 'Youth']
  },
  {
    id: 'target-5',
    name: 'Kamalika Sengupta',
    handle: 'KamalikaSengupt',
    category: 'journalist',
    role: 'Journalist / Bureau Chief',
    priority: 'high',
    bio: 'National and regional bureau coverage on Bengal governance and student issues.',
    tags: ['Media', 'National', 'Bureau']
  },
  {
    id: 'target-6',
    name: 'Puja Mehra',
    handle: 'pujamehra',
    category: 'journalist',
    role: 'Journalist & Author',
    priority: 'high',
    bio: 'Senior journalist, columnist & author covering policy, public interest, and institutional governance.',
    tags: ['Media', 'Journalist', 'Governance']
  },
  {
    id: 'target-7',
    name: 'Indrajit Kundu',
    handle: 'iindrojit',
    category: 'journalist',
    role: 'Associate Editor',
    priority: 'high',
    bio: 'Senior reporter & editor covering policy, politics, and civic protests in Bengal.',
    tags: ['Media', 'Editor']
  },
  {
    id: 'target-8',
    name: 'Manogya Loiwal',
    handle: 'manogyaloiwal',
    category: 'journalist',
    role: 'Senior Editor & TV Anchor',
    priority: 'high',
    bio: 'National television editor with massive reach across student & citizen issues.',
    tags: ['Media', 'Editor', 'National']
  },
  {
    id: 'target-9',
    name: 'Ritayan Basu',
    handle: 'ritayanbasu',
    category: 'journalist',
    role: 'Senior News Reporter',
    priority: 'medium',
    bio: 'Digital news editor covering Bengal public interest issues.',
    tags: ['Media', 'Digital']
  },

  // 3. Education Advocates & RTI Activists
  {
    id: 'target-10',
    name: 'Saurav Das',
    handle: 'SauravDassss',
    category: 'advocate',
    role: 'Investigative Journalist & Commentator',
    priority: 'high',
    bio: 'RTI activist and legal transparency researcher exposing institutional flaws.',
    tags: ['Advocate', 'RTI', 'Transparency']
  },
  {
    id: 'target-11',
    name: 'Adv. Anubha Shrivastava Sahai',
    handle: 'anubha1812',
    category: 'advocate',
    role: 'Supreme Court Lawyer & Education Activist',
    priority: 'critical',
    bio: 'President of India Wide Parents Association (IWPA); premier national voice against admission irregularities.',
    tags: ['Advocate', 'Legal', 'SupremeCourt']
  },
  {
    id: 'target-12',
    name: 'Dr. Vivek Pandey',
    handle: 'Vivekpandey21',
    category: 'advocate',
    role: 'RTI Activist & Healthcare/Education Advocate',
    priority: 'critical',
    bio: 'Prominent national RTI activist fighting exam delays, seat blocking, and counselling malpractice.',
    tags: ['Advocate', 'RTI', 'StudentRights']
  },
  {
    id: 'target-13',
    name: 'Adv. Alakh Alok Srivastava',
    handle: 'advocate_alakh',
    category: 'advocate',
    role: 'Advocate on Record, Supreme Court',
    priority: 'high',
    bio: 'Leading legal counsel championing student fundamental rights and transparent entrance procedures.',
    tags: ['Advocate', 'Legal']
  },

  // 4. Student & Youth Leaders
  {
    id: 'target-14',
    name: 'Abhijeet Dipke',
    handle: 'abhijeet_dipke',
    category: 'student',
    role: 'Youth Activist & Founder, CJP',
    priority: 'critical',
    bio: 'Founder of Cockroach Janta Party (CJP); leading viral youth digital protests and student rights campaigns.',
    tags: ['Youth', 'DigitalActivist', 'CJP', 'Viral']
  },
  {
    id: 'target-15',
    name: 'Cockroach Janta Party (CJP)',
    handle: 'CJP_2029',
    category: 'student',
    role: 'Viral Youth Digital Movement',
    priority: 'critical',
    bio: 'Viral Gen-Z youth movement advocating for student welfare, fair exams, and institutional accountability.',
    tags: ['Youth', 'Movement', 'CJP', 'Students']
  },
  {
    id: 'target-16',
    name: 'Minakshi Mukherjee',
    handle: 'MinakshiMukher8',
    category: 'student',
    role: 'Youth & Mass Movement Leader',
    priority: 'critical',
    bio: 'Leading massive grassroots youth mobilizations across West Bengal.',
    tags: ['StudentLeader', 'Youth', 'Grassroots']
  },

  // 5. Politicians & Leaders
  {
    id: 'target-17',
    name: 'Kunal Ghosh',
    handle: 'KunalGhoshAgain',
    category: 'politician',
    role: 'Spokesperson & State General Secretary',
    priority: 'critical',
    bio: 'Extremely active respondent on X; routinely intervenes in public grievances.',
    tags: ['Politician', 'Spokesperson', 'Active']
  },
  {
    id: 'target-18',
    name: 'Saket Gokhale',
    handle: 'SaketGokhale',
    category: 'politician',
    role: 'Member of Parliament, Rajya Sabha',
    priority: 'high',
    bio: 'Focuses on institutional transparency, administrative audits, and RTI accountability.',
    tags: ['Politician', 'MP', 'RajyaSabha']
  },
  {
    id: 'target-19',
    name: 'Derek O\'Brien',
    handle: 'derekobrienmp',
    category: 'politician',
    role: 'Leader in Rajya Sabha',
    priority: 'medium',
    bio: 'Parliamentary leader and public communicator on governance reforms.',
    tags: ['Politician', 'MP']
  },
  {
    id: 'target-20',
    name: 'Mohammed Salim',
    handle: 'salimdotcomrade',
    category: 'politician',
    role: 'State Secretary & Former MP',
    priority: 'high',
    bio: 'Senior leader consistently raising institutional recruitment & entrance anomalies.',
    tags: ['Politician', 'Leadership']
  },
  {
    id: 'target-21',
    name: 'Dr. Sukanta Majumdar',
    handle: 'DrSukantaBJP',
    category: 'politician',
    role: 'Union Minister of State & MP',
    priority: 'high',
    bio: 'Union MoS for Education / Development; former college professor understanding academic admissions.',
    tags: ['Politician', 'UnionMinister', 'MP']
  },
  {
    id: 'target-22',
    name: 'Agnimitra Paul',
    handle: 'paulagnimitra1',
    category: 'politician',
    role: 'MLA & State General Secretary',
    priority: 'high',
    bio: 'Vocal legislator protesting against state administrative inefficiencies.',
    tags: ['Politician', 'MLA']
  },
  {
    id: 'target-23',
    name: 'Amit Malviya',
    handle: 'amitmalviya',
    category: 'politician',
    role: 'National IT & Communications In-charge',
    priority: 'high',
    bio: 'National amplification of West Bengal governance and student policy issues.',
    tags: ['Politician', 'National']
  },
  {
    id: 'target-24',
    name: 'Suvendu Adhikari',
    handle: 'SuvenduWB',
    category: 'politician',
    role: 'Chief Minister / Senior Leader & MLA, WB',
    priority: 'critical',
    bio: 'Chief Minister / Senior Leader; massive digital reach, frequently amplifies West Bengal student grievances.',
    tags: ['ChiefMinister', 'Leadership', 'MLA', 'WB']
  }
];

export function getTargetById(id) {
  return TARGET_HANDLES.find(t => t.id === id) || TARGET_HANDLES[0];
}

export function getTargetByHandle(handle) {
  const cleanHandle = handle.replace('@', '').toLowerCase();
  return TARGET_HANDLES.find(t => t.handle.toLowerCase() === cleanHandle);
}
