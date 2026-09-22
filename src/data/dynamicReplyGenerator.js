// Dynamic Anti-Spam Reply Generator for WBJEE 2026 Strike Hub
// Strictly grounded in the Official Student Petition:
// 1. Multiple Allocation Bottleneck (Unordered simultaneous allotments causing ghost seat blocking)
// 2. Absence of Real-Time Sliding (Discrete batch reallocations keep seats locked for days)
// 3. Merit Violation via Phase 3 Lockout of Phase 1 Admitted Candidates
// 4. Stagnation: Negligible vacancy decrease after Phase 1 / Phase 2 Round 1
// 5. Actionable Prayer: Terminate Online DCAP after Phase 2 & Conduct Universal OFFLINE Spot Counselling with Real-Time Sliding
// 6. Alternative Proposal: Strict descending preference single allocation CAP
// RULE: NO @ tags in generated text to bypass X spam/bot filters.

export const GRIEVANCE_ANGLES = [
  {
    id: 'angle-1',
    name: '1. Multiple Allocation Bottleneck',
    summary: 'Unordered simultaneous allotments causing ghost seat blocking.',
    hooks: [
      'Flaw in WBJEE 2026 Online DCAP:',
      'Urgent WBJEE 2026 admission crisis:',
      'Multiple allocation flaw in WBJEE:'
    ],
    bodies: [
      'Unordered choices give top ranks multiple simultaneous seats with zero intent to admit, blocking thousands of seats.',
      'Without descending priority order, top rankers hold multiple seats at once, freezing genuine admissions.',
      'Ghost seat blocking from unordered multiple allocations has paralyzed state engineering admissions.'
    ],
    demands: [
      'Scrap Online DC after Phase 2 & conduct Universal OFFLINE Spot Counselling.',
      'We demand immediate Offline Spot Round with real-time sliding at college campuses.'
    ],
    hashtags: '#WBJEEOfflineDC #WBJEE2026'
  },
  {
    id: 'angle-2',
    name: '2. Absence of Real-Time Sliding',
    summary: 'Discrete batch reallocations keep seats locked for days.',
    hooks: [
      'Technical flaw in WBJEE 2026 DCAP:',
      'Why WBJEE Online DC is failing:',
      'Stagnant WBJEE 2026 counselling:'
    ],
    bodies: [
      'Discrete online batches lock forfeited seats for days with zero instantaneous dynamic sliding for next-in-line rankers.',
      'Unlike offline rounds where forfeited seats cascade instantly, online batch rounds keep seats locked for weeks.'
    ],
    demands: [
      'Shift to Universal OFFLINE Spot Rounds with continuous real-time sliding.',
      'Conduct on-campus physical spot admissions at JU & state colleges now.'
    ],
    hashtags: '#WBJEEOfflineDC #StopSeatBlocking'
  },
  {
    id: 'angle-3',
    name: '3. Phase 3 Lockout & Merit Violation',
    summary: 'Phase 1 admitted students barred from Phase 3.',
    hooks: [
      'Merit violation in WBJEE 2026 DCAP:',
      'Arbitrary exclusion in WBJEE 2026:',
      'Unfair Phase 3 lockout of rankers:'
    ],
    bodies: [
      'Phase 1 admitted students are barred from Phase 3. Prime seats freed up later will go to lower ranks, violating merit.',
      'Locking Phase 1 admitted students out of Phase 3 unfairly gives top branches to lower-ranked applicants.'
    ],
    demands: [
      'Allow Universal OFFLINE Spot Counselling open to ALL rank holders equally.',
      'Stop Phase 3 lockout and restore open physical spot merit rounds.'
    ],
    hashtags: '#WBJEEOfflineDC #MeritViolation'
  },
  {
    id: 'angle-4',
    name: '4. Negligible Vacancy Decrease',
    summary: 'Vacancies reduced by only a tiny margin.',
    hooks: [
      'Severe stagnation in WBJEE admissions:',
      'Ground reality of WBJEE 2026 vacancies:',
      'Engineering seats stranded in Bengal:'
    ],
    bodies: [
      'Post Phase 1 & 2 Round 1, seat vacancy reduced by a negligible margin. Core branches across state colleges remain empty.',
      'Online DCAP is crawling at a dead pace with thousands of government engineering seats still unoccupied.'
    ],
    demands: [
      'End online DC after Phase 2 and conduct physical offline spot admissions immediately.',
      'We urge authorities & media to highlight this crisis and mandate offline spot rounds.'
    ],
    hashtags: '#WBJEEOfflineDC #ScrapOnlineDC'
  },
  {
    id: 'angle-5',
    name: '5. Actionable Prayer (Offline Spot)',
    summary: 'Terminate Online DC after Phase 2 & conduct Universal Offline Spot Round.',
    hooks: [
      'Our united prayer for WBJEE 2026:',
      'How to resolve the WBJEE DCAP mess:',
      'Urgent appeal to Higher Education Dept:'
    ],
    bodies: [
      '1. Terminate Online DCAP after Phase 2.\n2. Conduct Universal OFFLINE SPOT COUNSELLING with real-time sliding for all valid rankers at JU/CU/state colleges.',
      'Physical offline spot rounds eliminate multiple seat blocking and fill vacancies in hours instead of weeks.'
    ],
    demands: [
      'Please support our petition to restore offline spot admissions immediately.',
      'Approve Universal Offline Spot Round to protect the academic year of engineering aspirants.'
    ],
    hashtags: '#WBJEEOfflineDC #WBJEE2026'
  },
  {
    id: 'angle-6',
    name: '6. Alternative Single-Seat CAP Rule',
    summary: 'Enforce locked descending preference with single allocation.',
    hooks: [
      'Constructive reform for WBJEE Board:',
      'If online rounds continue in WBJEE:',
      'Technical fix for WBJEE 2026 portal:'
    ],
    bodies: [
      'If online DC continues, enforce locked descending preferences with SINGLE allocation and immediate debarment for unresponsiveness.',
      'Reverting to traditional CAP locked single allocation will instantly end ghost seat blocking.'
    ],
    demands: [
      'Enforce single-seat allocation CAP or conduct open Offline Spot rounds.',
      'Eliminate multiple-offer chaos to protect middle-rank merit.'
    ],
    hashtags: '#WBJEEOfflineDC #FixWBJEEPortal'
  }
];

/**
 * Generates a concise, high-impact draft under 220 characters
 * Guaranteed NO @ mentions
 */
export function generateUniqueReply(angleId = null) {
  const angle = angleId 
    ? GRIEVANCE_ANGLES.find(a => a.id === angleId) || GRIEVANCE_ANGLES[0]
    : GRIEVANCE_ANGLES[Math.floor(Math.random() * GRIEVANCE_ANGLES.length)];

  const hook = angle.hooks[Math.floor(Math.random() * angle.hooks.length)];
  const body = angle.bodies[Math.floor(Math.random() * angle.bodies.length)];
  const demand = angle.demands[Math.floor(Math.random() * angle.demands.length)];

  const personalPointers = [
    '[GMR rank / branch]',
    '[my dream college]',
    '[Phase 1 experience]'
  ];
  const pointer = personalPointers[Math.floor(Math.random() * personalPointers.length)];

  const fullText = `${hook} ${body} (Context: ${pointer}) ${demand} ${angle.hashtags}`;

  return {
    angleId: angle.id,
    angleTitle: angle.name,
    angleSummary: angle.summary,
    text: fullText,
    charCount: fullText.length
  };
}

/**
 * Checks if the user has modified/personalized the template text
 * Enforces anti-bot mandatory editing rule
 */
export function checkTextCustomized(originalText, currentText) {
  if (!currentText || currentText.trim().length < 30) {
    return {
      isValid: false,
      reason: 'Draft is too short. Please write your genuine concern.'
    };
  }

  // Check if user still has the placeholder in brackets
  const hasUneditedPlaceholder = currentText.includes('[GMR rank / branch]') ||
                                currentText.includes('[my dream college]') ||
                                currentText.includes('[Phase 1 experience]') ||
                                currentText.includes('[Add your custom') ||
                                currentText.includes('(Context: [');

  if (hasUneditedPlaceholder) {
    return {
      isValid: false,
      reason: 'Please replace the [bracketed placeholder] with your own rank, college, or words to unlock reply!'
    };
  }

  // Calculate simple edit difference
  const isIdentical = originalText.trim() === currentText.trim();
  if (isIdentical) {
    return {
      isValid: false,
      reason: 'Mandatory Customization: Please tweak a few words in your own voice to prevent X from flagging your account.'
    };
  }

  return {
    isValid: true,
    reason: 'Personalization Active! Ready to dispatch reply.'
  };
}
