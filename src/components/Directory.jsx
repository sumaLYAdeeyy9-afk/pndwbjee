import React from 'react';
import { PhoneCall, Mail, MapPin, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Directory() {
  const contacts = [
    {
      title: 'WBJEEB Official Office & Desk',
      authority: 'West Bengal Joint Entrance Examinations Board',
      location: 'RUPANNA, DB-118, Sector-I, Salt Lake City, Kolkata 700064',
      phones: ['1800-1234-782 (Toll Free)', '033-71564345'],
      emails: ['info@wbjeeb.in', 'helpdesk@wbjeeb.in'],
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
      title: "Chief Minister's Grievance Cell (CMO ASAP)",
      authority: "Govt. of West Bengal, Nabanna",
      location: 'Nabanna, 325 Sarat Chatterjee Road, Howrah 711102',
      phones: ['Toll Free: 1800 345 0117'],
      emails: ['asap@wb.gov.in'],
      link: 'https://wb.gov.in'
    }
  ];

  const faqs = [
    {
      q: 'Why must the August 27 notification be revoked?',
      a: 'The sudden Aug 27 notice restricts already admitted students from taking part in decentralized counseling (DC), overturning historical precedent where DC was open to all. Due to WBJEEB allowing fresh registration in every round of centralized counseling, cutoffs shrank instead of getting relaxed, causing massive seat blocking and huge vacancies across colleges. Barring admitted students now unjustly traps them in locked seats.'
    },
    {
      q: 'Does sending this unified email blast violate any rules?',
      a: 'No. Submitting a polite, fact-based grievance representation with your candidate details to statutory authorities (WBJEEB, DTE, and Higher Education Dept) is a legal and democratic representation right.'
    },
    {
      q: 'Will my data or privacy be protected?',
      a: 'Yes. PlayNoDice operates 100% on the client-side. No personal data or roll numbers are saved on any external database.'
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
