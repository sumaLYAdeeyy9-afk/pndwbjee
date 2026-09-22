const fs = require('fs');
const path = require('path');

const openers = [
  'Years of preparation and sleepless nights are going in vain for WBJEE aspirants.',
  'Thousands of deserving students in West Bengal are suffering due to counselling delays.',
  'Middle class families put everything into our education, but the admission system is failing us.',
  'Meritorious engineering aspirants are watching their dream college seats slip away unfairly.',
  'Government engineering colleges are sitting on vacant seats while genuine candidates wait.',
  'The current decentralized online portal has completely frozen seat upgrades across universities.',
  'Students who secured good ranks are stranded without seats due to faulty online allotment.',
  'Our future is hanging by a thread because of flaws in the decentralized admission process.',
  'Sincere appeal from thousands of WBJEE aspirants whose hard work is being ignored.',
  'Hardworking students across Bengal are losing their academic year to technical mismanagement.',
  'College admissions should be based on pure merit, not on a flawed online portal.',
  'Deserving students are left helpless while seats in premier state institutes remain empty.',
  'We have worked tirelessly for years, only to face a broken seat distribution system.',
  'Please listen to the voice of thousands of students whose careers are at severe risk.',
  'The ongoing admission paralysis in West Bengal engineering colleges needs immediate action.',
  'Transparent on-campus spot rounds are desperately needed to save our engineering seats.',
  'Students who took admission in early rounds are being unfairly penalized and locked out.',
  'A broken computer algorithm cannot replace transparent on-campus physical counselling.',
  'Every single vacant seat in state universities represents a destroyed student dream.',
  'The mental pressure on engineering aspirants across Bengal has reached a breaking point.',
  'Bengal youth deserve fair admission opportunities after rigorous entrance preparation.',
  'Public universities built with taxpayers money should not keep classrooms empty.',
  'Online allotment errors are driving qualified students into deep anxiety and despair.',
  'Merit is being suppressed because decentralized online rounds fail to move vacancies.',
  'Thousands of engineering seats will go waste if physical spot rounds are not allowed.'
];

const middles = [
  'Multiple seat blocking is choking the system, stopping vacancies from moving down.',
  'Deserving candidates are locked out while seats remain unoccupied in top branches.',
  'Online DCAP has proven ineffective, taking weeks without moving waiting lists.',
  'Candidates get multiple allocations at once, leaving genuine students stranded.',
  'Premier departments in state universities will stay empty without physical rounds.',
  'Students are denied fair upgrades because the online process does not slide seats.',
  'Lack of physical spot admissions has created complete stagnation in colleges.',
  'Talented students face losing a whole year due to non-transparent online rounds.',
  'Seats funded by public resources are sitting idle instead of educating engineers.',
  'No candidate should suffer career loss due to portal-level algorithmic flaws.',
  'Flawed portal logic allows seats to be held while real applicants wait outside.',
  'State colleges are seeing historic vacancy rates due to repeated online delays.'
];

const pleas = [
  'We humbly request an open offline spot counselling round for all candidates.',
  'Please support our urgent demand for physical on-campus spot counselling.',
  'An open offline spot round is the only transparent way to fill every seat on merit.',
  'Kindly amplify our petition so authorities conduct on-campus spot admissions.',
  'Please intervene and direct state universities to hold fair offline spot rounds.',
  'We urge the Higher Education Dept to permit universal offline spot counselling.',
  'Holding open physical spot rounds will ensure every vacancy is filled fairly.',
  'Save our academic year by allowing open on-campus spot counselling.',
  'Please stand with students and help us get transparent offline spot admissions.',
  'Our only hope is an open physical spot round where genuine merit is respected.',
  'Kindly raise our voice so authorities conduct physical spot admissions immediately.',
  'Please help us ensure that not a single government engineering seat is wasted.'
];

const list = [];
const set = new Set();

for (let o of openers) {
  for (let m of middles) {
    for (let p of pleas) {
      const text = `${o} ${m} ${p} #JusticeForWBJEE`;
      if (text.length <= 278 && !set.has(text)) {
        set.add(text);
        list.push(text);
        if (list.length === 200) break;
      }
    }
    if (list.length === 200) break;
  }
  if (list.length === 200) break;
}

console.log('Total generated distinct messages:', list.length);
console.log('All unique check:', new Set(list).size === 200);
console.log('All lengths <= 280 check:', list.every(t => t.length <= 280));
console.log('Max length:', Math.max(...list.map(t => t.length)));
console.log('Min length:', Math.min(...list.map(t => t.length)));

const targetFile = path.join(__dirname, '..', 'src', 'data', 'dynamicReplyGenerator.js');

const fileContent = `// 200 Unique Humanized Message Variations for WBJEE 2026 Strike Hub
// RULES ENFORCED:
// 1. Mandatory Hashtag: #JusticeForWBJEE on every post
// 2. Length strictly <= 280 characters
// 3. No bot keywords, no @ tags in body, no rank/GMR numbers
// 4. Human, emotional, urgent student appeals for offline spot counselling

export const MESSAGES_200 = ${JSON.stringify(list, null, 2)};

export const MANDATORY_HASHTAG = '#JusticeForWBJEE';

/**
 * Returns a randomized unique humanized post from the 200 curated messages
 */
export function generateUniqueReply() {
  const index = Math.floor(Math.random() * MESSAGES_200.length);
  const text = MESSAGES_200[index];
  return {
    index: index + 1,
    text: text,
    charCount: text.length
  };
}

/**
 * Returns all 200 distinct message variations
 */
export function getAll200Messages() {
  return MESSAGES_200;
}
`;

fs.writeFileSync(targetFile, fileContent, 'utf8');
console.log('Successfully wrote 200 messages to:', targetFile);
