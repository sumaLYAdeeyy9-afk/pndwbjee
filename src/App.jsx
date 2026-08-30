import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveCounter from './components/LiveCounter';
import EmailTool from './components/EmailTool';
import ShareCampaign from './components/ShareCampaign';
import Directory from './components/Directory';
import Footer from './components/Footer';
import AdminSubmissionsModal from './components/AdminSubmissionsModal';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Real Community Stats (Fallback to initial stats if Supabase is connecting)
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('pnd_wbjee_stats_v6');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      emails: 0
    };
  });

  // Check URL query param `?admin=true` or hash `#admin` or key combination Ctrl+Shift+A
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }

      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsAdminOpen(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Load and subscribe to real-time stats from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchGlobalStats() {
      try {
        const { data, error } = await supabase
          .from('campaign_stats')
          .select('*')
          .eq('id', 'global')
          .single();

        if (data && !error) {
          setStats({
            emails: data.emails || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats from Supabase:', err);
      }
    }

    fetchGlobalStats();

    // Subscribe to live changes
    const channel = supabase
      .channel('campaign_stats_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'campaign_stats', filter: 'id=eq.global' },
        (payload) => {
          if (payload.new) {
            setStats({
              emails: payload.new.emails || 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to local storage as fallback
  useEffect(() => {
    localStorage.setItem('pnd_wbjee_stats_v6', JSON.stringify(stats));
  }, [stats]);

  // Increment action handler with automatic fallback
  const handleActionCompleted = async (type = 'emails') => {
    // 1. Optimistic local increment
    setStats(prev => {
      const updated = {
        ...prev,
        [type]: (prev[type] || 0) + 1
      };

      // 2. Sync to Supabase
      if (isSupabaseConfigured && supabase) {
        supabase.rpc('increment_campaign_stat', { stat_column: type }).then(({ error }) => {
          if (error) {
            supabase
              .from('campaign_stats')
              .update({ [type]: updated[type], updated_at: new Date().toISOString() })
              .eq('id', 'global')
              .catch(console.error);
          }
        }).catch(() => {
          supabase
            .from('campaign_stats')
            .update({ [type]: updated[type], updated_at: new Date().toISOString() })
            .eq('id', 'global')
            .catch(console.error);
        });
      }

      return updated;
    });
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        <Hero 
          scrollToSection={scrollToSection} 
        />

        <LiveCounter 
          stats={stats} 
        />

        <EmailTool 
          onActionCompleted={handleActionCompleted} 
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        <ShareCampaign />

        <Directory />
      </main>

      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Submissions Log & CSV Exporter Modal */}
      <AdminSubmissionsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
