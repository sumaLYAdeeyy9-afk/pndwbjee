import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveCounter from './components/LiveCounter';
import EmailTool from './components/EmailTool';
import ShareCampaign from './components/ShareCampaign';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Lazy-loaded routes & heavy components for instant initial page loading & zero clutter
const TargetDispatchPage = lazy(() => import('./components/TargetDispatchPage'));
const AdminSubmissionsModal = lazy(() => import('./components/AdminSubmissionsModal'));
const Directory = lazy(() => import('./components/Directory'));

function SectionLoader() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3 p-8 text-center">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
        Loading...
      </span>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('email-tool');
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isStrikeQuery = params.get('page') === 'strike' || params.get('page') === 'dispatch';
      const isStrikeHash = window.location.hash.toLowerCase().includes('strike') || window.location.hash.toLowerCase().includes('dispatch');
      const isStrikePath = window.location.pathname.toLowerCase().includes('/strike') || window.location.pathname.toLowerCase().includes('/dispatch');
      if (isStrikeQuery || isStrikeHash || isStrikePath) return 'strike';
    }
    return 'main';
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Real Community Stats initialized starting strictly from 0
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('pnd_wbjee_stats_v10_live');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      emails: 0,
      tweets: 0
    };
  });

  // Check URL routes (?page=strike, /strike, #strike, ?admin=true, #admin, /admin)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkRoutes = () => {
        const params = new URLSearchParams(window.location.search);
        const hasAdminParam = params.has('admin');
        const hasAdminHash = window.location.hash.toLowerCase().includes('admin');
        const hasAdminPath = window.location.pathname.toLowerCase().endsWith('/admin');

        if (hasAdminParam || hasAdminHash || hasAdminPath) {
          setIsAdminOpen(true);
        }

        const isStrikeQuery = params.get('page') === 'strike' || params.get('page') === 'dispatch';
        const isStrikeHash = window.location.hash.toLowerCase().includes('strike') || window.location.hash.toLowerCase().includes('dispatch');
        const isStrikePath = window.location.pathname.toLowerCase().includes('/strike') || window.location.pathname.toLowerCase().includes('/dispatch');

        if (isStrikeQuery || isStrikeHash || isStrikePath) {
          setCurrentPage('strike');
        } else if (!hasAdminParam && !hasAdminHash) {
          // If explicitly navigating home
          if (window.location.hash === '' || window.location.hash === '#top') {
            setCurrentPage('main');
          }
        }
      };

      checkRoutes();
      window.addEventListener('popstate', checkRoutes);
      window.addEventListener('hashchange', checkRoutes);

      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsAdminOpen(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('popstate', checkRoutes);
        window.removeEventListener('hashchange', checkRoutes);
        window.removeEventListener('keydown', handleKeyDown);
      };
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
            emails: data.emails || 0,
            tweets: data.tweets || 0
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
              emails: payload.new.emails || 0,
              tweets: payload.new.tweets || 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to local storage as fallback safely
  useEffect(() => {
    try {
      localStorage.setItem('pnd_wbjee_stats_v10_live', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Increment action handler with optimistic local update and Supabase sync
  const handleActionCompleted = async (type = 'emails') => {
    const statKey = (type === 'email' || type === 'emails') ? 'emails' : 'tweets';

    // 1. Optimistic local increment
    setStats(prev => {
      const currentVal = Number(prev[statKey] || 0);
      const updated = {
        ...prev,
        [statKey]: currentVal + 1
      };

      // 2. Sync to Supabase
      if (isSupabaseConfigured && supabase) {
        supabase.rpc('increment_campaign_stat', { stat_column: statKey }).then(({ error }) => {
          if (error) {
            supabase
              .from('campaign_stats')
              .update({ [statKey]: updated[statKey], updated_at: new Date().toISOString() })
              .eq('id', 'global')
              .catch(console.error);
          }
        }).catch(() => {
          supabase
            .from('campaign_stats')
            .update({ [statKey]: updated[statKey], updated_at: new Date().toISOString() })
            .eq('id', 'global')
            .catch(console.error);
        });
      }

      return updated;
    });
  };

  const navigateToStrike = () => {
    setCurrentPage('strike');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '?page=strike');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToMain = () => {
    setCurrentPage('main');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToEmail = () => {
    setCurrentPage('main');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
    setTimeout(() => {
      const element = document.getElementById('email-tool');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToSection = (id) => {
    if (currentPage !== 'main') {
      navigateToMain();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        onNavigateToStrike={navigateToStrike}
        currentPage={currentPage}
      />

      {currentPage === 'strike' ? (
        <Suspense fallback={<SectionLoader />}>
          <TargetDispatchPage 
            onBackToMain={navigateToMain}
            onNavigateToEmail={navigateToEmail}
            onActionCompleted={handleActionCompleted}
            globalStats={stats}
          />
        </Suspense>
      ) : (
        <main className="flex-1">
          <EmailTool 
            onActionCompleted={handleActionCompleted} 
          />

          <Hero 
            scrollToSection={scrollToSection} 
          />

          <LiveCounter 
            stats={stats} 
          />

          <ShareCampaign />

          <Suspense fallback={<SectionLoader />}>
            <Directory />
          </Suspense>
        </main>
      )}

      <Footer />

      {/* Password-Protected Admin Submissions Log & CSV Exporter Modal */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminSubmissionsModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
