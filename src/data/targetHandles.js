// Target Handles Database for WBJEE 2026 Decentralized Counselling Strike Hub
// 41 High-Profile Targets across Journalists, Legal/Education Advocates, Student Leaders, and Key Politicians

export const TARGET_CATEGORIES = [
  { id: 'all', label: 'All Targets', icon: '⚡', count: 41 },
  { id: 'journalist', label: 'Journalists & Media', icon: '📰', count: 14 },
  { id: 'advocate', label: 'Advocates & RTI Activists', icon: '⚖️', count: 4 },
  { id: 'student', label: 'Student & Youth Leaders', icon: '✊', count: 8 },
  { id: 'politician', label: 'Politicians & Decision Makers', icon: '🏛️', count: 15 },
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
    id: 'target-4',
    name: 'Suman De',
    handle: 'SumanDe16',
    category: 'journalist',
    role: 'Senior Executive Editor & Anchor',
    priority: 'high',
    bio: 'Chief editor & prime-time anchor leading major news discourse in Bengal.',
    tags: ['Media', 'Editor', 'Lead']
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
    name: 'Suryagni Roy',
    handle: 'suryagniroy',
    category: 'journalist',
    role: 'Senior Special Correspondent',
    priority: 'high',
    bio: 'Investigative reporting and rapid coverage of breaking regional affairs.',
    tags: ['Media', 'Correspondent']
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
  {
    id: 'target-11',
    name: 'Anindya Sengupta',
    handle: 'anindya_sengupta',
    category: 'journalist',
    role: 'Senior Journalist',
    priority: 'medium',
    bio: 'Education and civic governance news contributor.',
    tags: ['Media']
  },
  {
    id: 'target-12',
    name: 'Prakash Sinha',
    handle: 'PrakashSinhaNews',
    category: 'journalist',
    role: 'Special Crime & Policy Reporter',
    priority: 'medium',
    bio: 'Investigative reporter tracking administrative irregularities.',
    tags: ['Media', 'Investigative']
  },
  {
    id: 'target-13',
    name: 'Kamalesh Bhattacharya',
    handle: 'kamalesh_bhatt',
    category: 'journalist',
    role: 'Senior Education Correspondent',
    priority: 'medium',
    bio: 'Specialist in West Bengal secondary and higher education counselling policies.',
    tags: ['Media', 'Education']
  },
  {
    id: 'target-14',
    name: 'Anupam Mishra',
    handle: 'anupammishra_tv',
    category: 'journalist',
    role: 'Senior TV Journalist',
    priority: 'medium',
    bio: 'Broadcaster highlighting student concerns and administrative updates.',
    tags: ['Media', 'Broadcast']
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
    handle: 'Dr_Vivek_pandey',
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
    name: 'Aishe Ghosh',
    handle: 'aishe_ghosh',
    category: 'student',
    role: 'Student & Youth Activist',
    priority: 'high',
    bio: 'Former JNUSU President & youth activist championing democratic education policies.',
    tags: ['StudentLeader', 'Youth']
  },
  {
    id: 'target-20',
    name: 'Mayukh Biswas',
    handle: 'MayukhSFI',
    category: 'student',
    role: 'Student & Youth Leader',
    priority: 'high',
    bio: 'National leadership in student rights movement, higher education accessibility.',
    tags: ['StudentLeader', 'National']
  },
  {
    id: 'target-21',
    name: 'Minakshi Mukherjee',
    handle: 'MinakshiMukher4',
    category: 'student',
    role: 'Youth & Mass Movement Leader',
    priority: 'critical',
    bio: 'Leading massive grassroots youth mobilizations across West Bengal.',
    tags: ['StudentLeader', 'Youth', 'Grassroots']
  },
  {
    id: 'target-22',
    name: 'Srijan Bhattacharyya',
    handle: 'SrijanCPIM',
    category: 'student',
    role: 'Youth Leader & Public Speaker',
    priority: 'high',
    bio: 'Articulate spokesperson on West Bengal youth unemployment and engineering education crisis.',
    tags: ['StudentLeader', 'Youth']
  },
  {
    id: 'target-23',
    name: 'Dipsita Dhar',
    handle: 'DipsitaDhar',
    category: 'student',
    role: 'Student & Youth Leader',
    priority: 'high',
    bio: 'PhD scholar and prominent student activist fighting for transparent entrance exams.',
    tags: ['StudentLeader', 'Research']
  },
  {
    id: 'target-24',
    name: 'Shatarup Ghosh',
    handle: 'ShatarupGhosh',
    category: 'student',
    role: 'Political Commentator & Youth Voice',
    priority: 'high',
    bio: 'Viral political communicator with extensive reach among college graduates and youth.',
    tags: ['Commentator', 'Youth']
  },
  {
    id: 'target-25',
    name: 'Pratikur Rahaman',
    handle: 'Pratikur_SFI',
    category: 'student',
    role: 'Student Leader',
    priority: 'high',
    bio: 'Ground student organizer advocating for state university decentralized rounds.',
    tags: ['StudentLeader']
  },
  {
    id: 'target-26',
    name: 'Trinankur Bhattacharjee',
    handle: 'Trinankur_AITC',
    category: 'student',
    role: 'TMCP State President',
    priority: 'critical',
    bio: 'Ruling state student organization president; direct line of influence to Higher Education Dept.',
    tags: ['StudentLeader', 'TMCP', 'StatePresident']
  },

  // 4. Politicians & Decision Makers
  {
    id: 'target-27',
    name: 'Bratya Basu',
    handle: 'basu_bratya',
    category: 'politician',
    role: 'Minister for Higher Education, WB',
    priority: 'critical',
    bio: 'Minister in charge of WB Higher Education Dept & overseeing WBJEE Board policies.',
    tags: ['Authority', 'EducationMinister', 'WBGov']
  },
  {
    id: 'target-28',
    name: 'Suvendu Adhikari',
    handle: 'SuvenduWB',
    category: 'politician',
    role: 'Leader of Opposition, WB Assembly',
    priority: 'critical',
    bio: 'Massive digital reach; frequently amplifies West Bengal governance and student grievances.',
    tags: ['Politician', 'LeaderOfOpposition']
  },
  {
    id: 'target-29',
    name: 'Abhishek Banerjee',
    handle: 'abhishekaitc',
    category: 'politician',
    role: 'Member of Parliament & General Secretary',
    priority: 'critical',
    bio: 'Highest leadership tier; critical for urgent state policy interventions.',
    tags: ['Politician', 'MP', 'Leadership']
  },
  {
    id: 'target-30',
    name: 'Kunal Ghosh',
    handle: 'KunalGhoshAgain',
    category: 'politician',
    role: 'Spokesperson & State General Secretary',
    priority: 'critical',
    bio: 'Extremely active respondent on X; routinely intervenes in public grievances.',
    tags: ['Politician', 'Spokesperson', 'Active']
  },
  {
    id: 'target-31',
    name: 'Debangshu Bhattacharya',
    handle: 'ItsYourDev',
    category: 'politician',
    role: 'State Youth Leader & Spokesperson',
    priority: 'high',
    bio: 'Youth face of ruling party with strong daily engagement on student discourse.',
    tags: ['Politician', 'Youth']
  },
  {
    id: 'target-32',
    name: 'Saayoni Ghosh',
    handle: 'sayani06',
    category: 'politician',
    role: 'Member of Parliament & Youth President',
    priority: 'high',
    bio: 'MP & State Youth wing president vocal on candidate welfare.',
    tags: ['Politician', 'MP', 'Youth']
  },
  {
    id: 'target-33',
    name: 'Sudip Raha',
    handle: 'SudipRaha_',
    category: 'politician',
    role: 'State Youth General Secretary',
    priority: 'high',
    bio: 'Youth spokesperson actively tracking education updates in Kolkata.',
    tags: ['Politician', 'Youth']
  },
  {
    id: 'target-34',
    name: 'Saket Gokhale',
    handle: 'SaketGokhale',
    category: 'politician',
    role: 'Member of Parliament, Rajya Sabha',
    priority: 'high',
    bio: 'Focuses on institutional transparency, administrative audits, and RTI accountability.',
    tags: ['Politician', 'MP', 'RajyaSabha']
  },
  {
    id: 'target-35',
    name: 'Derek O\'Brien',
    handle: 'derekobrienmp',
    category: 'politician',
    role: 'Leader in Rajya Sabha',
    priority: 'medium',
    bio: 'Parliamentary leader and public communicator on governance reforms.',
    tags: ['Politician', 'MP']
  },
  {
    id: 'target-36',
    name: 'Mohammed Salim',
    handle: 'MdSalimKolkata',
    category: 'politician',
    role: 'State Secretary & Former MP',
    priority: 'high',
    bio: 'Senior opposition leader consistently raising institutional recruitment & entrance anomalies.',
    tags: ['Politician', 'Opposition']
  },
  {
    id: 'target-37',
    name: 'Dr. Sukanta Majumdar',
    handle: 'DrSukantaBJP',
    category: 'politician',
    role: 'Union Minister of State & MP',
    priority: 'high',
    bio: 'Union MoS for Education / Development; former college professor understanding academic admissions.',
    tags: ['Politician', 'UnionMinister', 'MP']
  },
  {
    id: 'target-38',
    name: 'Agnimitra Paul',
    handle: 'paulagnimitra1',
    category: 'politician',
    role: 'MLA & State General Secretary',
    priority: 'high',
    bio: 'Vocal legislator protesting against state administrative inefficiencies.',
    tags: ['Politician', 'MLA']
  },
  {
    id: 'target-39',
    name: 'Amit Malviya',
    handle: 'amitmalviya',
    category: 'politician',
    role: 'National IT & Communications In-charge',
    priority: 'high',
    bio: 'National amplification of West Bengal governance and student policy issues.',
    tags: ['Politician', 'National']
  },
  {
    id: 'target-40',
    name: 'Dharmendra Pradhan',
    handle: 'dpradhanbjp',
    category: 'politician',
    role: 'Cabinet Minister for Education, Govt of India',
    priority: 'high',
    bio: 'Union Minister overseeing higher education standards across states.',
    tags: ['Politician', 'UnionMinister', 'Cabinet']
  },
  {
    id: 'target-41',
    name: 'Pralhad Joshi',
    handle: 'JoshiPralhad',
    category: 'politician',
    role: 'Union Cabinet Minister',
    priority: 'medium',
    bio: 'Union Cabinet Minister for Consumer Affairs and Public Affairs.',
    tags: ['Politician', 'UnionMinister']
  }
];

export function getTargetById(id) {
  return TARGET_HANDLES.find(t => t.id === id) || TARGET_HANDLES[0];
}

export function getTargetByHandle(handle) {
  const cleanHandle = handle.replace('@', '').toLowerCase();
  return TARGET_HANDLES.find(t => t.handle.toLowerCase() === cleanHandle);
}
