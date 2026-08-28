// The 10 Official Distinct Tweet Variations for WBJEE Decentralized Counseling Protest
// Target: @SuvenduWB, Media (@abpanandatv, @Zee24Ghanta), and Protest Hashtags.
// All tweets are strictly below the 280-character limit for instant 1-click posting on X (Twitter).

export const TWEET_TEMPLATES = [
  {
    id: 'tweet-1',
    title: '1. The "Mid-Game Rule Shift" Angle',
    tag: 'Mid-Game Shift',
    text: `Changing rules after admissions is unfair! WBJEEB's Aug 27 notice barring admitted students from Decentralized Counseling ruins branch upgrades. @SuvenduWB please raise our voice! @abpanandatv @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-2',
    title: '2. The "Historical Precedent" Angle',
    tag: 'Precedent',
    text: `Historically, Decentralized Counseling was ALWAYS open for upgrades. WBJEEB's sudden Aug 27 notice penalizes students who took early admission! @SuvenduWB please stand with WB students & raise this! @abpanandatv #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-3',
    title: '3. The "Trapped in Seats" Angle',
    tag: 'Trapped in Seats',
    text: `Thousands of WBJEE students are now trapped in locked seats because WBJEEB abruptly barred admitted candidates from Decentralized Counseling. This is unjust! @SuvenduWB please intervene for justice! @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-4',
    title: '4. The "Mental Agony" Angle',
    tag: 'Mental Agony',
    text: `WBJEE rankers are facing extreme distress! Snatched branch upgrade rights via the Aug 27 notice punish merit. @SuvenduWB, we urgently appeal for your support to challenge this injustice! @abpanandatv @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-5',
    title: '5. The "Direct Appeal" Angle',
    tag: 'Direct Appeal',
    text: `@SuvenduWB, the academic future of WB engineering students is in jeopardy! WBJEEB's sudden Aug 27 notice restricts DC & blocks university branch upgrades. Please help us! @abpanandatv @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-6',
    title: '6. The "Merit Ignored" Angle',
    tag: 'Merit Ignored',
    text: `Merit is being penalized! Early admitted WBJEE rankers are blocked from DC upgrades, leaving premier university seats vacant or given to lower ranks. @SuvenduWB please fight for student merit! @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-7',
    title: '7. The "University Upgrade" Angle',
    tag: 'University Upgrade',
    text: `Decentralized Counseling is the only path to upgrade branches at JU, CU & KGEC. WBJEEB's Aug 27 notice destroys this right. We demand justice! @SuvenduWB @abpanandatv @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-8',
    title: '8. The "Short & Punchy" Angle',
    tag: 'Short & Punchy',
    text: `You cannot change the rules of the match mid-way! WBJEEB must revoke the Aug 27 notice barring admitted students from Decentralized Counseling. @SuvenduWB please protect student futures! @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-9',
    title: '9. The "Transparency" Angle',
    tag: 'Transparency',
    text: `A sudden Aug 27 notice changing WBJEE counseling rules lacks basic fairness. Admitted students deserve their historical right to Decentralized Counseling. @SuvenduWB we seek your help! @abpanandatv #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-10',
    title: '10. The "Collective Voice" Angle',
    tag: 'Collective Voice',
    text: `Thousands of WBJEE 2026 students stand united against the arbitrary Aug 27 notice. We demand our right to branch upgrades in Decentralized Counseling. @SuvenduWB hear our plea! @Zee24Ghanta #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  }
];

export function getRandomTweet() {
  const index = Math.floor(Math.random() * TWEET_TEMPLATES.length);
  return { tweet: TWEET_TEMPLATES[index], index };
}

/**
 * Deep links directly into the installed X (Twitter) App on Android / iOS
 */
export function buildTwitterAppUrl(text) {
  return `twitter://post?message=${encodeURIComponent(text)}`;
}

/**
 * Web browser fallback intent for desktop / browser
 */
export function buildTweetIntentUrl(text) {
  const params = new URLSearchParams({
    text: text
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
