// Target Handles Database for WBJEE 2026 Strike Hub
// High-Profile Targets across Journalists, Legal/Education Advocates, Youth Leaders, and Politicians

export const TARGET_CATEGORIES = [
  { id: 'all', label: 'All Targets', icon: '⚡' },
  { id: 'journalist', label: 'Journalists & Media', icon: '📰' },
  { id: 'advocate', label: 'Advocates & RTI Activists', icon: '⚖️' },
  { id: 'student', label: 'Student & Youth Leaders', icon: '✊' },
  { id: 'politician', label: 'Politicians & Leaders', icon: '🏛️' },
];

export const TARGET_HANDLES = [
  // 1. Journalists & Media
  {
    id: 'target-1',
    name: 'Tamal Saha',
    handle: 'Tamal0401',
    category: 'journalist',
    role: 'Journalist / Ground Reporter',
    priority: 'high',
    bio: 'Extensively covers West Bengal politics, youth grievances, and education ground reality.',
    tags: ['Media', 'Bengal', 'Ground']
  },
  {
    id: 'target-2',
    name: 'Snigdhendu Bhattacharya',
    handle: 'snigspeak',
    category: 'journalist',
    role: 'Journalist & Author',
    priority: 'high',
    bio: 'Senior journalist & author writing on socio-political affairs and institutional policies.',
    tags: ['Media', 'Author', 'Analysis']
  },
  {
    id: 'target-3',
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
    id: 'target-7',
    name: 'Pooja Mehta',
    handle: 'pooja_news',
    category: 'journalist',
    role: 'Special Correspondent',
    priority: 'medium',
    bio: 'Broadcast journalist reporting on key developments in eastern India.',
    tags: ['Media', 'Broadcast']
  },
  {
    id: 'target-8',
    name: 'Indrajit Kundu',
    handle: 'iindrojit',
    category: 'journalist',
    role: 'Associate Editor',
    priority: 'high',
    bio: 'Senior reporter & editor covering policy, politics, and civic protests in Bengal.',
    tags: ['Media', 'Editor']
  },
  {
    id: 'target-9',
    name: 'Manogya Loiwal',
    handle: 'manogyaloiwal',
    category: 'journalist',
    role: 'Senior Editor & TV Anchor',
    priority: 'high',
    bio: 'National television editor with massive reach across student & citizen issues.',
    tags: ['Media', 'Editor', 'National']
  },
  {
    id: 'target-10',
    name: 'Ritayan Basu',
    handle: 'ritayanbasu',
    category: 'journalist',
    role: 'Senior News Reporter',
    priority: 'medium',
    bio: 'Digital news editor covering Bengal public interest issues.',
    tags: ['Media', 'Digital']
  },



  // 2. Education Advocates & RTI Activists
  {
    id: 'target-15',
    name: 'Saurav Das',
    handle: 'SauravDassss',
    category: 'advocate',
    role: 'Investigative Journalist & Commentator',
    priority: 'high',
    bio: 'RTI activist and legal transparency researcher exposing institutional flaws.',
    tags: ['Advocate', 'RTI', 'Transparency']
  },
  {
    id: 'target-16',
    name: 'Adv. Anubha Shrivastava Sahai',
    handle: 'anubha1812',
    category: 'advocate',
    role: 'Supreme Court Lawyer & Education Activist',
    priority: 'critical',
    bio: 'President of India Wide Parents Association (IWPA); premier national voice against admission irregularities.',
    tags: ['Advocate', 'Legal', 'SupremeCourt']
  },
  {
    id: 'target-17',
    name: 'Dr. Vivek Pandey',
    handle: 'Vivekpandey21',
    category: 'advocate',
    role: 'RTI Activist & Healthcare/Education Advocate',
    priority: 'critical',
    bio: 'Prominent national RTI activist fighting exam delays, seat blocking, and counselling malpractice.',
    tags: ['Advocate', 'RTI', 'StudentRights']
  },
  {
    id: 'target-18',
    name: 'Adv. Alok Srivastava',
    handle: 'AlokSrivastava',
    category: 'advocate',
    role: 'Advocate on Record, Supreme Court',
    priority: 'high',
    bio: 'Leading legal counsel championing student fundamental rights and transparent entrance procedures.',
    tags: ['Advocate', 'Legal']
  },

  // 3. Student & Youth Leaders
  {
    id: 'target-19',
    name: 'Abhijeet Dipke',
    handle: 'abhijeet_dipke',
    category: 'student',
    role: 'Youth Activist & Founder, CJP',
    priority: 'critical',
    bio: 'Founder of Cockroach Janta Party (CJP); leading viral youth digital protests and student rights campaigns.',
    tags: ['Youth', 'DigitalActivist', 'CJP', 'Viral']
  },
  {
    id: 'target-20',
    name: 'Cockroach Janta Party (CJP)',
    handle: 'CJP_2029',
    category: 'student',
    role: 'Viral Youth Digital Movement',
    priority: 'critical',
    bio: 'Viral Gen-Z youth movement advocating for student welfare, fair exams, and institutional accountability.',
    tags: ['Youth', 'Movement', 'CJP', 'Students']
  },
  {
    id: 'target-21',
    name: 'Aishe Ghosh',
    handle: 'aishe_ghosh',
    category: 'student',
    role: 'Student & Youth Activist',
    priority: 'high',
    bio: 'Former JNUSU President & youth activist championing democratic education policies.',
    tags: ['StudentLeader', 'Youth']
  },
  {
    id: 'target-22',
    name: 'Mayukh Biswas',
    handle: 'MayukhSFI',
    category: 'student',
    role: 'Student & Youth Leader',
    priority: 'high',
    bio: 'National leadership in student rights movement, higher education accessibility.',
    tags: ['StudentLeader', 'National']
  },
  {
    id: 'target-23',
    name: 'Minakshi Mukherjee',
    handle: 'MinakshiMukher4',
    category: 'student',
    role: 'Youth & Mass Movement Leader',
    priority: 'critical',
    bio: 'Leading massive grassroots youth mobilizations across West Bengal.',
    tags: ['StudentLeader', 'Youth', 'Grassroots']
  },
  {
    id: 'target-24',
    name: 'Srijan Bhattacharyya',
    handle: 'SrijanCPIM',
    category: 'student',
    role: 'Youth Leader & Public Speaker',
    priority: 'high',
    bio: 'Articulate spokesperson on West Bengal youth unemployment and engineering education crisis.',
    tags: ['StudentLeader', 'Youth']
  },
  {
    id: 'target-25',
    name: 'Dipsita Dhar',
    handle: 'DipsitaDhar',
    category: 'student',
    role: 'Student & Youth Leader',
    priority: 'high',
    bio: 'PhD scholar and prominent student activist fighting for transparent entrance exams.',
    tags: ['StudentLeader', 'Research']
  },
  {
    id: 'target-26',
    name: 'Shatarup Ghosh',
    handle: 'ShatarupGhosh',
    category: 'student',
    role: 'Political Commentator & Youth Voice',
    priority: 'high',
    bio: 'Viral political communicator with extensive reach among college graduates and youth.',
    tags: ['Commentator', 'Youth']
  },

  // 4. Politicians & Decision Makers
  {
    id: 'target-27',
    name: 'Suvendu Adhikari',
    handle: 'SuvenduWB',
    category: 'politician',
    role: 'Senior Leader & MLA, WB',
    priority: 'critical',
    bio: 'Massive digital reach; frequently amplifies West Bengal governance and student grievances.',
    tags: ['Politician', 'MLA', 'WB']
  },
  {
    id: 'target-28',
    name: 'Kunal Ghosh',
    handle: 'KunalGhoshAgain',
    category: 'politician',
    role: 'Spokesperson & State General Secretary',
    priority: 'critical',
    bio: 'Extremely active respondent on X; routinely intervenes in public grievances.',
    tags: ['Politician', 'Spokesperson', 'Active']
  },
  {
    id: 'target-29',
    name: 'Saket Gokhale',
    handle: 'SaketGokhale',
    category: 'politician',
    role: 'Member of Parliament, Rajya Sabha',
    priority: 'high',
    bio: 'Focuses on institutional transparency, administrative audits, and RTI accountability.',
    tags: ['Politician', 'MP', 'RajyaSabha']
  },
  {
    id: 'target-30',
    name: 'Derek O\'Brien',
    handle: 'derekobrienmp',
    category: 'politician',
    role: 'Leader in Rajya Sabha',
    priority: 'medium',
    bio: 'Parliamentary leader and public communicator on governance reforms.',
    tags: ['Politician', 'MP']
  },
  {
    id: 'target-31',
    name: 'Mohammed Salim',
    handle: 'salimdotcomrade',
    category: 'politician',
    role: 'State Secretary & Former MP',
    priority: 'high',
    bio: 'Senior leader consistently raising institutional recruitment & entrance anomalies.',
    tags: ['Politician', 'Leadership']
  },
  {
    id: 'target-32',
    name: 'Dr. Sukanta Majumdar',
    handle: 'DrSukantaBJP',
    category: 'politician',
    role: 'Union Minister of State & MP',
    priority: 'high',
    bio: 'Union MoS for Education / Development; former college professor understanding academic admissions.',
    tags: ['Politician', 'UnionMinister', 'MP']
  },
  {
    id: 'target-33',
    name: 'Agnimitra Paul',
    handle: 'paulagnimitra1',
    category: 'politician',
    role: 'MLA & State General Secretary',
    priority: 'high',
    bio: 'Vocal legislator protesting against state administrative inefficiencies.',
    tags: ['Politician', 'MLA']
  },
  {
    id: 'target-34',
    name: 'Amit Malviya',
    handle: 'amitmalviya',
    category: 'politician',
    role: 'National IT & Communications In-charge',
    priority: 'high',
    bio: 'National amplification of West Bengal governance and student policy issues.',
    tags: ['Politician', 'National']
  }
];

export function getTargetById(id) {
  return TARGET_HANDLES.find(t => t.id === id) || TARGET_HANDLES[0];
}

export function getTargetByHandle(handle) {
  const cleanHandle = handle.replace('@', '').toLowerCase();
  return TARGET_HANDLES.find(t => t.handle.toLowerCase() === cleanHandle);
}
