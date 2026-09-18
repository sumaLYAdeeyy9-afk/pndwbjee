// The 10 Official Distinct Tweet Variations for WBJEE Offline Decentralized Counseling Protest
// Target: @SuvenduWB, Media (@abpanandatv, @Zee24Ghanta), and Protest Hashtags.
// All tweets are strictly below the 280-character limit for instant 1-click posting on X (Twitter).

export const TWEET_TEMPLATES = [
  {
    id: 'tweet-1',
    title: '1. The "Decentralized Means Decentralized" Angle',
    tag: 'Convention',
    text: `If it has "Decentralized" in its name, do NOT conduct it online in a centralized way! Respect historical precedent & conduct OFFLINE Decentralized Counseling at college campuses. @SuvenduWB please support us! @abpanandatv #WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026`
  },
  {
    id: 'tweet-2',
    title: '2. The "No Experimental Batch" Angle',
    tag: 'No Experiments',
    text: `WBJEE 2026 students refuse to be the experimental batch of WBJEEB! Scrap Online DC which causes multiple allotments & ghost seat blocking. We demand OFFLINE Spot Counseling at JU, CU & colleges. @SuvenduWB @Zee24Ghanta #WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026`
  },
  {
    id: 'tweet-3',
    title: '3. The "3 Reasons to Scrap Online DC" Angle',
    tag: '3 Flaws of Online DC',
    text: `Why Online DC must be scrapped:
1️⃣ Multiple Allotments & Seat Blocking
2️⃣ Fresh Registrations each round
3️⃣ No real Yes-Upgradation
Restore time-tested OFFLINE Decentralized Counseling! @SuvenduWB please intervene! @abpanandatv #WBJEEOfflineDC #ScrapOnlineDC`
  },
  {
    id: 'tweet-4',
    title: '4. The "Centralized Failure" Angle',
    tag: 'Centralized Disaster',
    text: `We have already seen the disaster of centralized online counseling. Don't play with our future! Conduct Decentralized Counseling OFFLINE at respective institutes as per convention. @SuvenduWB please stand with students! @Zee24Ghanta #WBJEEOfflineDC #ScrapOnlineDC`
  },
  {
    id: 'tweet-5',
    title: '5. The "Campus Spot Counseling" Angle',
    tag: 'Campus Spot',
    text: `Decentralized means decentralized! Online DC creates multiple seat holdings & prevents spot upgrades. We demand OFFLINE Decentralized Counseling at JU, CU, KGEC & JGEC campuses. @SuvenduWB @abpanandatv @Zee24Ghanta #WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026`
  },
  {
    id: 'tweet-6',
    title: '6. The "Protect Merit" Angle',
    tag: 'Merit Protection',
    text: `Merit is suffering! Online DC destroys cutoffs with fresh registrations and zero spot transparency. We demand OFFLINE on-campus Decentralized Counseling as per historical precedent. @SuvenduWB please protect student futures! @abpanandatv #WBJEEOfflineDC #WBJEE2026`
  },
  {
    id: 'tweet-7',
    title: '7. The "End Experimental Policies" Angle',
    tag: 'End Experiments',
    text: `Stop experimenting on WBJEE 2026 aspirants! After flawed centralized rounds, forcing an online DC portal will cause massive seat vacancies. Mandate OFFLINE Spot Counseling at colleges! @SuvenduWB @Zee24Ghanta #WBJEEOfflineDC #ScrapOnlineDC #JusticeForWBJEEStudents`
  },
  {
    id: 'tweet-8',
    title: '8. The "Zero Seat-Blocking" Angle',
    tag: 'Zero Seat Blocking',
    text: `Offline Decentralized Counseling is the ONLY proven way to prevent ghost seat blocking & ensure fair branch upgrades for all. Scrap Online DC now! @SuvenduWB please raise our urgent voice! @abpanandatv @Zee24Ghanta #WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026`
  },
  {
    id: 'tweet-9',
    title: '9. The "Institute Upgrade" Angle',
    tag: 'Institute Upgrade',
    text: `Admitted students need fair upgrades without multiple allotment chaos! Conduct OFFLINE Decentralized Counseling directly at engineering colleges as done every year. @SuvenduWB we appeal for your urgent help! @abpanandatv #WBJEEOfflineDC #ScrapOnlineDC #WBJEE2026`
  },
  {
    id: 'tweet-10',
    title: '10. The "United Student Front" Angle',
    tag: 'United Front',
    text: `Thousands of WBJEE 2026 rankers unitedly demand: SCRAP ONLINE DC! Restore the established OFFLINE Decentralized Counseling model. Stop playing with students' future! @SuvenduWB @Zee24Ghanta @abpanandatv #WBJEEOfflineDC #ScrapOnlineDC #JusticeForWBJEEStudents`
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
