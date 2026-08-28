import React, { useState } from 'react';
import { Flame, Mail, MessageSquare, Share2, PhoneCall, ShieldAlert, Menu, X } from 'lucide-react';
import { TwitterIcon } from './Icons';

export default function Navbar({ activeSection, scrollToSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'email-tool', label: 'Email Authorities', icon: Mail, highlight: true },
    { id: 'twitter-storm', label: 'X (Twitter) Storm', icon: TwitterIcon },
    { id: 'grievance-wall', label: 'Incident Wall', icon: MessageSquare },
    { id: 'share-campaign', label: 'Mobilize', icon: Share2 },
    { id: 'directory', label: 'Contacts & FAQ', icon: PhoneCall },
  ];

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-2 ring-rose-500/30">
              <span className="text-xl font-black text-white tracking-tighter">PND</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold text-white tracking-tight">Play<span className="text-rose-500">No</span>Dice</span>
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">WBJEE Campaign</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5 hidden sm:block">Digital Advocacy & Action Portal</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    item.highlight 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40' 
                      : isActive 
                        ? 'bg-slate-800 text-rose-400 border border-rose-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live Action Badge & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-2.5"></span>
              <span className="font-semibold text-[11px] text-emerald-400">Campaign Live</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  item.highlight
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
