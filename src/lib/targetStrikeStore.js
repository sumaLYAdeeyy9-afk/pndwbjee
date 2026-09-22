import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'wbjee_target_real_strike_counts_v2';
const GLOBAL_TWEETS_KEY = 'wbjee_global_tweets_count_live';

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

// Fetch real strike counts from Supabase (checking both target_strikes and campaign_stats)
export async function fetchTargetStrikeCounts() {
  const local = getLocalStrikeCounts();
  
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch from target_strikes table if present
      const { data: targetData, error: targetError } = await supabase
        .from('target_strikes')
        .select('target_handle, strike_count');

      if (targetData && !targetError && targetData.length > 0) {
        const dbCounts = {};
        targetData.forEach(row => {
          if (row.target_handle) {
            dbCounts[row.target_handle] = Number(row.strike_count || 0);
          }
        });
        saveLocalStrikeCounts(dbCounts);
        return dbCounts;
      }

      // 2. Fallback / Sync with campaign_stats table (global tweets)
      const { data: statsData, error: statsError } = await supabase
        .from('campaign_stats')
        .select('tweets')
        .eq('id', 'global')
        .single();

      if (statsData && !statsError) {
        const totalTweets = Number(statsData.tweets || 0);
        try {
          localStorage.setItem(GLOBAL_TWEETS_KEY, totalTweets.toString());
        } catch {}
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
  const cleanHandle = handle.replace('@', '').trim();

  // 1. Optimistic local update
  const current = getLocalStrikeCounts();
  const newCount = (current[cleanHandle] || 0) + 1;
  const updated = { ...current, [cleanHandle]: newCount };
  saveLocalStrikeCounts(updated);

  // 2. Sync to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      // Attempt to increment target_strikes table if created in SQL editor
      const { error: upsertErr } = await supabase
        .from('target_strikes')
        .upsert({
          target_handle: cleanHandle,
          strike_count: newCount,
          updated_at: new Date().toISOString()
        }, { onConflict: 'target_handle' });

      if (upsertErr) {
        // Table not yet created in Supabase SQL editor; gracefully handled
        console.info('target_strikes table not yet created in Supabase; local strike count used.');
      }
    } catch (err) {
      console.warn('Supabase target_strikes sync failed (offline fallback):', err);
    }
  }

  return updated;
}

// Subscribe to real-time changes across all devices (mobile, desktop, etc.)
export function subscribeToTargetStrikes(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    // 1. Channel for target_strikes table
    const targetChannel = supabase
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

    // 2. Channel for campaign_stats table (global tweets)
    const statsChannel = supabase
      .channel('strike_campaign_stats_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'campaign_stats', filter: 'id=eq.global' },
        (payload) => {
          if (payload.new) {
            const tweets = Number(payload.new.tweets || 0);
            try {
              localStorage.setItem(GLOBAL_TWEETS_KEY, tweets.toString());
            } catch {}
            if (onUpdate) {
              const current = getLocalStrikeCounts();
              onUpdate({ ...current, _globalTweets: tweets });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(targetChannel);
      supabase.removeChannel(statsChannel);
    };
  } catch (e) {
    console.warn('Could not subscribe to realtime strike channels:', e);
    return () => {};
  }
}
