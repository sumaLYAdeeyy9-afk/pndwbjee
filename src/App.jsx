import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveCounter from './components/LiveCounter';
import EmailTool from './components/EmailTool';
import TwitterStorm from './components/TwitterStorm';
import GrievanceWall from './components/GrievanceWall';
import ShareCampaign from './components/ShareCampaign';
import Directory from './components/Directory';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // Real Community Stats (Fallback to localStorage if Supabase is not connected yet)
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('pnd_wbjee_stats_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      emails: 0,
      tweets: 0,
      stories: 0
    };
  });

  // Load and subscribe to real-time stats from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // 1. Fetch current global stats
    async function fetchGlobalStats() {
      const { data, error } = await supabase
        .from('campaign_stats')
        .select('*')
        .eq('id', 'global')
        .single();

      if (data && !error) {
        setStats({
          emails: data.emails || 0,
          tweets: data.tweets || 0,
          stories: data.stories || 0
        });
      }
    }

    fetchGlobalStats();

    // 2. Subscribe to live changes
    const channel = supabase
      .channel('campaign_stats_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'campaign_stats', filter: 'id=eq.global' },
        (payload) => {
          if (payload.new) {
            setStats({
              emails: payload.new.emails || 0,
              tweets: payload.new.tweets || 0,
              stories: payload.new.stories || 0
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
    localStorage.setItem('pnd_wbjee_stats_v2', JSON.stringify(stats));
  }, [stats]);

  // Increment action handler
  const handleActionCompleted = async (type) => {
    // Optimistic local increment
    setStats(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));

    // If Supabase is connected, call increment RPC or update
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.rpc('increment_campaign_stat', { stat_column: type });
      } catch (err) {
        console.error('Failed to sync stat to Supabase:', err);
      }
    }
  };

  // Story submitted handler
  const handleStorySubmitted = () => {
    handleActionCompleted('stories');
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
        />

        <TwitterStorm 
          onActionCompleted={handleActionCompleted} 
        />

        <GrievanceWall 
          onStorySubmitted={handleStorySubmitted} 
        />

        <ShareCampaign 
          stats={stats} 
        />

        <Directory />
      </main>

      <Footer 
        scrollToSection={scrollToSection} 
      />
    </div>
  );
}
