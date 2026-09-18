import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EmailTool from './components/EmailTool';
import ShareCampaign from './components/ShareCampaign';
import Directory from './components/Directory';
import Footer from './components/Footer';
import AdminSubmissionsModal from './components/AdminSubmissionsModal';

export default function App() {
  const [activeSection, setActiveSection] = useState('email-tool');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check URL routes (?admin=true, #admin, /admin) or key combination Ctrl+Shift+A
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAdminTriggers = () => {
        const params = new URLSearchParams(window.location.search);
        const hasAdminParam = params.has('admin');
        const hasAdminHash = window.location.hash.toLowerCase().includes('admin');
        const hasAdminPath = window.location.pathname.toLowerCase().endsWith('/admin');

        if (hasAdminParam || hasAdminHash || hasAdminPath) {
          setIsAdminOpen(true);
        }
      };

      checkAdminTriggers();
      window.addEventListener('popstate', checkAdminTriggers);
      window.addEventListener('hashchange', checkAdminTriggers);

      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsAdminOpen(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('popstate', checkAdminTriggers);
        window.removeEventListener('hashchange', checkAdminTriggers);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

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
        <EmailTool />

        <Hero 
          scrollToSection={scrollToSection} 
        />

        <ShareCampaign />

        <Directory />
      </main>

      <Footer />

      {/* Password-Protected Admin Submissions Log & CSV Exporter Modal */}
      <AdminSubmissionsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
