// WBJEE Official Grievance Email Targets & Universal Multi-Persona Representation Generator

export const PRIMARY_TO_RECIPIENTS = [
  'info@wbjeeb.in'
];

export const CC_RECIPIENTS = [
  'dtewbgovt@gmail.com',
  'vc@jadavpuruniversity.in',
  'techedndirectoratewb@gmail.com',
  'highereducationwb@gmail.com',
  'dpihedn@gmail.com',
  'jdpidd1@gmail.com',
  'adhikarisuvenduwb1@gmail.com'
];

export const OFFICIAL_RECIPIENTS = [
  {
    id: 'wbjeeb_official',
    name: 'WBJEEB Official Desk',
    email: 'info@wbjeeb.in',
    designation: 'West Bengal Joint Entrance Examinations Board',
    category: 'TO'
  },
  {
    id: 'dte_wb_govt',
    name: 'Directorate of Technical Education (DTE)',
    email: 'dtewbgovt@gmail.com',
    designation: 'Directorate of Technical Education, Bikash Bhavan 10th Floor',
    category: 'CC'
  },
  {
    id: 'vc_ju',
    name: 'Hon’ble Vice-Chancellor, Jadavpur University',
    email: 'vc@jadavpuruniversity.in',
    designation: 'Office of the Vice-Chancellor, Jadavpur University',
    category: 'CC'
  },
  {
    id: 'tech_edn_dir',
    name: 'Technical Education Directorate WB',
    email: 'techedndirectoratewb@gmail.com',
    designation: 'Technical Education Wing, Govt of WB',
    category: 'CC'
  },
  {
    id: 'higher_edu_gen',
    name: 'Higher Education Dept (General)',
    email: 'highereducationwb@gmail.com',
    designation: 'Department of Higher Education, Govt of WB',
    category: 'CC'
  },
  {
    id: 'dpi_hedn',
    name: 'Director of Public Instruction (DPI)',
    email: 'dpihedn@gmail.com',
    designation: 'Directorate of Public Instruction, Bikash Bhavan',
    category: 'CC'
  },
  {
    id: 'jdpi_hedn',
    name: 'Joint Director of Public Instruction',
    email: 'jdpidd1@gmail.com',
    designation: 'Joint DPI, Higher Education Dept',
    category: 'CC'
  },
  {
    id: 'suvendu_adhikari',
    name: 'Hon’ble Chief Minister Shri Suvendu Adhikari',
    email: 'adhikarisuvenduwb1@gmail.com',
    designation: "Chief Minister's Secretariat / Office, Govt of West Bengal",
    category: 'CC'
  }
];

export const SENDER_ROLES = [
  {
    id: 'candidate',
    title: 'WBJEE Candidate',
    subtitle: '1st Year Aspirant',
    badge: 'Candidate',
    icon: 'GraduationCap'
  },
  {
    id: 'senior',
    title: 'Senior Student / Alumni',
    subtitle: '2nd / 3rd / 4th Year & Passed Out',
    badge: 'Senior & Alumni',
    icon: 'School'
  },
  {
    id: 'guardian',
    title: 'Parent / Guardian',
    subtitle: 'Concerned Citizen / Family',
    badge: 'Guardian',
    icon: 'Users'
  }
];

// ==========================================
// 100+ DIVERSE AI-CRAFTED COMBINATORIAL POOL
// ==========================================

const SUBJECTS_BY_ROLE = {
  candidate: [
    "Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
    "URGENT: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
    "Formal Representation: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
    "Candidate Appeal: Urgent Need for Physical Campus Spot Rounds in WBJEE 2026",
    "Submission of WBJEE 2026 Aspirants: Request for Genuine Offline Decentralised Counselling",
    "Urgent Representation to WBJEEB, DTE & JU: Conduct Physical Offline Decentralised Counselling",
    "Appeal for Genuine Offline Decentralised Counselling to Fill Remaining Vacant Seats in WBJEE 2026",
    "Grievance & Appeal: Demand for Physical College-Level Decentralised Counselling in WBJEE 2026",
    "WBJEE 2026 Aspirants Representation: Urgent Demand for Genuine Offline DC on Campus",
    "Crucial Appeal for Offline Decentralised Counselling to Prevent Vacant Seat Wastage in WBJEE 2026",
    "Urgent Student Appeal: Conduct Transparent Physical Decentralised Counselling for WBJEE 2026",
    "Representation for Physical Offline Spot Rounds to Resolve WBJEE 2026 Vacancies",
    "WBJEE 2026 Admission Grievance: Appeal for Offline Decentralised Counselling across WB Colleges",
    "Student Demand: Restore Physical Decentralised Counselling for WBJEE 2026 Remaining Vacancies",
    "Formal Petition: Conduct Genuine Offline Decentralised Counselling for WBJEE 2026 Candidates"
  ],
  senior: [
    "Senior Students & Alumni Appeal: Request for Genuine Offline Decentralised Counselling in WBJEE 2026",
    "Solidarity Representation: Urging WBJEEB, DTE & JU to Conduct Genuine Offline DC for WBJEE 2026",
    "Appeal from Engineering Students of West Bengal: Conduct Physical Spot Rounds for WBJEE 2026",
    "Senior Engineering Community Representation: Demand for Offline Decentralised Counselling for WBJEE 2026",
    "Alumni & Senior Student Appeal: Urgent Need for Physical Campus Decentralised Counselling in WBJEE 2026",
    "Preserve Institutional Seats: Senior Students Appeal for Genuine Offline DC in WBJEE 2026",
    "Representation from State Engineering Students: Conduct Genuine Offline DC to Fill Campus Vacancies",
    "Call for Fair Admissions: Senior Students & Alumni Appeal for Offline Decentralised Counselling 2026",
    "Engineering Student Body Appeal: Restore Physical Decentralised Counselling in WB Engineering Colleges",
    "Joint Senior Student Appeal: Conduct Offline Decentralised Counselling to Prevent Seat Wastage in WBJEE 2026",
    "Institutional Integrity & Admissions: Senior Students Urge Offline Spot Rounds for WBJEE 2026",
    "Appeal from West Bengal University Students: Implement Physical Decentralised Counselling for WBJEE 2026",
    "Solidarity with WBJEE 2026 Aspirants: Demand for Immediate Offline Decentralised Counselling",
    "Senior Engineers & Students Petition: Fill Vacant Seats via Physical Offline DC in WBJEE 2026",
    "University Students Representation: Conduct Transparent Offline Spot Counselling for WBJEE 2026"
  ],
  guardian: [
    "Parents & Guardians Appeal: Request for Genuine Offline Decentralised Counselling for WBJEE 2026",
    "Urgent Representation from Distressed Parents: Conduct Physical Offline DC for WBJEE 2026",
    "Guardian Petition: Request for Genuine Offline Decentralised Counselling to Save Students' Future",
    "Parents' Appeal to WBJEEB, DTE & JU: Conduct Physical Campus Spot Rounds for WBJEE 2026 Vacancies",
    "Formal Guardian Representation: Save Academic Year through Offline Decentralised Counselling in WBJEE 2026",
    "Distressed Parents & Guardians: Urgent Appeal for Genuine Offline Decentralised Counselling in WBJEE 2026",
    "Protect Middle-Class Students: Parents Appeal for Physical Offline DC in West Bengal Government Colleges",
    "Grievance from Parents of WBJEE 2026 Aspirants: Conduct Offline Decentralised Spot Rounds Immediately",
    "Parent Community Appeal: Demand for Transparent Offline Decentralised Counselling in WBJEE 2026",
    "Urgent Plea from Guardians of WBJEE 2026 Candidates: Restore Offline Decentralised Campus Admissions",
    "Representation by Concerned Parents: Fill Vacant Engineering Seats via Genuine Offline DC in WBJEE 2026",
    "Parents' Appeal on Behalf of WBJEE Aspirants: Conduct Physical Offline Decentralised Counselling",
    "Guardian Community Petition: Urgent Demand for College-Level Offline Spot Admissions in WBJEE 2026",
    "Appeal from West Bengal Families: Conduct Genuine Physical Decentralised Counselling for WBJEE 2026",
    "Crucial Parents' Representation: Request for Transparent Offline Decentralised Counselling in WBJEE 2026"
  ]
};

// Intros by Role (6 variants each)
const INTROS_BY_ROLE = {
  candidate: [
    "We, the undersigned WBJEE 2026 candidates and bonafide aspirants, respectfully submit this joint representation to WBJEEB, the Directorate of Technical Education (DTE), the Department of Higher Education, and Participating University Administrations to urgently address the present counselling crisis and consider conducting a genuine offline Decentralised Counselling (DC) for all remaining vacant engineering seats.",
    "As bonafide candidates and aspirants of WBJEE 2026 who have dedicated years of relentless academic preparation, we respectfully write to your esteemed offices to formally highlight our deep distress regarding the current counselling mechanism and urgently appeal for the immediate conduction of a genuine offline Decentralised Counselling (DC) at the institution level.",
    "We, the aspiring engineering students of West Bengal appearing in WBJEE 2026, submit this formal representation before the statutory authorities—WBJEEB, DTE, the Higher Education Department, and University Authorities—earnestly requesting the immediate organization of physical, offline Decentralised Counselling across colleges to allocate all remaining vacancies.",
    "Writing with utmost respect and profound anxiety regarding our academic careers, we, the bonafide candidates of WBJEE 2026, submit this urgent joint appeal to the competent authorities, requesting immediate intervention to conduct physical, college-level Decentralised Counselling (DC) for all vacant seats in state institutions.",
    "We, representing thousands of WBJEE 2026 candidates and admission-seekers across West Bengal, respectfully draw your urgent attention to the severe bottlenecks in the ongoing admission cycle and solemnly petition for the conduct of genuine offline Decentralised Counselling at participating campuses.",
    "With deep faith in the fairness of our state educational authorities, we, the undersigned aspirants of WBJEE 2026, place this collective grievance and humble representation to urgently request an offline, on-campus Decentralised Counselling process for the genuine disposal of vacant seats."
  ],
  senior: [
    "We, the undersigned senior engineering students and proud alumni representing premier state universities and government engineering institutions of West Bengal (including Jadavpur University, Calcutta University, Kalyani Government Engineering College, Jalpaiguri Government Engineering College, and other reputed institutions), respectfully submit this formal representation in firm solidarity with the WBJEE 2026 aspirants.",
    "As current senior students, department representatives, and alumni of West Bengal's leading government engineering colleges and universities, we write with great concern regarding the ongoing WBJEE 2026 admission process and respectfully appeal to WBJEEB, DTE, and university administrations to conduct genuine offline Decentralised Counselling for vacant seats.",
    "We, senior engineering undergraduates and alumni of state universities and engineering institutes across West Bengal, respectfully bring this urgent collective representation to the statutory authorities, urging you to protect institutional infrastructure and student welfare by conducting physical, on-campus Decentralised Counselling for WBJEE 2026.",
    "Having successfully traversed the WBJEE counselling process in previous academic years, we, the senior students and alumni of West Bengal's premier engineering institutions, respectfully write to WBJEEB, DTE, and University Authorities to advocate for the immediate restoration of genuine offline Decentralised Counselling for the WBJEE 2026 batch.",
    "We, the senior student community and alumni body of technical education institutes across West Bengal, submit this joint appeal in support of the WBJEE 2026 aspirants, urging your esteemed authorities to implement physical, college-level Decentralised Counselling to resolve the persistent vacancy crisis in our departments.",
    "Standing shoulder-to-shoulder with thousands of deserving WBJEE 2026 candidates, we, the senior undergraduates and alumni of engineering colleges across West Bengal, respectfully petition the competent authorities to conduct genuine physical Decentralised Counselling on college campuses without further delay."
  ],
  guardian: [
    "We, the undersigned parents, guardians, and concerned citizens of West Bengal, write to your esteemed authorities with immense anguish and pressing urgency regarding the future of our children who appeared in WBJEE 2026, respectfully petitioning for the immediate conduction of genuine offline Decentralised Counselling (DC) for all remaining vacant seats.",
    "As tax-paying citizens and anxious parents whose sons and daughters have worked tirelessly for WBJEE 2026, we respectfully submit this formal representation before WBJEEB, DTE, the Department of Higher Education, and University Administrations, earnestly appealing for an offline, physical Decentralised Counselling process at the college level.",
    "We, representing the distressed parent community of WBJEE 2026 candidates from every district of West Bengal, place this collective appeal before the competent educational authorities, urging your compassionate and immediate intervention to conduct genuine physical Decentralised Counselling across institutions.",
    "With profound hope and deep concern for our children's academic careers, we, the parents and guardians of WBJEE 2026 aspirants, respectfully approach WBJEEB, the Directorate of Technical Education, and University Leadership to demand the immediate execution of physical, on-campus Decentralised Counselling for remaining vacant seats.",
    "We, the guardians and well-wishers of thousands of promising young students in West Bengal, submit this formal memorandum to the highest educational authorities of the state, appealing for a transparent and accessible offline Decentralised Counselling mechanism for WBJEE 2026 admissions.",
    "On behalf of hardworking middle-class families across West Bengal whose children are seeking admission through WBJEE 2026, we respectfully place this urgent appeal before the statutory authorities, requesting a genuine offline Decentralised Counselling round at individual college campuses."
  ]
};

// Context & Phase 1 DC Critique (6 variants each - all emphasizing Phase 1 completion & negligible drop)
const CONTEXT_CRITIQUES_BY_ROLE = {
  candidate: [
    "Students across West Bengal are deeply concerned that multiple online allocations and passive seat-holding across centralised cycles have caused cut-offs for government and private colleges to remain artificially inflated while substantial numbers of seats remain unoccupied. Crucially, Phase 1 of Decentralised Counselling (DCAP Phase 1) has now been fully completed, yet the number of vacant seats across major engineering institutions has declined by only a negligible margin. This outcome clearly demonstrates the fundamental flaw in conducting centralised online DC, where seats continue to be locked virtually by candidates without genuine intent to take physical admission.",
    "The ongoing centralised allocation model has created an unprecedented bottleneck where high-merit candidates are deprived of admissions while valuable seats remain blocked. Notably, Phase 1 of Decentralised Counselling has already concluded, yet college-wise vacancy lists show that vacant seats have reduced by a statistically negligible margin. This stark reality underscores how online centralised allocation allows seats to be blocked without verification, failing to convert allotments into actual on-campus admissions.",
    "Our firsthand experience during this admission cycle reveals a deeply flawed cycle of virtual seat-blocking. Despite the completion of Phase 1 of Decentralised Counselling, the vacancy numbers in premier institutions have barely budged, decreasing by an almost negligible fraction. This clearly proves that an online-only centralised DC mechanism is ineffective, as candidates hold multiple seats virtually without physically turning up, depriving genuinely interested candidates of accessible seats.",
    "The present centralised process has resulted in unnatural cut-off deviations, leaving thousands of bonafide candidates stranded. Phase 1 of Decentralised Counselling has concluded, yet official vacancies have gone down by only a negligible margin. This conclusively demonstrates that centralised online DC is unable to resolve seat-holding and vacancies, as candidates repeatedly block seats from home without undertaking physical reporting.",
    "We are witnessing a distressing situation where seats in premier government institutions and university departments remain empty despite high demand. Although Phase 1 of Decentralised Counselling was organised, the reduction in vacant seats has been remarkably negligible. This outcome exposes the inherent shortcomings of online centralised DC, which perpetuates seat-holding rather than facilitating immediate admissions.",
    "Thousands of qualified students are facing severe distress because virtual seat allocation has prevented seats from reaching willing candidates. With Phase 1 of Decentralised Counselling now concluded, the number of vacant seats has reduced by only a negligible margin. This outcome confirms that centralised online counselling cannot resolve vacancies when candidates are not required to physically report and take on-spot admission."
  ],
  senior: [
    "From our experience on campus and inside departmental classrooms, we are observing an alarming number of unfilled desks and vacant lab stations in core and emerging engineering branches. Crucially, Phase 1 of Decentralised Counselling (DCAP Phase 1) has concluded, yet vacancy counts across colleges have decreased by a negligible margin. This proves that an online centralised DC format merely encourages phantom seat-holding rather than ensuring genuine students arrive on campus to commence classes.",
    "Having witnessed multiple past admission seasons, we know that physical decentralised rounds are the proven and reliable method to fill departmental vacancies. The completion of Phase 1 of Decentralised Counselling with only a negligible reduction in vacant seats proves that online centralised allocation is failing our institutions. Deserving juniors who genuinely want to study in our institutions are being locked out while virtual allotments go unclaimed.",
    "Our departments and student laboratories thrive when classrooms are fully occupied by passionate, dedicated students. It is distressing to note that after the conclusion of Phase 1 of Decentralised Counselling, the drop in vacant seats has been completely negligible. This reflects the failure of online centralised DC, which allows seats to be held casually online rather than filled through physical commitment.",
    "As seniors who actively assist newcomers during orientation and department admissions, we see the real-world fallout of this flawed process. Phase 1 of Decentralised Counselling has finished, yet vacant seats in our institutes have reduced by only a negligible margin. This demonstrates conclusively that an online centralised framework cannot replace the efficacy of physical on-campus spot rounds.",
    "The academic health of our state engineering colleges depends on timely and complete seat occupancy. The fact that Phase 1 of Decentralised Counselling resulted in only a negligible change in vacant seat numbers is clear evidence that the centralised online mechanism is defective, enabling virtual seat-blocking while genuine students are left waiting outside.",
    "In previous years, offline college-level DC successfully filled virtually 100% of remaining vacancies within days. In contrast, the current online DC Phase 1 has completed with an almost negligible reduction in vacancies. This stark difference proves that online centralised DC is unsuited for final spot admissions and causes unnecessary seat wastage in our alma mater."
  ],
  guardian: [
    "As parents who have supported our children through years of rigorous schooling and board examinations, it is distressing to witness them suffer due to systemic seat-blocking. Furthermore, Phase 1 of Decentralised Counselling has already concluded, yet the number of vacant seats has declined by only a negligible margin. This clearly proves that the online centralised DC process is deeply flawed, allowing seats to be occupied virtually while willing children are denied physical admission.",
    "Most middle-class families in West Bengal rely heavily on the affordable tuition and exceptional educational standards of government engineering colleges and state universities. Following the completion of Phase 1 of Decentralised Counselling, the vacancy numbers have decreased by only a negligible fraction. This confirms our fear that online centralized allocation enables candidates to block seats without commitment, forcing distressed parents towards exorbitant private options.",
    "We are experiencing extreme mental and financial strain seeing our children's hard-earned ranks fail to secure vacant seats due to online hoarding. Phase 1 of Decentralised Counselling has completed, yet vacant seats across government colleges have gone down by a negligible margin. This outcome is clear proof that online centralised allocation does not work for spot admissions and must be replaced by physical campus reporting.",
    "The present counselling mechanism has caused immense agony to families across Bengal. Even after the completion of Decentralised Counselling Phase 1, seat vacancies have reduced by an almost negligible margin. This clearly demonstrates the failure of the online centralised process, where seats remain frozen on computer screens while real candidates stand ready to pay fees and take admission on campus.",
    "Parents cannot bear to see a full academic year wasted when thousands of seats in prestigious government colleges and universities are sitting idle. The conclusion of Phase 1 DC with only a negligible reduction in vacancies proves that online allocation promotes seat-holding without physical accountability.",
    "Every parent dreams of seeing their child enter a respected engineering campus through fair merit. The completion of Phase 1 DC with a negligible drop in vacant seats proves that the current online mechanism is defective. We urgently need a transparent physical process where genuine students can be admitted on the spot."
  ]
};

// Offline DC Justification (6 variants each)
const OFFLINE_JUSTIFICATIONS_BY_ROLE = {
  candidate: [
    "A genuine offline Decentralised Counselling conducted physically at respective college and university campuses will ensure that vacant seats reach candidates who are genuinely willing and prepared to take immediate admission. In-person reporting provides crucial safeguards: candidates verify documents and eligibility directly with college authorities, view real-time live vacancy dashboards on campus, make immediate seat confirmations, and completely eliminate virtual seat-blocking.",
    "Conducting physical, on-campus Decentralised Counselling is the only established method to eliminate artificial cut-off inflation. When candidates are required to physically report to college premises with original credentials and requisite fees, phantom applicants are automatically filtered out, ensuring that every vacant seat is allotted transparently to a bonafide student present on spot.",
    "Physical campus-level spot counselling restores fairness and accountability to the admission process. By requiring physical presence for verification and immediate allotment, colleges can fill their available seats on merit within a single transparent day, eliminating the uncertainty that currently paralyzes candidates.",
    "An on-campus offline Decentralised Counselling session enables direct, transparent interactions between aspiring students and college administrative faculties. Physical document verification, on-the-spot merit-based calling, and instant fee deposition guarantee that zero seats are left wasted or blocked by uninterested individuals.",
    "Campus-level offline decentralised spot rounds have historically proven to be the most efficient and tamper-proof mechanism for filling residual vacancies. Candidates are willing to travel to campuses across West Bengal to physically participate in merit rounds and secure their rightful engineering seats.",
    "By shifting to physical on-campus Decentralised Counselling, the authorities can achieve 100% genuine seat occupancy. Physical reporting ensures that only serious, committed candidates participate, instantly resolving the vacancy crisis that online iterations have failed to solve."
  ],
  senior: [
    "From our institutional experience, offline decentralized spot rounds conducted on college grounds are the single most effective way to fill departmental seats. Physical reporting ensures that only students with genuine intent and physical readiness appear, allowing our departments to welcome a full batch of motivated junior classmates without administrative delay.",
    "On-campus offline spot counselling brings absolute transparency to the admission process. When merit ranks are called publicly in college auditoriums and documents verified in person, every single seat is filled strictly on merit without the possibility of multiple seat hoarding across institutions.",
    "Having seen how smoothly offline spot rounds functioned in earlier batches at our institutes, we can attest that on-campus physical counselling eliminates artificial cutoff inflation and fills vacant seats transparently in real time.",
    "Physical decentralized counselling allows individual colleges and universities to assess real-time branch vacancies and admit bonafide candidates on spot. This protects laboratory resources, faculty workload distribution, and the vibrant academic culture of our institutions.",
    "Our student unions, departmental bodies, and senior batches stand ready to volunteer and assist college administrations in conducting smooth, disciplined, and transparent on-campus offline spot rounds for incoming juniors.",
    "A physical on-campus round is self-filtering: candidates who are already admitted elsewhere or not genuinely interested will not travel to campus, immediately unlocking these high-value government engineering seats for deserving candidates who are present on spot."
  ],
  guardian: [
    "We, as parents, are fully prepared to accompany our children and travel to college campuses across West Bengal (Jadavpur University, Calcutta University, KGEC, JGEC, GCECT, GCELT, GCETTS, etc.) for physical spot admissions. Physical reporting ensures that parents can verify documents, pay fees on the spot, and secure our children's future with complete peace of mind.",
    "Physical on-campus Decentralised Counselling provides complete transparency for families. Parents and students can witness the vacancy status in real time, participate in public merit calls, and eliminate the agonizing suspense caused by flawed online allocation algorithms.",
    "As guardians who bear the financial responsibility of our children's higher education, we know that physical spot rounds guarantee genuine admissions. Parents present on campus will immediately accept allotted seats and complete admission formalities, ensuring that public resources are fully utilized.",
    "Conducting offline decentralized rounds at college campuses allows parents to make informed, immediate decisions regarding their wards' education, preventing families from being pressured into unaffordable private college fees while government seats remain empty.",
    "We assure the authorities of our complete cooperation during on-campus physical counselling sessions. Parents and students across West Bengal will maintain utmost discipline and decorum to make offline spot admissions a success.",
    "An offline physical spot round at individual institutions is the only compassionate and practical solution for parents. It guarantees that available seats are awarded to physically present, eligible candidates based strictly on merit without bureaucratic delays."
  ]
};

// Structured Demands Blocks (4 formatting variants)
const DEMANDS_VARIANTS = [
  `We therefore earnestly request WBJEEB, the Directorate of Technical Education, the Higher Education Department, and University Authorities to urgently consider and implement:

1. Conducting physical, college-level offline Decentralised Counselling (DC) for all remaining vacant engineering seats;
2. Publishing comprehensive college-wise, branch-wise, and category-wise vacancy data on official portals prior to the spot rounds;
3. Following a strictly transparent merit-based process adhering to all statutory eligibility norms and applicable reservation rules;
4. Providing adequate advance notice and scheduling to allow candidates and guardians sufficient time to arrange travel;
5. Enabling all eligible WBJEE candidates to participate in offline Decentralised Counselling if conducted; and
6. Releasing an official notification and consolidated timeline at the earliest possible opportunity.`,

  `In the supreme interest of transparency and student welfare, we place before your esteemed offices our unified core demands:

• Physical Spot Rounds: Conduct genuine offline Decentralised Counselling on individual college and university campuses;
• Pre-Published Vacancies: Release transparent college-wise, branch-wise, and category-wise vacant seat matrices before counselling commences;
• Merit & Reservation Integrity: Maintain strict merit rank ordering while complying with all statutory state reservation guidelines;
• Fair Travel Notice: Announce schedules with sufficient advance notice to facilitate candidate travel across districts;
• Universal Eligibility: Ensure that all eligible WBJEE candidates are permitted to participate in offline Decentralised Counselling; and
• Immediate Schedule Release: Issue the official notification and detailed guidelines without further delay.`,

  `We respectfully submit the following actionable demands for immediate consideration by the competent educational authorities:

1️⃣ Conduction of genuine, physical Offline Decentralised Counselling (DC) directly at respective college/university premises;
2️⃣ Prior publication of accurate, college-wise, department-wise, and category-wise vacancy lists;
3️⃣ Execution of on-the-spot physical document verification and instant admission based strictly on GMR and applicable quotas;
4️⃣ Reasonable advance intimation for candidate travel and logistical preparation;
5️⃣ Open eligibility for all bonafide WBJEE candidates to participate in offline Decentralised Counselling; and
6️⃣ Urgent notification of official dates and spot round procedures.`,

  `To resolve the persistent admission deadlock and prevent seat wastage, we respectfully urge the administration to adopt the following measures:

[A] Physical On-Campus DC: Direct colleges and universities to conduct physical offline spot rounds for all residual vacancies;
[B] Complete Vacancy Transparency: Disclose updated vacancy matrices across all disciplines and categories prior to reporting;
[C] Merit-Driven Spot Allotment: Ensure spot seat allocation strictly follows merit ranks and established government reservation mandates;
[D] Timely Travel Window: Provide adequate travel time for candidates residing in distant districts;
[E] Inclusive Eligibility: Allow all eligible WBJEE candidates to participate in offline Decentralised Counselling; and
[F] Prompt Official Circular: Issue an authoritative circular and schedule at the earliest possible juncture.`
];

// Conclusions by Role (6 variants each)
const CONCLUSIONS_BY_ROLE = {
  candidate: [
    "Thousands of hard-working students cannot afford to sacrifice an academic year or bear the financial burden of costly private alternatives when seats in esteemed government institutions remain unoccupied. We earnestly request the competent authorities to intervene with urgency and provide eligible candidates with a fair, transparent opportunity to fill genuinely vacant seats.",
    "Our future and years of earnest academic effort depend upon your prompt, student-centric intervention. We place our full faith in your leadership and respectfully urge you to notify the physical offline Decentralised Counselling schedule at the earliest.",
    "We make this humble appeal not just for ourselves, but to safeguard the principles of merit, transparency, and accessible higher education in West Bengal. We look forward to your benevolent and prompt administrative action.",
    "With our academic careers hanging in the balance, we respectfully implore the authorities to take immediate cognizance of our representation and grant us the opportunity to participate in physical on-campus spot admissions.",
    "We remain deeply grateful for your continuous service to the student community of West Bengal and trust that you will take immediate steps to conduct genuine offline Decentralised Counselling for the WBJEE 2026 batch.",
    "Time is of the absolute essence for the WBJEE 2026 aspirants. We respectfully pray for your immediate intervention to ensure no engineering seat goes to waste and every deserving student finds their rightful place on campus."
  ],
  senior: [
    "As seniors who deeply value our institutions and the future of technical education in West Bengal, we urge you to listen to the legitimate grievances of the WBJEE 2026 aspirants and conduct physical offline Decentralised Counselling immediately to protect institutional seats from going waste.",
    "Our colleges and departments flourish when every classroom is complete. We respectfully urge WBJEEB, DTE, and university authorities to uphold meritocracy and issue guidelines for physical on-campus decentralised rounds without delay.",
    "In the spirit of institutional excellence and student solidarity, we place this urgent representation before you and sincerely hope that prompt administrative directives will be issued to conduct genuine offline spot rounds across West Bengal.",
    "We thank the authorities for their dedication to technical education in West Bengal and earnestly request your timely action to ensure full seat occupancy through transparent campus spot admissions.",
    "Protecting our state's premier engineering seats is a shared responsibility. We appeal to your esteemed leadership to authorize physical on-campus Decentralised Counselling and welcome our newest junior batch.",
    "We look forward to your proactive intervention to resolve this admission deadlock and ensure that every vacant seat in our institutions is allotted to a deserving candidate through genuine offline DC."
  ],
  guardian: [
    "As parents whose sole aspiration is to see our children receive quality higher education based on merit, we humbly beseech the authorities to intervene immediately and conduct physical offline Decentralised Counselling to save our children's academic year.",
    "We place our heartfelt prayers and deep trust in the benevolent leadership of our state educational authorities, pleading for an urgent notification that enables offline campus spot rounds for our deserving children.",
    "The financial and mental well-being of thousands of families across West Bengal rests upon your decisive action. We respectfully urge you to grant our children a fair chance through physical on-campus Decentralised Counselling.",
    "We express our sincere gratitude for your compassionate attention to our representation and eagerly anticipate positive, student-friendly directives from WBJEEB, DTE, and university administrations.",
    "No parent should have to watch their child's dreams shattered while seats in public institutions remain unoccupied. We respectfully appeal for your immediate intervention to conduct offline Decentralised Counselling.",
    "With profound respect and urgent anticipation, we pray for your timely and decisive action to conduct physical offline spot admissions and protect the future of West Bengal's brightest young minds."
  ]
};

/**
 * Universal Multi-Persona & Combinatorial Representation Generator
 * Over 100+ unique, rich combinations for every sender role
 */
export function generateUniversalRepresentation({
  role = 'candidate', // 'candidate' | 'senior' | 'guardian'
  studentName = '',
  rollOrRank = '',
  currentInstitute = '',
  contactInfo = '',
  // Senior specific
  seniorCollege = '',
  seniorDeptYear = '',
  // Guardian specific
  guardianName = '',
  wardDetails = '',
  wardAllotment = '',
  seed = 1
}) {
  const seedNum = Math.abs(Number(seed)) || 1;
  const safeRole = SENDER_ROLES.some(r => r.id === role) ? role : 'candidate';

  // 1. Pick Subject
  const roleSubjects = SUBJECTS_BY_ROLE[safeRole] || SUBJECTS_BY_ROLE.candidate;
  const subjectIndex = (seedNum - 1) % roleSubjects.length;
  const subject = roleSubjects[subjectIndex];

  // 2. Pick Intro
  const roleIntros = INTROS_BY_ROLE[safeRole] || INTROS_BY_ROLE.candidate;
  const introIndex = (seedNum + 2) % roleIntros.length;
  const intro = roleIntros[introIndex];

  // 3. Pick Context / Phase 1 DC Critique
  const roleCritiques = CONTEXT_CRITIQUES_BY_ROLE[safeRole] || CONTEXT_CRITIQUES_BY_ROLE.candidate;
  const critiqueIndex = (seedNum + 4) % roleCritiques.length;
  const critique = roleCritiques[critiqueIndex];

  // 4. Pick Offline Justification
  const roleJustifications = OFFLINE_JUSTIFICATIONS_BY_ROLE[safeRole] || OFFLINE_JUSTIFICATIONS_BY_ROLE.candidate;
  const justificationIndex = (seedNum + 6) % roleJustifications.length;
  const justification = roleJustifications[justificationIndex];

  // 5. Pick Demands Block
  const demandsIndex = (seedNum + 1) % DEMANDS_VARIANTS.length;
  const demands = DEMANDS_VARIANTS[demandsIndex];

  // 6. Pick Conclusion
  const roleConclusions = CONCLUSIONS_BY_ROLE[safeRole] || CONCLUSIONS_BY_ROLE.candidate;
  const conclusionIndex = (seedNum + 3) % roleConclusions.length;
  const conclusion = roleConclusions[conclusionIndex];

  // 7. Format Signature based on Role & Data
  let signature = 'Concerned WBJEE 2026 Aspirants & Citizens';

  if (safeRole === 'candidate') {
    const lines = [];
    if (studentName.trim()) lines.push(studentName.trim());
    else lines.push('Concerned WBJEE 2026 Candidate');

    if (rollOrRank.trim()) lines.push(`WBJEE 2026 Roll No. / Rank (GMR): ${rollOrRank.trim()}`);
    if (currentInstitute.trim()) lines.push(`Allotted College: ${currentInstitute.trim()}`);
    if (contactInfo.trim()) lines.push(`Contact Number: ${contactInfo.trim()}`);

    signature = lines.join('\n');
  } else if (safeRole === 'senior') {
    const lines = [];
    if (studentName.trim()) lines.push(`${studentName.trim()} (Senior Student / Alumnus)`);
    else lines.push('Senior Engineering Student / Alumnus of West Bengal');

    if (seniorCollege.trim()) lines.push(`Institution / University: ${seniorCollege.trim()}`);
    if (seniorDeptYear.trim()) lines.push(`Department & Academic Year: ${seniorDeptYear.trim()}`);
    if (contactInfo.trim()) lines.push(`Contact Info: ${contactInfo.trim()}`);

    signature = lines.join('\n');
  } else if (safeRole === 'guardian') {
    const nameStr = guardianName.trim() || studentName.trim();
    const lines = [];
    if (nameStr) lines.push(`${nameStr} (Parent / Guardian)`);
    else lines.push('Concerned Parent / Guardian of WBJEE 2026 Aspirant');

    if (wardDetails.trim()) lines.push(`Ward Name & WBJEE Roll / GMR: ${wardDetails.trim()}`);
    else if (rollOrRank.trim()) lines.push(`Ward's WBJEE Roll / GMR: ${rollOrRank.trim()}`);

    if (wardAllotment.trim()) lines.push(`Ward's Allotted College: ${wardAllotment.trim()}`);
    else if (currentInstitute.trim()) lines.push(`Ward's Allotted College: ${currentInstitute.trim()}`);

    if (contactInfo.trim()) lines.push(`Contact Number: ${contactInfo.trim()}`);

    signature = lines.join('\n');
  }

  // 8. Assemble Full Representation Document
  const body = `To,
1. The Chairman / Competent Authority, West Bengal Joint Entrance Examinations Board (WBJEEB)
2. The Director of Technical Education (DTE), Government of West Bengal
3. The Vice-Chancellor, Jadavpur University
4. The Principal Secretary, Department of Higher Education, Government of West Bengal
5. The Director of Public Instruction (DPI), Government of West Bengal
6. The Chief Minister's Office & Higher Education Wing, Government of West Bengal

Subject: ${subject}

Respected Authorities / Respected Sir/Madam,

${intro}

${critique}

${justification}

${demands}

${conclusion}

Yours faithfully,
${signature}`;

  return { subject, body };
}

/**
 * Backward compatibility alias
 */
export function generateOfflineDcBody(params = {}) {
  return generateUniversalRepresentation({ ...params, role: 'candidate' }).body;
}

/**
 * Backward compatibility alias
 */
export function generateUniqueEmail(params = {}) {
  return generateUniversalRepresentation(params);
}

/**
 * Build mailto: URL string with clean URI encoding (%20 for spaces, not +)
 */
export function buildMailtoUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  const parts = [];

  if (ccArr && ccArr.length > 0) {
    parts.push(`cc=${encodeURIComponent(ccArr.join(','))}`);
  }

  parts.push(`subject=${encodeURIComponent(subject)}`);

  // Proper CRLF line breaks for mail clients
  const formattedBody = (body || '').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  parts.push(`body=${encodeURIComponent(formattedBody)}`);

  return `mailto:${toStr}?${parts.join('&')}`;
}

/**
 * Build direct web Gmail compose URL (%20 for spaces, not +)
 */
export function buildGmailComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toStr)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(','))}`;
  }

  return url;
}

/**
 * Build direct web Outlook compose URL (%20 for spaces, not +)
 */
export function buildOutlookComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(';');
  let url = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(toStr)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(';'))}`;
  }

  return url;
}

/**
 * Build direct web Yahoo compose URL (%20 for spaces, not +)
 */
export function buildYahooComposeUrl(toArr, ccArr, subject, body) {
  const toStr = (toArr || []).join(',');
  let url = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(toStr)}&subj=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (ccArr && ccArr.length > 0) {
    url += `&cc=${encodeURIComponent(ccArr.join(','))}`;
  }

  return url;
}
