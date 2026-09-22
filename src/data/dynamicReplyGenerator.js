// Dynamic Humanized Post Generator for WBJEE 2026 Strike Deck
// RULES:
// 1. Mandatory Hashtag: #JusticeForWBJEE on every post
// 2. NO GMR, RANK NUMBERS, OR BRANCHES
// 3. NO @ TAGS in body (to prevent bot triggers)
// 4. Human, emotional, urgent student appeals for offline spot counselling
// 5. Total length strictly <= 280 characters

export const HUMANIZED_TEMPLATES = [
  {
    id: 'human-1',
    theme: 'Future & Years of Hard Work',
    opener: 'Thousands of us worked hard for years, but the online counselling system has completely frozen seat allotments.',
    body: 'Government colleges are sitting with empty seats while deserving students are left in despair.',
    plea: 'We humbly urge you to raise our voice for an open offline spot counselling round.'
  },
  {
    id: 'human-2',
    theme: 'Multiple Seat Blocking Issue',
    opener: 'Because the online portal offers multiple seats to single candidates simultaneously, genuine admissions are completely blocked.',
    body: 'Seats that could change students lives are lying vacant across state universities.',
    plea: 'Please support our appeal to conduct physical spot rounds so every seat is filled fairly.'
  },
  {
    id: 'human-3',
    theme: 'Merit & Fairness',
    opener: 'Meritorious students across Bengal are suffering sleepless nights due to technical stagnation in online decentralized counselling.',
    body: 'The batch process takes weeks and fails to move vacancies down to deserving candidates.',
    plea: 'An on-campus offline spot admission is the only transparent solution left for us.'
  },
  {
    id: 'human-4',
    theme: 'Phase 3 Exclusion Crisis',
    opener: 'Students who took admission early in Phase 1 are being unfairly locked out from upgrading in later rounds.',
    body: 'This directly hurts merit while core engineering seats remain unoccupied.',
    plea: 'Please help us request authorities to permit universal offline spot counselling for all.'
  },
  {
    id: 'human-5',
    theme: 'Urgent Administrative Intervention',
    opener: 'Please look into the engineering admission crisis in West Bengal.',
    body: 'Even after Phase 1 and Phase 2, vacancies have barely reduced. A broken algorithm cannot replace real-time physical counselling.',
    plea: 'We desperately need an offline spot round to save our academic year.'
  },
  {
    id: 'human-6',
    theme: 'College Vacancies & Wasted Potential',
    opener: 'Prestigious government engineering seats in our state are at risk of going completely empty this year.',
    body: 'Online DCAP has proven to be ineffective, leaving hundreds of hardworking students helpless.',
    plea: 'Holding an open offline spot admission at college campuses will fill all seats in a single day.'
  },
  {
    id: 'human-7',
    theme: 'Student Mental Health & Anxiety',
    opener: 'The ongoing counselling delay and flawed seat distribution are taking a heavy mental toll on thousands of young aspirants.',
    body: 'We only ask for a fair and transparent chance to study in our state colleges.',
    plea: 'Kindly amplify our petition for immediate offline spot admissions.'
  },
  {
    id: 'human-8',
    theme: 'Direct Appeal to Leadership',
    opener: 'Respected authorities and leaders, our future is hanging by a thread.',
    body: 'The online seat matrix is completely stalled while genuine candidates wait helplessly.',
    plea: 'Please intervene and direct colleges to conduct universal offline spot rounds immediately.'
  }
];

export const HUMANIZED_OPENERS = [
  'Respected sir, please hear the plea of thousands of engineering aspirants in Bengal.',
  'Thousands of students worked tirelessly for years, but current online counselling is failing us.',
  'Please look into the serious counselling deadlock affecting students across West Bengal.',
  'Deserving students are losing their academic year because of flaws in the online seat allocation.',
  'We humbly appeal for your support regarding the ongoing admission crisis in state colleges.'
];

export const HUMANIZED_BODIES = [
  'Government engineering seats are sitting empty while candidates are blocked by duplicate online allocations.',
  'The online process takes weeks without moving vacancies, freezing seats that should go to genuine students.',
  'Meritorious candidates are stranded while vacant seats in top state colleges remain unfilled.',
  'The current system allows seats to be blocked without real-time sliding for students waiting in line.'
];

export const HUMANIZED_PLEAS = [
  'We desperately need authorities to conduct open offline spot counselling after Phase 2.',
  'Please help us urge the Higher Education Department to permit physical on-campus spot admissions.',
  'An offline spot round is the only fair and transparent way to fill every vacant seat immediately.',
  'Kindly amplify our appeal so no student is deprived of their rightful education.'
];

export const MANDATORY_HASHTAG = '#JusticeForWBJEE';

/**
 * Generates a humanized draft under 250 characters with #JusticeForWBJEE attached
 */
export function generateUniqueReply() {
  const template = HUMANIZED_TEMPLATES[Math.floor(Math.random() * HUMANIZED_TEMPLATES.length)];
  
  const useCurated = Math.random() > 0.4;
  
  let mainText = '';
  if (useCurated) {
    mainText = `${template.opener} ${template.body} ${template.plea}`;
  } else {
    const op = HUMANIZED_OPENERS[Math.floor(Math.random() * HUMANIZED_OPENERS.length)];
    const bd = HUMANIZED_BODIES[Math.floor(Math.random() * HUMANIZED_BODIES.length)];
    const pl = HUMANIZED_PLEAS[Math.floor(Math.random() * HUMANIZED_PLEAS.length)];
    mainText = `${op} ${bd} ${pl}`;
  }

  // Ensure total length with hashtag is under 275 chars
  let fullText = `${mainText.trim()} ${MANDATORY_HASHTAG}`;
  if (fullText.length > 275) {
    fullText = `${template.opener} ${template.plea} ${MANDATORY_HASHTAG}`;
  }

  return {
    templateId: template.id,
    theme: template.theme,
    text: fullText.trim(),
    charCount: fullText.trim().length
  };
}

/**
 * Validates that the user has slightly customized the text in their own voice
 */
export function checkTextCustomized(originalText, currentText) {
  if (!currentText || currentText.trim().length < 25) {
    return {
      isValid: false,
      reason: 'Please write a few words about your situation.'
    };
  }

  const isIdentical = originalText.trim() === currentText.trim();
  if (isIdentical) {
    return {
      isValid: false,
      reason: 'Please rephrase or edit a few words in the box to personalize your message.'
    };
  }

  return {
    isValid: true,
    reason: 'Message personalized! Ready to post on X.'
  };
}
