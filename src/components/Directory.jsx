import React from 'react';
import { PhoneCall, Mail, MapPin, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Directory() {
  const contacts = [
    {
      title: 'WBJEEB Official Office & Desk',
      authority: 'West Bengal Joint Entrance Examinations Board',
      location: 'DB-118, Sector-I, Salt Lake City, Kolkata 700064',
      phones: ['1800-102-3781 (Toll Free)', '033-71564345', '033-23671159'],
      emails: ['info@wbjeeb.in', 'helpdesk@wbjeeb.in'],
      link: 'https://wbjeeb.in'
    },
    {
      title: 'Higher Education Department & DPI',
      authority: 'Govt. of West Bengal, Bikash Bhavan',
      location: 'Bikash Bhavan, 6th Floor, Salt Lake, Kolkata 700091',
      phones: ['033-23342228', '033-23586824'],
      emails: ['highereducationwb@gmail.com', 'dpihedn@gmail.com', 'jdpidd1@gmail.com'],
      link: 'https://wbhed.gov.in'
    },
    {
      title: 'Chief Minister\'s Office (CMO West Bengal)',
      authority: 'Hon\'ble Chief Minister Suvendu Adhikari',
      location: 'Nabanna, 325 Sarat Chatterjee Road, Howrah 711102',
      phones: ['Toll Free: 1800 345 0117'],
      emails: ['cmo@wb.gov.in'],
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
      a: 'No. Submitting a polite, fact-based grievance representation with your candidate details to statutory authorities (WBJEEB and Higher Education Dept) is a legal and democratic representation right.'
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
            Direct statutory and administrative contact desks for WBJEE 2026 grievances.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {contacts.map((c, idx) => (
            <div key={idx} className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-400 tracking-wider block mb-1">
                  {c.authority}
                </span>
                <h3 className="font-bold text-white text-sm mb-2">{c.title}</h3>
                
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{c.location}</span>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-[11px] font-mono break-all text-slate-200">
                      {c.emails.map((em) => (
                        <div key={em}>{em}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 max-w-3xl mx-auto">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80">
                <h4 className="text-xs font-bold text-white mb-1.5">{faq.q}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
