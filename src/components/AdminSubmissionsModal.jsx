import React, { useState, useEffect } from 'react';
import { 
  X, Download, RefreshCw, Search, Database, ShieldAlert, 
  CheckCircle2, Copy, Check, FileSpreadsheet, Eye, User, Hash, School, Mail, Clock
} from 'lucide-react';
import { fetchAllSubmissions, downloadSubmissionsAsCSV } from '../lib/submissionStore';

export default function AdminSubmissionsModal({ isOpen, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSubmissions();
      setSubmissions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = submissions.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      (s.studentName || '').toLowerCase().includes(q) ||
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.rankGmr || '').toLowerCase().includes(q) ||
      (s.currentInstitute || '').toLowerCase().includes(q) ||
      (s.contactInfo || '').toLowerCase().includes(q)
    );
  });

  const sqlSetupSnippet = `-- Run this in your Supabase SQL Editor to store submissions in your Supabase Dashboard:
CREATE TABLE IF NOT EXISTS public.grievance_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  rank_gmr TEXT NOT NULL,
  current_institute TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.grievance_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.grievance_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.grievance_submissions
  FOR SELECT USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <span>Verified Candidate Submissions Log</span>
                <span className="text-xs font-mono font-normal bg-slate-800 text-rose-400 px-2 py-0.5 rounded-full">
                  {submissions.length} Total Entries
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Live registry of all student representations and inputted data
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadSubmissionsAsCSV(submissions)}
              disabled={submissions.length === 0}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Roll, GMR, College..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
              title="Copy Supabase table SQL schema"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'SQL Copied!' : 'Copy Supabase SQL'}</span>
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="flex-1 overflow-auto p-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Database className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">No submissions recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                When students fill and dispatch their representations, their details appear here in real time.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No results match your search query "{searchQuery}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/50">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">WBJEE Roll</th>
                    <th className="py-2.5 px-3">GMR / Rank</th>
                    <th className="py-2.5 px-3">Allotted College & Branch</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filtered.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] font-sans">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-white font-bold font-sans">{item.studentName}</td>
                      <td className="py-2.5 px-3 text-rose-400">{item.rollNumber}</td>
                      <td className="py-2.5 px-3 text-amber-300">{item.rankGmr}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{item.currentInstitute}</td>
                      <td className="py-2.5 px-3 text-sky-400 text-[11px]">{item.contactInfo}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Only representations with 100% complete data increment the community counter and log here.</span>
          </div>
          <button
            onClick={() => downloadSubmissionsAsCSV(submissions)}
            disabled={submissions.length === 0}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download All as Excel / CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
