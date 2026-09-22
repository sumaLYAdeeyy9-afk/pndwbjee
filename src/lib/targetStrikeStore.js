import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'wbjee_target_real_strike_counts_v5';

// Get local cache
export function getLocalStrikeCounts() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

// Save local counts
export function saveLocalStrikeCounts(counts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error(e);
  }
}

// Fetch real strike counts from Supabase across all devices
export async function fetchTargetStrikeCounts() {
  const local = getLocalStrikeCounts();
  
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch individual target strike records from Supabase
      const { data: strikeRows, error: strikeError } = await supabase
        .from('grievance_submissions')
        .select('roll_number')
        .eq('student_name', 'DISPATCH_STRIKE');

      if (strikeRows && !strikeError) {
        const dbCounts = { _totalStrikes: strikeRows.length };
        strikeRows.forEach(row => {
          if (row.roll_number) {
            const clean = row.roll_number.replace('@', '').trim().toLowerCase();
            dbCounts[clean] = (dbCounts[clean] || 0) + 1;
          }
        });
        saveLocalStrikeCounts(dbCounts);
        return dbCounts;
      }
    } catch (err) {
      console.warn('Supabase fetch failed (using local cache):', err);
    }
  }

  return local;
}

// Increment strike for a specific target handle in real-time
export async function incrementTargetStrike(handle) {
  if (!handle) return;
  const cleanHandle = handle.replace('@', '').trim().toLowerCase();

  // 1. Optimistic local update
  const current = getLocalStrikeCounts();
  const currentTargetCount = Number(current[cleanHandle] || 0);
  const newTargetCount = currentTargetCount + 1;
  const currentTotal = current._totalStrikes !== undefined 
    ? Number(current._totalStrikes) 
    : Object.entries(current).filter(([k]) => !k.startsWith('_')).reduce((a, [, v]) => a + Number(v || 0), 0);
  const newTotal = currentTotal + 1;

  const updated = { 
    ...current, 
    [cleanHandle]: newTargetCount,
    _totalStrikes: newTotal
  };
  saveLocalStrikeCounts(updated);

  // 2. Sync individual strike event to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      // Insert strike event into grievance_submissions with DISPATCH_STRIKE identifier
      await supabase
        .from('grievance_submissions')
        .insert([
          {
            student_name: 'DISPATCH_STRIKE',
            roll_number: cleanHandle,
            rank_gmr: '1',
            current_institute: 'x_strike_dispatch',
            contact_info: 'strike_event',
            submitted_at: new Date().toISOString()
          }
        ]);
    } catch (err) {
      console.warn('Supabase individual strike sync failed:', err);
    }
  }

  return updated;
}

// Subscribe to real-time changes across all devices (mobile, desktop, etc.)
export function subscribeToTargetStrikes(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    // Channel for grievance_submissions strike inserts
    const grievanceChannel = supabase
      .channel('strike_events_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'grievance_submissions' },
        (payload) => {
          if (payload.new && payload.new.student_name === 'DISPATCH_STRIKE' && payload.new.roll_number) {
            const handle = payload.new.roll_number.replace('@', '').trim().toLowerCase();
            const current = getLocalStrikeCounts();
            const currentTargetCount = Number(current[handle] || 0);
            const currentTotal = current._totalStrikes !== undefined 
              ? Number(current._totalStrikes) 
              : Object.entries(current).filter(([k]) => !k.startsWith('_')).reduce((a, [, v]) => a + Number(v || 0), 0);
            const updated = { 
              ...current, 
              [handle]: currentTargetCount + 1,
              _totalStrikes: currentTotal + 1
            };
            saveLocalStrikeCounts(updated);
            if (onUpdate) onUpdate(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(grievanceChannel);
    };
  } catch (e) {
    console.warn('Could not subscribe to realtime strike channel:', e);
    return () => {};
  }
}
