import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'wbjee_target_strike_counts_v1';

// Base initial community counts for realistic live engagement
const SEED_STRIKE_COUNTS = {
  'Tamal0401': 148,
  'snigspeak': 94,
  'mayukhrghosh': 212,
  'KamalikaSengupt': 88,
  'pooja_news': 65,
  'iindrojit': 176,
  'manogyaloiwal': 134,
  'ritayanbasu': 58,
  'SauravDassss': 118,
  'anubha1812': 284,
  'Vivekpandey21': 320,
  'advocate_alakh': 245,
  'abhijeet_dipke': 410,
  'CJP_2029': 580,
  'MinakshiMukher8': 365,
  'KunalGhoshAgain': 490,
  'SaketGokhale': 162,
  'derekobrienmp': 128,
  'salimdotcomrade': 310,
  'DrSukantaBJP': 275,
  'paulagnimitra1': 230,
  'amitmalviya': 195,
  'SuvenduWB': 540
};

// Get stored local counts combined with seeds
export function getLocalStrikeCounts() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...SEED_STRIKE_COUNTS, ...parsed };
    }
  } catch (e) {
    console.error(e);
  }
  return { ...SEED_STRIKE_COUNTS };
}

// Save local counts
export function saveLocalStrikeCounts(counts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error(e);
  }
}

// Fetch strike counts from Supabase with local fallback
export async function fetchTargetStrikeCounts() {
  const local = getLocalStrikeCounts();
  
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('target_strikes')
        .select('target_handle, strike_count');

      if (data && !error && data.length > 0) {
        const merged = { ...local };
        data.forEach(row => {
          if (row.target_handle) {
            merged[row.target_handle] = (merged[row.target_handle] || SEED_STRIKE_COUNTS[row.target_handle] || 0) + (row.strike_count || 0);
          }
        });
        saveLocalStrikeCounts(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Could not fetch from Supabase target_strikes:', err);
    }
  }

  return local;
}

// Increment strike for a specific target handle
export async function incrementTargetStrike(handle) {
  if (!handle) return;
  const cleanHandle = handle.replace('@', '').trim();

  // 1. Update local storage
  const current = getLocalStrikeCounts();
  const newCount = (current[cleanHandle] || SEED_STRIKE_COUNTS[cleanHandle] || 0) + 1;
  const updated = { ...current, [cleanHandle]: newCount };
  saveLocalStrikeCounts(updated);

  // 2. Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      // Attempt upsert or increment
      await supabase
        .from('target_strikes')
        .upsert({
          target_handle: cleanHandle,
          strike_count: newCount,
          updated_at: new Date().toISOString()
        }, { onConflict: 'target_handle' });
    } catch (err) {
      console.warn('Supabase target_strikes upsert failed:', err);
    }
  }

  return updated;
}

// Subscribe to real-time changes
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
            const count = payload.new.strike_count;
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
