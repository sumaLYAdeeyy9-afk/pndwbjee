// The 10 Official Distinct Tweet Variations for WBJEE Decentralized Counseling Protest
// All tweets are strictly below the 280-character limit for instant 1-click posting on X (Twitter).

export const TWEET_TEMPLATES = [
  {
    id: 'tweet-1',
    title: '1. The "Mid-Game Rule Shift" Angle',
    tag: 'Mid-Game Shift',
    text: `Changing rules after admissions is unfair! WBJEEB's Aug 27 notice barring admitted students from Decentralized Counseling ruins branch upgrades. @SuvenduWB & @basu_bratya please intervene! @abpanandatv @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-2',
    title: '2. The "Historical Precedent" Angle',
    tag: 'Precedent',
    text: `Historically, Decentralized Counseling was ALWAYS open for upgrades. WBJEEB's sudden Aug 27 notice penalizes students who took early admission! @SuvenduWB @basu_bratya please restore our rights! @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-3',
    title: '3. The "Trapped in Seats" Angle',
    tag: 'Trapped in Seats',
    text: `Thousands of WBJEE students are now trapped in locked seats because WBJEEB abruptly barred admitted candidates from Decentralized Counseling. This is unjust! @SuvenduWB @basu_bratya revoke this notice! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-4',
    title: '4. The "Mental Agony" Angle',
    tag: 'Mental Agony',
    text: `WBJEE rankers are in severe distress! Snatched branch upgrade rights via the Aug 27 notice punish merit. @SuvenduWB & Education Minister @basu_bratya, we urgently appeal for your intervention! @abpanandatv @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-5',
    title: '5. The "Direct Appeal" Angle',
    tag: 'Direct Appeal',
    text: `Hon'ble Leaders @SuvenduWB & @basu_bratya, future of engineering students is at stake. WBJEEB's sudden Aug 27 notice restricts DC and blocks university upgrades. Please intervene! @abpanandatv #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-6',
    title: '6. The "Merit Ignored" Angle',
    tag: 'Merit Ignored',
    text: `Merit is being punished! Early admitted WBJEE rankers are blocked from DC upgrades, leaving premier university seats vacant or to lower ranks. @SuvenduWB @basu_bratya please fix this! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-7',
    title: '7. The "University Upgrade" Angle',
    tag: 'University Upgrade',
    text: `Decentralized Counseling is the only path to upgrade branches at JU, CU & KGEC. WBJEEB's Aug 27 notice destroys this right. We demand justice! @SuvenduWB @basu_bratya @abpanandatv #WBJEE2026 #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-8',
    title: '8. The "Short & Punchy" Angle',
    tag: 'Short & Punchy',
    text: `You can't change the rules mid-way! WBJEEB must revoke the Aug 27 notice barring admitted students from Decentralized Counseling. @SuvenduWB @basu_bratya protect our future! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-9',
    title: '9. The "Transparency" Angle',
    tag: 'Transparency',
    text: `A sudden Aug 27 notice changing WBJEE counseling rules lacks fairness. Admitted students deserve their historical right to Decentralized Counseling. @SuvenduWB @basu_bratya we seek your help! @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-10',
    title: '10. The "Collective Voice" Angle',
    tag: 'Collective Voice',
    text: `Thousands of WBJEE 2026 students stand united! We demand revocation of the Aug 27 notice and restoration of branch upgrades in Decentralized Counseling. @SuvenduWB @basu_bratya hear our plea! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  }
];

export function getRandomTweet() {
  const index = Math.floor(Math.random() * TWEET_TEMPLATES.length);
  return { tweet: TWEET_TEMPLATES[index], index };
}

export function buildTweetIntentUrl(text) {
  const params = new URLSearchParams({
    text: text
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
