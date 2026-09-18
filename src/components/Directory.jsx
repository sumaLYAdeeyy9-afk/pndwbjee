import React from 'react';
import { PhoneCall, Mail, MapPin, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Directory() {
  const contacts = [
    {
      title: 'WBJEEB Official Office & Desk',
      authority: 'West Bengal Joint Entrance Examinations Board',
      location: 'RUPANNA, DB-118, Sector-I, Salt Lake City, Kolkata 700064',
      phones: ['1800-1234-782 (Toll Free)', '033-71564345'],
      emails: ['info@wbjeeb.in'],
      link: 'https://wbjeeb.in'
    },
    {
      title: 'Directorate of Technical Education (DTE)',
      authority: 'Govt. of West Bengal, Bikash Bhavan (10th Floor)',
      location: 'Bikash Bhavan, 10th Floor, East Block, Salt Lake, Kolkata 700091',
      phones: ['033-23347077', '033-23377075'],
      emails: ['dtewbgovt@gmail.com', 'techedndirectoratewb@gmail.com'],
      link: 'https://wbhed.gov.in'
    },
    {
      title: 'Office of the Vice-Chancellor, Jadavpur University',
      authority: 'Hon’ble Vice-Chancellor, Jadavpur University',
      location: 'Aurobindo Bhavan, 188, Raja S.C. Mallick Rd, Kolkata 700032',
      phones: ['033-24146000', '033-24572222'],
      emails: ['vc@jadavpuruniversity.in'],
      link: 'http://www.jaduniv.edu.in'
    },
    {
      title: 'Higher Education Department & DPI',
      authority: 'Govt. of West Bengal, Bikash Bhavan (6th Floor)',
      location: 'Bikash Bhavan, 6th Floor, Salt Lake, Kolkata 700091',
      phones: ['033-23378573', '033-23587266'],
      emails: ['highereducationwb@gmail.com', 'dpihedn@gmail.com', 'jdpidd1@gmail.com'],
      link: 'https://wbhed.gov.in'
    },
    {
      title: "Chief Minister's Secretariat Desk",
      authority: "Hon'ble Chief Minister Shri Suvendu Adhikari",
      location: 'Nabanna, 325 Sarat Chatterjee Road, Howrah 711102',
      phones: ['9733064595'],
      emails: ['adhikarisuvenduwb1@gmail.com'],
      link: 'https://wb.gov.in'
    }
  ];

  const faqs = [
    {
      q: 'Why are students demanding Offline Decentralised Counselling?',
      a: 'A genuine decentralized counselling process, as conducted in previous years, provides colleges with an opportunity to fill remaining vacant seats through physical, college-level spot rounds. Candidates travel to institutions, physically report, verify documents, and accept seats immediately. This naturally filters out candidates who are merely holding seats online without genuine intent to join, eliminating artificial cut-off inflation.'
    },
    {
      q: 'Why are thousands of seats still vacant despite high cut-offs?',
      a: 'The current counselling flow and online allocation mechanism suffer from systemic seat-blocking. Candidates hold multiple options across institutions without physical reporting, keeping genuine candidates from securing vacant public and private engineering seats and creating unnatural cutoff inflation.'
    },
    {
      q: 'Are students willing to travel physically to campuses?',
      a: 'Yes. Students across West Bengal are ready to take full responsibility and travel hundreds of kilometres to physically report at college campuses (JU, CU, KGEC, JGEC, GCECT, GCELT, GCETTS, etc.) to secure vacant seats rather than lose an academic year.'
    },
    {
      q: 'What is the demand regarding Phase 2 DCAP eligibility?',
      a: 'We appeal to the Board to exclude candidates who have already confirmed admission in Centralised Counselling or DC Phase 1 from competing again in Phase 2, so that remaining vacancies can reach candidates who are still without admission.'
    },
    {
      q: 'Is participating in this grievance representation campaign safe?',
      a: 'Yes. Submitting respectful, fact-based representations to statutory authorities (WBJEEB, DTE, Higher Education Dept, and CMO) is a constitutionally protected right. PlayNoDice operates 100% client-side with zero storage of your personal credentials.'
    }
  ];

  return (
    <section id="directory" className="py-14 bg-slate-950 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
            <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
            <span>Authority Directory & FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Official Decision-Maker Directory
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Direct statutory, technical education, and administrative contact desks for WBJEE 2026 grievances.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contacts.map((c, idx) => (
            <div key={idx} className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-400 tracking-wider block mb-1">
                  Desk {idx + 1}
                </span>
                <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5">
                  {c.title}
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  {c.authority}
                </p>

                <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2.5">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-400">{c.location}</span>
                  </div>

                  {c.phones.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-center space-x-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${p.replace(/[^0-9+]/g, '')}`} className="hover:text-rose-400 transition-colors">
                        {p}
                      </a>
                    </div>
                  ))}

                  {c.emails.map((em, eIdx) => (
                    <div key={eIdx} className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <a href={`mailto:${em}`} className="hover:text-rose-400 transition-colors font-mono text-[10px] truncate">
                        {em}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80">
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions & Context</span>
          </div>

          <div className="space-y-3">
            {faqs.map((f, fIdx) => (
              <div key={fIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">
                  {f.q}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
