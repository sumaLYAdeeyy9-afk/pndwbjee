import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'wbjee_target_real_strike_counts_v2';

// 100% Real Initial State (Starts from 0, no dummy data)
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

// Fetch 100% real strike counts from Supabase
export async function fetchTargetStrikeCounts() {
  const local = getLocalStrikeCounts();
  
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('target_strikes')
        .select('target_handle, strike_count');

      if (data && !error) {
        const dbCounts = {};
        data.forEach(row => {
          if (row.target_handle) {
            dbCounts[row.target_handle] = Number(row.strike_count || 0);
          }
        });
        saveLocalStrikeCounts(dbCounts);
        return dbCounts;
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase target_strikes:', err);
    }
  }

  return local;
}

// Increment strike for a specific target handle in real-time
export async function incrementTargetStrike(handle) {
  if (!handle) return;
  const cleanHandle = handle.replace('@', '').trim();

  // 1. Optimistic local update
  const current = getLocalStrikeCounts();
  const newCount = (current[cleanHandle] || 0) + 1;
  const updated = { ...current, [cleanHandle]: newCount };
  saveLocalStrikeCounts(updated);

  // 2. Sync to Supabase via RPC or direct Upsert
  if (isSupabaseConfigured && supabase) {
    try {
      // First try RPC atomic increment
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('increment_target_strike', { handle: cleanHandle });

      if (rpcError) {
        // Fallback: Direct table upsert
        await supabase
          .from('target_strikes')
          .upsert({
            target_handle: cleanHandle,
            strike_count: newCount,
            updated_at: new Date().toISOString()
          }, { onConflict: 'target_handle' });
      } else if (rpcData !== null && rpcData !== undefined) {
        updated[cleanHandle] = rpcData;
        saveLocalStrikeCounts(updated);
      }
    } catch (err) {
      console.warn('Supabase target_strikes update failed (falling back to local):', err);
    }
  }

  return updated;
}

// Subscribe to real-time changes across all users
export function subscribeToTargetStrikes(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('target_strikes_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'target_strikes' },
        (payload) => {
          if (payload.new && payload.new.target_handle) {
            const handle = payload.new.target_handle;
            const count = Number(payload.new.strike_count || 0);
            const current = getLocalStrikeCounts();
            const updated = { ...current, [handle]: count };
            saveLocalStrikeCounts(updated);
            if (onUpdate) onUpdate(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Could not subscribe to realtime target_strikes channel:', e);
    return () => {};
  }
}
