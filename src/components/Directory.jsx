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
      q: 'Why must Online DC be scrapped in favor of Offline DC?',
      a: 'If it has "Decentralized" in its name, it cannot be run centrally online. Online DC causes multiple virtual allotments and rampant seat-blocking across colleges, allows fresh registrations per round that distort merit, and offers no real "yes-upgradation" mechanism. Offline spot counseling conducted directly at institute campuses (JU, CU, KGEC, JGEC, etc.) ensures 100% physical attendance, instant seat turnover, and zero ghost vacancies.'
    },
    {
      q: 'Can SC/ST/OBC/EWS candidates converted to General reclaim their category?',
      a: 'Yes, this is a top campaign demand. Many bonafide reserved category candidates were converted to General during Centralized Counseling solely because their certificates were delayed by issuing authorities beyond student control. We demand that candidates be allowed to opt for their correct category and produce issued certificates at Decentralized Counseling registration.'
    },
    {
      q: 'Why do students refuse to be the "experimental batch"?',
      a: 'WBJEE 2026 students already suffered immense cutoff compression, seat anomalies, and academic loss during the experimental centralized online rounds. Imposing another untested online portal for decentralized admissions will lead to complete administrative collapse and leave thousands of premier engineering seats vacant.'
    },
    {
      q: 'Is participating in this grievance campaign safe?',
      a: 'Yes. Submitting respectful, fact-based grievance representations to statutory authorities (WBJEEB, DTE, Higher Education Dept, and Hon\'ble CM) is a democratic right. PlayNoDice operates 100% client-side with zero storage of your personal credentials.'
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

                  <div className="flex items-start space-x-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      {c.phones.map((p, pIdx) => (
                        <div key={pIdx} className="font-mono text-slate-300">{p}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      {c.emails.map((e, eIdx) => (
                        <div key={eIdx} className="font-mono text-slate-300 break-all">{e}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800">
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center justify-between"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((f, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  {f.q}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
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
