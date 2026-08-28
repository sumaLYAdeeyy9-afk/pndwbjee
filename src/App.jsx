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

export default function App() {
  // Active section for Navbar
  const [activeSection, setActiveSection] = useState('hero');

  // Real Community Stats (Starting from 0, incremented dynamically with genuine user actions)
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

  // Sync stats to localStorage
  useEffect(() => {
    localStorage.setItem('pnd_wbjee_stats_v2', JSON.stringify(stats));
  }, [stats]);

  // Handler for action increments (e.g. email sent, tweet fired)
  const handleActionCompleted = (type) => {
    setStats(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
  };

  // Handler for story submissions
  const handleStorySubmitted = () => {
    setStats(prev => ({
      ...prev,
      stories: (prev.stories || 0) + 1
    }));
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Sticky Header Navbar */}
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* 1. Hero & Protest Hub */}
        <Hero 
          scrollToSection={scrollToSection} 
        />

        {/* 2. Live Impact Counter */}
        <LiveCounter 
          stats={stats} 
        />

        {/* 3. Action 1: Mass Email Tool */}
        <EmailTool 
          onActionCompleted={handleActionCompleted} 
        />

        {/* 4. Action 2: Coordinated X (Twitter) Storm */}
        <TwitterStorm 
          onActionCompleted={handleActionCompleted} 
        />

        {/* 5. Action 3: Documented Incident Wall */}
        <GrievanceWall 
          onStorySubmitted={handleStorySubmitted} 
        />

        {/* 6. Action 4: Mobilize / Share Campaign */}
        <ShareCampaign 
          stats={stats} 
        />

        {/* 7. Authority Directory & Legal FAQs */}
        <Directory />
      </main>

      {/* Footer */}
      <Footer 
        scrollToSection={scrollToSection} 
      />
    </div>
  );
}
