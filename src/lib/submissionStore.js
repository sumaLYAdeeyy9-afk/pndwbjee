import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'pnd_wbjee_submissions_archive_v1';

/**
 * Saves a student submission (complete or anonymous) both locally and to Supabase
 */
export async function saveStudentSubmission(submission = {}) {
  const record = {
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    studentName: (submission.studentName || '').trim() || 'Anonymous Candidate',
    rollNumber: (submission.rollNumber || '').trim() || 'Unspecified',
    rankGmr: (submission.rankGmr || '').trim(),
    currentInstitute: (submission.currentInstitute || '').trim(),
    contactInfo: (submission.contactInfo || '').trim(),
    timestamp: new Date().toISOString()
  };

  // 1. Save locally in localStorage archive
  try {
    const existing = getLocalSubmissions();
    existing.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Failed to save submission locally:', err);
  }

  // 2. Sync to Supabase table `grievance_submissions` if table exists
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('grievance_submissions').insert([
        {
          student_name: record.studentName,
          roll_number: record.rollNumber,
          rank_gmr: record.rankGmr || null,
          current_institute: record.currentInstitute || null,
          contact_info: record.contactInfo || null,
          submitted_at: record.timestamp
        }
      ]);
    } catch (err) {
      console.warn('Supabase submission insert skipped (table may not exist yet):', err);
    }
  }

  return record;
}

/**
 * Retrieves all stored submissions from localStorage
 */
export function getLocalSubmissions() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fetches all submissions from Supabase if configured, falling back to local
 */
export async function fetchAllSubmissions() {
  const localList = getLocalSubmissions();
  
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('grievance_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (data && !error && data.length > 0) {
        // Map supabase records to uniform format
        const mapped = data.map(item => ({
          id: item.id || 'sb_' + item.submitted_at,
          studentName: item.student_name,
          rollNumber: item.roll_number,
          rankGmr: item.rank_gmr || '',
          currentInstitute: item.current_institute || '',
          contactInfo: item.contact_info || '',
          timestamp: item.submitted_at
        }));
        return mapped;
      }
    } catch (e) {
      console.warn('Could not fetch from Supabase table:', e);
    }
  }

  return localList;
}

/**
 * Exports submissions array as downloadable CSV file
 */
export function downloadSubmissionsAsCSV(submissions = []) {
  if (!submissions || submissions.length === 0) {
    alert('No submissions to export yet.');
    return;
  }

  const headers = ['Submitted At (UTC)', 'Student Name', 'WBJEE Roll Number', 'GMR / Rank', 'Current Allotment', 'Contact Details'];
  
  const rows = submissions.map(sub => [
    `"${(sub.timestamp || '').replace(/"/g, '""')}"`,
    `"${(sub.studentName || '').replace(/"/g, '""')}"`,
    `"${(sub.rollNumber || '').replace(/"/g, '""')}"`,
    `"${(sub.rankGmr || '').replace(/"/g, '""')}"`,
    `"${(sub.currentInstitute || '').replace(/"/g, '""')}"`,
    `"${(sub.contactInfo || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `wbjee_candidate_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
