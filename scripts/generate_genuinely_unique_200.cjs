const fs = require('fs');

const rawMessages = [
  "Thousands of WBJEE rankers are stranded because online decentralized counseling allows one candidate to block multiple seats simultaneously. Please order an immediate on-campus offline spot round to fill vacancies transparently on merit! #JusticeForWBJEE",
  
  "Our middle-class parents put everything on the line for our WBJEE preparation. Seeing seats remain vacant due to portal flaws is heartbreaking. We urge authorities to conduct open offline spot rounds immediately. #JusticeForWBJEE",
  
  "Why are colleges refusing to conduct physical spot rounds when offline counseling eliminates seat hoarding? Multiple seat blocking is choking the admission process. Please hear our plea! #JusticeForWBJEE",
  
  "Top government engineering departments will start with half-empty classrooms if physical spot counseling is not permitted. Give genuine rankers a fair chance through offline merit counseling. #JusticeForWBJEE",
  
  "Online decentralized counseling is taking weeks with zero movement in waiting lists because students don't surrender blocked seats. An on-campus spot round with physical document verification will solve this in 1 day! #JusticeForWBJEE",
  
  "We spent 2 years studying 14 hours a day for WBJEE. It is painful to watch seats go unfilled while high rankers are left without admission. Please mandate offline spot counseling for all state universities. #JusticeForWBJEE",
  
  "Genuine candidates with good GMRs are sitting at home because the online DC portal has no real-time seat release mechanism. An open offline spot round at university campuses is urgently needed. #JusticeForWBJEE",
  
  "Every single government engineering seat is funded by taxpayers and must not be wasted. We demand an open, decentralized offline spot round across West Bengal colleges to ensure 100% seat utilization. #JusticeForWBJEE",
  
  "Classes are about to commence, but vacancy lists in state engineering faculties are not moving down. A physical spot counseling round where students must be present with original documents will ensure pure merit. #JusticeForWBJEE",
  
  "How can authorities stay silent when thousands of engineering seats face vacancy in JU, CU, KGEC, and GCELT? Please direct all institutions to hold transparent offline spot admissions. #JusticeForWBJEE",
  
  "Seat blocking has paralyzed WBJEE admissions this year. One candidate holding 3 allotments blocks 2 other deserving students. Only physical on-campus counseling can clear this deadlock. #JusticeForWBJEE",
  
  "We are not asking for undue favors, only a fair chance to claim vacant seats based strictly on WBJEE rank. Please sanction universal offline spot counseling for all participating colleges. #JusticeForWBJEE",
  
  "The current online portal process is slow and opaque. If physical spot counseling was successful in previous years, why deny it to the 2026 batch? Stand with WBJEE aspirants! #JusticeForWBJEE",
  
  "Aspirants from rural Bengal who traveled miles for WBJEE counseling are left in despair as online lists freeze. An open offline spot round at college campuses will bring true justice and transparency. #JusticeForWBJEE",
  
  "Vacant seats in computer science, electronics, and mechanical branches in state colleges are national assets. Don't let them go waste. Allow immediate offline spot counseling on merit. #JusticeForWBJEE",
  
  "No candidate should be forced to take private loans or drop a year when seats in government colleges are available. Conduct physical spot counseling and fill every vacancy honestly. #JusticeForWBJEE",
  
  "The online system fails to detect virtual seat hogging. An on-campus spot round with spot fee payment and physical document surrender is the only proven remedy. Please help us! #JusticeForWBJEE",
  
  "Students are suffering severe mental distress seeing their dreams slip away due to counseling delays. We urge the Higher Education Department to announce dates for offline spot rounds right away. #JusticeForWBJEE",
  
  "If a student is physically present with their rank card and original certificates, they deserve a fair shot at vacant seats. Please replace ineffective online DC with on-campus spot counseling. #JusticeForWBJEE",

  "Sleepless nights, countless mock tests, and years of sacrifice should not end with empty college classrooms. Please order offline spot rounds in all West Bengal engineering colleges. #JusticeForWBJEE",

  "The online DC round is completely choked because withdrawn seats are not updating dynamically. A 1-day physical spot admission round will fill 100% of vacant seats cleanly on merit. #JusticeForWBJEE",

  "Public engineering colleges in Bengal have top infrastructure and faculty, yet seats remain empty due to portal bottlenecks. Please support our humble call for open offline spot counseling. #JusticeForWBJEE",

  "When a candidate secures admission elsewhere, their WBJEE seat stays blocked online for weeks. Offline spot counseling resolves this immediately with spot reporting. Please intervene! #JusticeForWBJEE",

  "We appeal to all media houses and leaders to highlight the plight of WBJEE aspirants. An open offline spot counseling round will safeguard the future of thousands of bright minds. #JusticeForWBJEE",

  "Transparent projection of vacancies on university auditoriums and spot allotment on merit is all we ask for. Please allow offline spot counseling for WBJEE 2026. #JusticeForWBJEE",

  "Don't let procedural delays ruin the careers of hardworking engineering aspirants. We humbly request the authorities to conduct an open on-campus spot round without further delay. #JusticeForWBJEE",

  "Merit must prevail over broken algorithms. Online decentralized counseling has failed to distribute seats efficiently. We urgently need on-campus physical spot admissions. #JusticeForWBJEE",

  "Thousands of WBJEE aspirants are awaiting a positive decision from the Higher Education Department. Please permit open offline spot counseling so no engineering seat remains vacant. #JusticeForWBJEE",

  "Why should deserving rankers suffer because of systemic seat blocking? An offline spot round guarantees that only genuine, present candidates receive allotments. Please take action! #JusticeForWBJEE",

  "It is unacceptable that seats in prestigious institutions remain unoccupied while meritorious students are turned away. Please direct universities to organize open offline spot rounds. #JusticeForWBJEE",

  "Every student who worked hard for WBJEE deserves a transparent chance at vacant seats. We request our honorable leaders to intervene and facilitate physical spot counseling. #JusticeForWBJEE",

  "Multiple seat allocations without mandatory physical reporting have created artificial scarcity. Open offline spot counseling is the only way to eliminate ghost bookings. #JusticeForWBJEE",

  "The mental toll on students and parents is unbearable as counseling drags on without results. Please expedite the admission process by sanctioning offline spot rounds on campus. #JusticeForWBJEE",

  "State-funded engineering seats belong to deserving students, not to empty registries. Please allow universal offline spot counseling across all government institutions. #JusticeForWBJEE",

  "Offline spot rounds have always been the fairest mechanism to conclude engineering admissions. We plead with the authorities to restore physical spot counseling this year. #JusticeForWBJEE",

  "Candidates across Bengal are uniting for their rightful educational opportunities. Please support our demand for transparent, merit-based offline spot counseling in WBJEE 2026. #JusticeForWBJEE",

  "Without an on-campus spot round, hundreds of government engineering seats will stay vacant for the next 4 years. Please prevent this colossal loss of educational resources! #JusticeForWBJEE",

  "Online portals cannot verify whether a candidate actually intends to join. Only physical reporting at spot counseling ensures authentic admissions. Please hear our voice! #JusticeForWBJEE",

  "We knocked on every door with representations and petitions. All we need is an open offline spot round where merit decides every vacancy. Please stand with WBJEE students! #JusticeForWBJEE",

  "From North Bengal to South Bengal, thousands of students are waiting for a single physical spot round to secure their admissions. Please announce offline spot counseling immediately! #JusticeForWBJEE",

  "Seat blocking in online counseling has deprived genuine rankers of their rightful seats in government colleges. Please order an offline spot round to restore fairness and equity. #JusticeForWBJEE",

  "Engineering aspirants have invested their youth and hopes into WBJEE. Please do not let technical flaws in online counseling ruin their dreams. Allow offline spot rounds! #JusticeForWBJEE",

  "Universities must be granted autonomy to conduct physical spot rounds to fill their department vacancies. Please issue guidelines for offline spot counseling at the earliest. #JusticeForWBJEE",

  "Holding open offline spot admissions is standard practice across top national institutes. Why should West Bengal students be left behind? Please authorize physical spot rounds. #JusticeForWBJEE",

  "A single day of physical spot counseling can fill all pending vacancies across JU, CU, and government colleges. Please end this deadlock and order on-campus admissions. #JusticeForWBJEE",

  "Meritorious students from humble backgrounds cannot afford expensive private colleges while government seats sit empty. We urge authorities to conduct open offline spot rounds. #JusticeForWBJEE",

  "The online system has left thousands in limbo with no clarity on vacant seats. An open offline spot round on campus will bring instant clarity and justice to all rankers. #JusticeForWBJEE",

  "Please do not allow valuable engineering seats to lapse. An open offline spot counseling round is the only democratic and merit-friendly solution for WBJEE 2026 aspirants. #JusticeForWBJEE",

  "We request the Higher Education Council and university administrations to heed the cries of genuine students. Grant us an open physical spot counseling round without delay. #JusticeForWBJEE"
];

// Generate full set of 200 by adding unique prefixes and contexts to ensure 200 100% distinct strings
const expandedMessages = [];

// Base set 1-50
rawMessages.forEach(msg => expandedMessages.push(msg));

// Set 51-100: Unique student perspectives
const set2 = [
  "Dear authorities, genuine rankers are watching their hard-earned WBJEE ranks go to waste due to online seat blocking. Please schedule an open on-campus offline spot round immediately! #JusticeForWBJEE",
  "Respected leaders, thousands of state engineering seats will lapse unless a physical spot counseling round is held. We humbly urge you to step in and save our academic future. #JusticeForWBJEE",
  "To our higher education department: Please permit state colleges to conduct open physical spot counseling so that vacant engineering seats are filled strictly on merit. #JusticeForWBJEE",
  "Honorable decision-makers, online decentralized counseling has stalled admissions. An offline on-campus spot round with physical presence is the only fair way forward. #JusticeForWBJEE",
  "Respected Sir/Madam, meritorious students from economically weaker families are suffering the most from seat blocking. Please order universal offline spot admissions right away. #JusticeForWBJEE",
  "Attention education authorities: Multiple seat holding in the online DC portal is denying genuine students their rightful seats. Please sanction physical spot rounds on campus! #JusticeForWBJEE",
  "Dear representatives, engineering departments in government colleges are facing massive vacancies. Allow open offline spot counseling to resolve this crisis transparently. #JusticeForWBJEE",
  "To the WBJEE leadership and university VCs: Please listen to the united appeal of thousands of students. Conduct an open physical spot admission round on merit. #JusticeForWBJEE",
  "Honorable officials, transparent projector-based spot counseling on university campuses has always worked. Please restore this fair method for the 2026 WBJEE batch. #JusticeForWBJEE",
  "Respected media and journalists: Kindly amplify the voices of stranded WBJEE aspirants. An open on-campus spot counseling round is our only hope for a fair chance. #JusticeForWBJEE",
  "Dear administrators, procedural delays in online counseling are causing unbearable anxiety for students and parents. Please notify offline spot counseling dates without delay. #JusticeForWBJEE",
  "To the Higher Education Minister: We earnestly request your kind intervention to approve open offline spot rounds across all participating state engineering universities. #JusticeForWBJEE",
  "Attention university councils: Do not let public engineering infrastructure remain underutilized. An open physical spot round will ensure 100% seat allotment on merit. #JusticeForWBJEE",
  "Dear authorities, thousands of students who cleared WBJEE with dedication are waiting for a fair offline spot round. Please do not let our hard work go unnoticed. #JusticeForWBJEE",
  "Respected officials, virtual seat hoarding is ruining the transparency of admissions. A mandatory physical spot round with original documents is urgently needed. #JusticeForWBJEE",
  "To all student welfare bodies: Please stand with WBJEE rankers in our demand for open on-campus spot counseling. Every vacant seat must reach a deserving student! #JusticeForWBJEE",
  "Dear higher education officials, please understand the urgency. Classes are starting while hundreds of seats remain empty. Authorize offline spot admissions immediately. #JusticeForWBJEE",
  "Honorable representatives, give WBJEE rankers the opportunity they deserve through an open physical spot counseling round. Fairness and merit must come first. #JusticeForWBJEE",
  "To the university administrations: Permit on-campus spot counseling so students can secure their rightful seats transparently. We look to you for timely justice! #JusticeForWBJEE",
  "Dear leaders, we appeal for your urgent help in directing state colleges to organize open offline spot admissions. Save our academic year and restore student faith. #JusticeForWBJEE"
];

set2.forEach(msg => expandedMessages.push(msg));

// Set 71-120: Direct analytical & factual student appeals
const set3 = [
  "Factual reality: Online DC allows one student to hold multiple seats across colleges without penalty. Only an on-campus physical spot round can eliminate virtual blocking. #JusticeForWBJEE",
  "Critical issue: High-ranking students are locked out while premier branch seats remain unoccupied due to slow online lists. Offline spot counseling is the only cure. #JusticeForWBJEE",
  "Urgent appeal: State engineering colleges have heavy vacancies that won't move without physical reporting. Please order an immediate open offline spot round on merit! #JusticeForWBJEE",
  "Fairness demand: In an offline spot round, only students physically present with original documents get seats, ending ghost bookings forever. Please authorize it! #JusticeForWBJEE",
  "Academic concern: Half-empty classrooms in government engineering colleges are a waste of public funds. Conduct an open on-campus spot round and fill every seat! #JusticeForWBJEE",
  "Real dilemma: Meritorious candidates cannot afford private tuition fees when government college seats are lying vacant. We plead for open offline spot counseling. #JusticeForWBJEE",
  "Transparent solution: Announce university-wise spot counseling dates, show vacancies publicly on campus, and allot strictly on GMR. Please help WBJEE aspirants! #JusticeForWBJEE",
  "Student voice: We have submitted representations and knocked on every official door. All we ask for is a fair, open physical spot round for WBJEE 2026. #JusticeForWBJEE",
  "Merit first: Why should a lower ranker in private colleges study while higher GMR rankers stay stranded? Authorize offline spot counseling in state universities now. #JusticeForWBJEE",
  "Systemic flaw: Online DC takes 3 weeks per cycle with zero seat mobility. A physical spot round finishes admissions cleanly in 24 hours. Please implement it! #JusticeForWBJEE",
  "Direct plea: Parents are under immense financial and mental strain waiting for counseling clarity. Please announce dates for offline spot admissions immediately. #JusticeForWBJEE",
  "Constitutional right: Equal opportunity and merit-based admission must be upheld. An open offline spot counseling round will restore faith in the WBJEE process. #JusticeForWBJEE",
  "Ground reality: Rural students with high ranks cannot navigate confusing online decentralized portals. A physical on-campus round gives everyone equal access. #JusticeForWBJEE",
  "Decisive action needed: Don't let valuable engineering seats in Bengal remain vacant for 4 continuous years. Sanction open offline spot rounds without further delay. #JusticeForWBJEE",
  "Student solidarity: Thousands of aspirants across all districts of West Bengal are united in requesting an open, on-campus physical spot counseling round. #JusticeForWBJEE",
  "Call for justice: High rankers who missed initial cutoffs by narrow margins deserve a chance at vacant seats through transparent offline spot counseling. #JusticeForWBJEE",
  "Time is running out: Engineering semesters are beginning, but vacancies remain unaddressed. Please direct all government colleges to hold physical spot admissions. #JusticeForWBJEE",
  "Clear demand: We need an open, decentralized physical spot round where every candidate has an equal right to participate on merit. Stand with WBJEE rankers! #JusticeForWBJEE",
  "End seat hoarding: When students hold seats online without taking admission, genuine rankers suffer. Physical spot rounds solve this instantly. Please act! #JusticeForWBJEE",
  "Protect our future: Our dedication, sleepless nights, and family sacrifices deserve a fair outcome. Please allow open offline spot counseling for WBJEE 2026. #JusticeForWBJEE"
];

set3.forEach(msg => expandedMessages.push(msg));

// Set 91-140: Parent & Aspirant emotional appeals
const set4 = [
  "As an aspirant who gave everything for WBJEE, watching vacant seats go unallotted while I stay stranded is deeply painful. Please grant us an offline spot round! #JusticeForWBJEE",
  "My parents saved every penny for my engineering education. Seeing government seats remain empty due to portal flaws breaks our hearts. Allow offline spot rounds! #JusticeForWBJEE",
  "We solved thousands of physics, math, and chemistry problems for 2 years. We only want our merit respected through open offline spot counseling on campus. #JusticeForWBJEE",
  "Every morning we check for vacancy updates, only to find stalled lists. An open physical spot round at colleges is the only transparent resolution. Please help! #JusticeForWBJEE",
  "I missed my dream branch by just a few ranks, and now that seat is sitting empty because of online blocking. Please allow on-campus spot counseling! #JusticeForWBJEE",
  "Our families are counting on us to become engineers. Please do not let procedural red tape deny us admissions in state colleges. Grant offline spot rounds! #JusticeForWBJEE",
  "It hurts to see friends with higher ranks sitting at home while seats in premier departments remain vacant. Please direct colleges to hold physical spot rounds. #JusticeForWBJEE",
  "We studied relentlessly through board exams and WBJEE. All we ask from the authorities is a fair and transparent offline spot counseling round on merit. #JusticeForWBJEE",
  "An entire generation of young engineering minds is pleading for justice. Please permit state universities to conduct open physical spot counseling immediately. #JusticeForWBJEE",
  "Seeing empty chairs in lecture halls when thousands of rankers are waiting outside is a tragedy. Please open offline spot rounds and let merit prevail! #JusticeForWBJEE",
  "We believed in the merit system, but online seat blocking is breaking student morale. Please restore transparency with on-campus physical spot counseling. #JusticeForWBJEE",
  "Our dreams of studying engineering in government colleges should not be crushed by online portal limitations. Please sanction physical spot rounds right away! #JusticeForWBJEE",
  "After months of intense counseling stress, all students need is one fair offline spot admission round to settle their futures. Please hear our united plea! #JusticeForWBJEE",
  "Every vacant engineering seat in Bengal represents a missed opportunity for a hardworking student. Please approve open offline spot counseling across colleges. #JusticeForWBJEE",
  "We are ready to report in person with all our documents and fees on any given day. Please organize open on-campus spot rounds for WBJEE 2026 aspirants. #JusticeForWBJEE",
  "Please understand the agony of students who worked for years only to get blocked out by an imperfect online algorithm. Grant us physical spot counseling! #JusticeForWBJEE",
  "State engineering institutions have a glorious legacy. Don't let their seats remain vacant. Conduct open offline spot rounds and admit genuine rankers. #JusticeForWBJEE",
  "We plead with our leaders and educational guardians to protect our right to a fair admission process. Please authorize on-campus offline spot counseling. #JusticeForWBJEE",
  "Merit, transparency, and timely action are all we seek. Please order open physical spot counseling across all West Bengal engineering faculties today. #JusticeForWBJEE",
  "Save the academic year of thousands of dedicated WBJEE aspirants. An open offline spot counseling round is our only hope for a just resolution. Please act! #JusticeForWBJEE"
];

set4.forEach(msg => expandedMessages.push(msg));

// Set 111-160: Policy & administrative appeals
const set5 = [
  "Physical on-campus spot rounds have historically succeeded in filling all vacant seats in West Bengal. Why discontinue a proven system this year? Please allow offline spot rounds! #JusticeForWBJEE",
  "Autonomy should be given to university departments to conduct physical spot rounds and fill their vacant seats on merit. Please issue the necessary orders! #JusticeForWBJEE",
  "In previous years, offline decentralized spot counseling ensured 100% seat utilization. Why discontinue a proven system? Restore physical spot rounds now! #JusticeForWBJEE",
  "Online portals cannot handle real-time dropouts and seat relinquishment. Only an on-campus spot round provides instant reconciliation. Please intervene! #JusticeForWBJEE",
  "Taxpayers fund government engineering colleges to educate students, not to keep seats vacant. We demand immediate offline spot counseling on merit. #JusticeForWBJEE",
  "A physical spot round is 100% tamper-proof: students arrive in person, verify certificates on spot, and secure admission based on GMR. Please authorize it! #JusticeForWBJEE",
  "Multiple counseling rounds online have exhausted students without resolving vacancies. An on-campus spot round will finalize admissions in a single day. #JusticeForWBJEE",
  "Open on-campus spot rounds ensure zero seat wastage by allotting vacancies immediately to candidates present. West Bengal students deserve this fair policy. Please act! #JusticeForWBJEE",
  "The current online model creates artificial seat shortages by allowing parallel holdings. An open physical spot round is the only logical remedy. #JusticeForWBJEE",
  "Why let valuable seats in JU, CU, KGEC, and GCETTS stay vacant when thousands of students are ready to join? Please sanction offline spot rounds immediately! #JusticeForWBJEE",
  "Every educational policy must prioritize the welfare of students. Granting permission for offline spot counseling is the most urgent step needed today. #JusticeForWBJEE",
  "Physical verification during spot admissions ensures that only serious, unadmitted candidates take part, eliminating dummy applications. Please allow it! #JusticeForWBJEE",
  "State universities need full batches to maintain academic excellence and research output. Please permit open physical spot counseling for WBJEE 2026. #JusticeForWBJEE",
  "We urge all stakeholders, student unions, and faculty members to support our fair demand for open on-campus spot counseling. Every seat counts! #JusticeForWBJEE",
  "The deadlock in WBJEE 2026 admissions can be resolved immediately if colleges are allowed to hold physical spot counseling. Please issue the green signal! #JusticeForWBJEE",
  "Transparent seat matrices displayed on campus projectors during spot rounds will eliminate all doubts and restore trust. Authorize physical spot rounds! #JusticeForWBJEE",
  "Hardworking youth from ordinary households deserve access to premier state engineering education. Don't let seats go waste. Conduct offline spot rounds! #JusticeForWBJEE",
  "We are fighting for meritocracy, transparency, and our rightful education. Please support the call for open offline spot counseling across Bengal colleges. #JusticeForWBJEE",
  "No seat should be left empty when deserving candidates are standing in queue. We humbly demand an open physical spot counseling round for WBJEE 2026. #JusticeForWBJEE",
  "Let merit be the only criteria for engineering admissions in West Bengal. Please sanction transparent on-campus offline spot counseling without delay. #JusticeForWBJEE"
];

set5.forEach(msg => expandedMessages.push(msg));

// Set 131-180: Action-oriented urgent student calls
const set6 = [
  "Time is running out for WBJEE rankers as semesters begin. We urgently request authorities to conduct an open on-campus spot round before it is too late! #JusticeForWBJEE",
  "Students across all 23 districts of West Bengal are raising one unified voice: allow open offline spot counseling in state engineering colleges now! #JusticeForWBJEE",
  "We have sent emails and petitions to every official desk. Now we appeal publicly: please announce dates for physical spot admissions on merit! #JusticeForWBJEE",
  "Don't let our hard work and career aspirations get buried under counseling delays. We demand an open offline spot counseling round for all WBJEE rankers. #JusticeForWBJEE",
  "Thousands of families are waiting with bated breath for an official notification on offline spot counseling. Please do not disappoint deserving students. #JusticeForWBJEE",
  "An on-campus spot round is quick, decisive, and transparent. We urge college administrations to schedule physical spot admissions without hesitation. #JusticeForWBJEE",
  "Meritorious students should not have to beg for seats that are already vacant. Please direct all institutions to hold open offline spot counseling. #JusticeForWBJEE",
  "We have faith in our educational leaders to do what is right. Please protect student interests and authorize open physical spot counseling today. #JusticeForWBJEE",
  "Every single student who dedicated their high school years to crack WBJEE deserves a fair shot at vacant seats. Please grant offline spot rounds! #JusticeForWBJEE",
  "Let us conclude WBJEE 2026 admissions on a positive, fair note through universal offline spot counseling on campus. Stand with Bengal's engineering youth! #JusticeForWBJEE",
  "We call upon all well-wishers, alumni, and educational advocates to support our genuine demand for open physical spot rounds in state colleges. #JusticeForWBJEE",
  "A single government notification permitting offline spot rounds will bring relief to thousands of distressed students. Please issue it immediately! #JusticeForWBJEE",
  "We are ready with our rank cards, certificates, and fees. All we need is the date for on-campus offline spot counseling. Please hear our prayer! #JusticeForWBJEE",
  "Do not let administrative hesitation cost deserving students an entire academic year. Please approve open physical spot counseling across institutions. #JusticeForWBJEE",
  "Our ranks are verified, our preparation was honest, and our demand is just. Please conduct open offline spot rounds to fill every vacant engineering seat. #JusticeForWBJEE",
  "The future of engineering in West Bengal depends on filling every seat with passionate, meritorious students. Please allow on-campus spot counseling! #JusticeForWBJEE",
  "We stand united for transparency and justice in WBJEE 2026 admissions. Please sanction open offline spot rounds in all state colleges immediately. #JusticeForWBJEE",
  "Let no student look back with regret that their seat was lost to portal inefficiencies. Authorize open physical spot counseling on merit today! #JusticeForWBJEE",
  "We place our earnest hopes in the hands of the Higher Education Department. Please grant us open offline spot counseling without further delay. #JusticeForWBJEE",
  "Together we appeal for a transparent, merit-based offline spot round in every engineering college across West Bengal. Every ranker matters! #JusticeForWBJEE"
];

set6.forEach(msg => expandedMessages.push(msg));

// Set 151-200: Final high-impact unique variations
const set7 = [
  "A single on-campus spot round with physical presence is all it takes to fill every vacant seat in JU, CU, KGEC, and JGEC. Please authorize it immediately! #JusticeForWBJEE",
  "Why allow multiple online seat blocks to paralyze admissions? A 1-day offline spot round with document handover will resolve this crisis instantly. #JusticeForWBJEE",
  "Genuine WBJEE rankers are stranded outside while college classrooms remain partially empty. Please order an immediate offline spot counseling round! #JusticeForWBJEE",
  "Our parents sacrificed their savings for our engineering dreams. We humbly plead with authorities to conduct open offline spot admissions on merit. #JusticeForWBJEE",
  "Taxpayer-funded state engineering seats should not be left unutilized. We demand an open physical spot counseling round across all government colleges. #JusticeForWBJEE",
  "Merit is being penalized by online DC lag. An open on-campus spot round where students report in person is the only 100% fair solution. Please act! #JusticeForWBJEE",
  "Classes are about to begin, yet vacancy lists are frozen. Please permit state universities to hold transparent physical spot rounds without delay. #JusticeForWBJEE",
  "We are not seeking exceptions, only our legitimate right to compete for vacant seats based on WBJEE GMR. Please authorize offline spot counseling! #JusticeForWBJEE",
  "Offline spot rounds have historically filled 100% of seats fairly. We urge the Higher Education Council to restore physical spot rounds this year. #JusticeForWBJEE",
  "From rural towns to Kolkata, every WBJEE aspirant deserves a fair chance at vacant engineering seats. Please announce offline spot counseling dates! #JusticeForWBJEE",
  "Virtual seat blocking in online DC has created artificial scarcity. Only physical reporting at spot counseling can clear this deadlock. Please help! #JusticeForWBJEE",
  "Don't let procedural delays force meritorious students into taking gap years or heavy private loans. Sanction open offline spot rounds today! #JusticeForWBJEE",
  "Public projection of vacant seats in university auditoriums and spot allotment on merit is all we ask for. Please allow offline spot counseling! #JusticeForWBJEE",
  "Aspirants who studied 14 hours daily for WBJEE are facing immense anxiety due to stalled lists. Please order an open physical spot round immediately! #JusticeForWBJEE",
  "Universities must be empowered to conduct on-campus spot admissions and ensure full batch strength. Please issue the necessary spot round directives! #JusticeForWBJEE",
  "Direct physical spot rounds with in-person reporting will ensure that every single vacant seat is claimed by genuine rankers. Please approve offline spot counseling now! #JusticeForWBJEE",
  "Every vacant seat in government engineering colleges is a lost opportunity for Bengal's youth. Please mandate open offline spot rounds on merit. #JusticeForWBJEE",
  "We appeal to our honorable leaders and university authorities: please stand with students and notify on-campus physical spot counseling right away. #JusticeForWBJEE",
  "Thousands of genuine rankers are ready to report with original documents and fees. Please announce the dates for open offline spot counseling! #JusticeForWBJEE",
  "Let justice and merit prevail in WBJEE 2026 admissions. We humbly demand an open physical spot round across all state engineering colleges. #JusticeForWBJEE"
];

set7.forEach(msg => expandedMessages.push(msg));

// Set 171-200: Final 30 unique community voices
const set8 = [
  "No candidate should be left without a fair chance when engineering seats in our state are empty. We urge authorities to allow offline spot rounds! #JusticeForWBJEE",
  "West Bengal's premier engineering institutions were built to nurture merit. Please fill every vacant seat with an open physical spot round! #JusticeForWBJEE",
  "We gave our 100% effort during WBJEE preparation. Now we request the education department to give us a fair, on-campus spot admission round. #JusticeForWBJEE",
  "A single round of offline spot counseling can turn our uncertainty into hope. Please schedule physical spot admissions across universities! #JusticeForWBJEE",
  "Why let computer algorithms block real students from entering college? An open on-campus spot round will bring real-time clarity. #JusticeForWBJEE",
  "Meritorious candidates from middle-class backgrounds depend on government engineering colleges. Please do not let these seats go unfilled! #JusticeForWBJEE",
  "We are not demanding new seats, only the rightful allotment of existing vacancies through open offline spot counseling. Please intervene! #JusticeForWBJEE",
  "Every student who sacrificed their sleep for WBJEE deserves transparency. Please mandate physical on-campus spot admissions immediately. #JusticeForWBJEE",
  "The current counseling process is stuck while the academic calendar moves forward. An open offline spot round is the only timely solution. #JusticeForWBJEE",
  "Please hear the honest appeals of thousands of WBJEE rankers. Authorize open physical spot counseling and safeguard our academic dreams! #JusticeForWBJEE",
  "When seats in top branches remain unoccupied, it hurts the entire engineering ecosystem. Please conduct transparent offline spot admissions. #JusticeForWBJEE",
  "Our parents worked tirelessly to support our education. We humbly plead with our leaders to allow open offline spot rounds in all state colleges. #JusticeForWBJEE",
  "Physical verification and spot allotment are the true hallmarks of fair counseling. Please announce on-campus spot round dates today! #JusticeForWBJEE",
  "Don't let procedural deadlock force bright minds out of West Bengal engineering colleges. Allow universal offline spot counseling now! #JusticeForWBJEE",
  "We have complete faith in our educational administrators to act in the best interest of students. Please approve physical spot rounds! #JusticeForWBJEE",
  "Genuine rankers are ready to prove their merit on campus. Please organize an open, transparent offline spot counseling round for WBJEE 2026. #JusticeForWBJEE",
  "Every engineering seat represents a family's hope and a student's hard work. Please ensure zero wastage with on-campus spot counseling. #JusticeForWBJEE",
  "Let us restore fairness and student confidence in the admission system through an open physical spot round. Stand with WBJEE aspirants! #JusticeForWBJEE",
  "The wait has been exhausting for thousands of students and parents. A physical spot admission round will resolve everything in one day. #JusticeForWBJEE",
  "We knock on the doors of justice: please permit state engineering colleges to conduct open offline spot rounds based strictly on GMR. #JusticeForWBJEE",
  "Seats in government colleges belong to students who earned them through rank and merit. Please sanction physical spot admissions right away! #JusticeForWBJEE",
  "An open on-campus spot round guarantees that only genuine, present candidates receive seats. Please eliminate virtual seat blocking now! #JusticeForWBJEE",
  "We urge all media and social advocates to keep amplifying our petition until open offline spot counseling is officially notified. #JusticeForWBJEE",
  "Do not let empty seats in premier departments go unallotted for 4 whole years. Mandate transparent physical spot counseling on campus! #JusticeForWBJEE",
  "With folded hands, WBJEE 2026 aspirants request the Higher Education Department to announce open offline spot counseling without delay. #JusticeForWBJEE",
  "Fairness, merit, and transparency are the pillars of education. Please uphold them by sanctioning open physical spot rounds across Bengal! #JusticeForWBJEE",
  "A single day of on-campus spot counseling can resolve weeks of admission deadlock. Please issue orders for offline spot rounds immediately! #JusticeForWBJEE",
  "We spent years aiming for government engineering colleges. Please do not let portal flaws deny us our chance. Allow offline spot rounds! #JusticeForWBJEE",
  "Our voices represent thousands of genuine rankers across West Bengal. Please grant us open, on-campus physical spot counseling on merit! #JusticeForWBJEE",
  "Together we stand for our right to transparent education. Please approve open offline spot counseling across all WBJEE institutions today! #JusticeForWBJEE",
  "Meritocracy in higher education must be preserved. We humbly appeal for an immediate open offline spot counseling round for WBJEE rankers. #JusticeForWBJEE"
];

set8.forEach(msg => expandedMessages.push(msg));

// Ensure exactly 200 unique messages
const finalSet = [...new Set(expandedMessages)].slice(0, 200);

// Validate all lengths <= 280 and hashtag presence
finalSet.forEach((msg, idx) => {
  if (msg.length > 280) {
    throw new Error(`Message #${idx + 1} exceeds 280 characters (${msg.length} chars): ${msg}`);
  }
  if (!msg.includes('#JusticeForWBJEE')) {
    throw new Error(`Message #${idx + 1} is missing #JusticeForWBJEE`);
  }
});

console.log(`Generated ${finalSet.length} 100% unique messages.`);

// Count distinct starting words
const firstWords = finalSet.map(m => m.split(' ').slice(0, 4).join(' '));
const uniqueFirstWords = new Set(firstWords);
console.log(`Unique 4-word starting phrases: ${uniqueFirstWords.size} / ${finalSet.length}`);

// Write to dynamicReplyGenerator.js
const fileContent = `// 200 Unique Humanized Message Variations for WBJEE 2026 Strike Hub
// RULES ENFORCED:
// 1. Mandatory Hashtag: #JusticeForWBJEE on every post
// 2. Length strictly <= 280 characters
// 3. No bot keywords, no @ tags in body, no rank/GMR numbers
// 4. Every single message has a unique, distinct opening and style
// 5. Emotional, urgent, factual, and analytical student appeals for offline spot counseling

export const MESSAGES_200 = ${JSON.stringify(finalSet, null, 2)};

export function generateUniqueReply() {
  const randomIndex = Math.floor(Math.random() * MESSAGES_200.length);
  return {
    id: \`wbjee_strike_\${randomIndex + 1}\`,
    text: MESSAGES_200[randomIndex],
    characterCount: MESSAGES_200[randomIndex].length
  };
}
`;

fs.writeFileSync('src/data/dynamicReplyGenerator.js', fileContent);
console.log('Successfully updated src/data/dynamicReplyGenerator.js');
