// The 10 Official Distinct Tweet Variations for WBJEE Decentralized Counseling Protest

export const TWEET_TEMPLATES = [
  {
    id: 'tweet-1',
    title: '1. The "Mid-Game Rule Shift" Angle',
    tag: 'Mid-Game Shift',
    text: `Changing the rules of counseling after admissions are over is completely unfair! WBJEEB’s Aug 27 notice barring admitted students from Decentralized Counseling ruins our upgrade chances. We need Hon'ble CM @SuvenduWB and @CMO_WB to intervene! @abpanandatv @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-2',
    title: '2. The "Historical Precedent" Angle',
    tag: 'Precedent',
    text: `We locked our seats trusting the historical precedent that WBJEE Decentralized Counseling allows branch upgrades. Now WBJEEB has abruptly revoked this right! This penalizes students who followed the rules. @SuvenduWB @CMO_WB please help us! @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-3',
    title: '3. The "Trapped in Seats" Angle',
    tag: 'Trapped in Seats',
    text: `Thousands of WBJEE students are now trapped in colleges or branches they wouldn't have finalized, all because WBJEEB suddenly barred admitted students from Decentralized Counseling. This is unjust! @SuvenduWB @CMO_WB please suspend this notice! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-4',
    title: '4. The "Mental Agony" Angle',
    tag: 'Mental Agony',
    text: `The immense mental pressure WBJEE students are facing right now is unjustified. We secured our ranks through hard work, only to have our branch upgrade options snatched away at the last minute. Hon'ble CM @SuvenduWB, we urgently need your intervention! @CMO_WB #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-5',
    title: '5. The "Direct Appeal" Angle',
    tag: 'Direct Appeal',
    text: `Hon'ble Chief Minister @SuvenduWB, the future of thousands of engineering students is at stake due to WBJEEB's sudden Aug 27 notification restricting Decentralized Counseling. We request your immediate intervention to restore our right to upgrade! @CMO_WB @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-6',
    title: '6. The "Merit Ignored" Angle',
    tag: 'Merit Ignored',
    text: `Merit is being punished! Students who secured good ranks and took early admissions are now blocked from upgrading in Decentralized Counseling, while remaining seats go to lower ranks. This defies logic! @SuvenduWB @CMO_WB please look into this! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-7',
    title: '7. The "University Upgrade" Angle',
    tag: 'University Upgrade',
    text: `Decentralized Counseling has always been the pathway for admitted students to upgrade branches at universities like JU and CU. WBJEEB's Aug 27 notice suddenly destroys this pathway. We demand justice! @SuvenduWB @CMO_WB @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-8',
    title: '8. The "Short & Punchy" Angle',
    tag: 'Short & Punchy',
    text: `You cannot change the rules of the game after the match has started! WBJEEB must revoke the Aug 27 notice barring admitted students from Decentralized Counseling. Hon'ble CM @SuvenduWB @CMO_WB, please protect our academic futures! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-9',
    title: '9. The "Transparency" Angle',
    tag: 'Transparency',
    text: `A sudden notification on Aug 27 fundamentally changing WBJEE counseling rules lacks transparency and fairness. Admitted students deserve the right to participate in Decentralized Counseling. @SuvenduWB @CMO_WB we look to you for justice! @abpanandatv #WBJEEBDecentralized #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-10',
    title: '10. The "Collective Voice" Angle',
    tag: 'Collective Voice',
    text: `Thousands of WBJEE 2026 students stand united against the unfair Aug 27 notification. We locked our seats based on old rules, and we demand the right to branch upgrades in Decentralized Counseling. @SuvenduWB @CMO_WB hear our plea! @Zee24Ghanta #WBJEEBDecentralized #JusticeForWBJEEStudents`
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
