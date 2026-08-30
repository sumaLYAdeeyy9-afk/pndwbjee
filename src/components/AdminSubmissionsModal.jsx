import React, { useState, useEffect } from 'react';
import { 
  X, Download, RefreshCw, Search, Database, Lock, Unlock,
  ShieldCheck, AlertCircle, FileSpreadsheet, Eye, User, Hash, School, Mail, Clock, KeyRound
} from 'lucide-react';
import { fetchAllSubmissions, downloadSubmissionsAsCSV } from '../lib/submissionStore';

const ADMIN_PASSCODE = '040607';
const AUTH_STORAGE_KEY = 'pnd_admin_authenticated_v1';

export default function AdminSubmissionsModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === ADMIN_PASSCODE;
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
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
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, ADMIN_PASSCODE);
      } catch {}
      loadData();
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError(false);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  // 1. Password Protected Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Admin Access Required</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Campaign Admin Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter the administrative passcode to access the candidate submissions registry and CSV exports.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Administrative Passcode:
              </label>
              <input
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                placeholder="Enter passcode..."
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  passwordError
                    ? 'border-rose-500 ring-1 ring-rose-500/40'
                    : 'border-slate-700 focus:border-rose-500'
                }`}
              />
              {passwordError && (
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-medium pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Invalid passcode. Access denied.</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
              >
                Unlock Registry
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Screen
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
  rank_gmr TEXT,
  current_institute TEXT,
  contact_info TEXT,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <span>Candidate Submissions Registry</span>
                <span className="text-xs font-mono font-normal bg-slate-800 text-rose-400 px-2 py-0.5 rounded-full">
                  {submissions.length} Total Entries
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Authorized Admin View • Live log of candidate representations
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
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-all cursor-pointer"
              title="Lock Admin Screen"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
              title="Copy Supabase table SQL schema"
            >
              <Database className="w-3.5 h-3.5 text-rose-400" />
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
                      <td className="py-2.5 px-3 text-amber-300">{item.rankGmr || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{item.currentInstitute || '-'}</td>
                      <td className="py-2.5 px-3 text-sky-400 text-[11px]">{item.contactInfo || '-'}</td>
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Authenticated session active. Only representations with verified name and roll number are stored here.</span>
          </div>
          <button
            onClick={() => downloadSubmissionsAsCSV(submissions)}
            disabled={submissions.length === 0}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download All as Excel / CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
