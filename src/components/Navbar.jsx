import React, { useState } from 'react';
import { Mail, Share2, PhoneCall, Database, Menu, X } from 'lucide-react';

export default function Navbar({ activeSection, scrollToSection, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'email-tool', label: 'Email Authorities', icon: Mail, highlight: true },
    { id: 'share-campaign', label: 'Mobilize Batches', icon: Share2 },
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
          <div className="hidden md:flex items-center space-x-2">
            <nav className="flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
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

            {/* Admin Submissions Log Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700/80 transition-all cursor-pointer"
                title="View All Inputted Candidate Submissions & Export CSV"
              >
                <Database className="w-3.5 h-3.5 text-rose-400" />
                <span>Submissions Log</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2 rounded-lg bg-slate-900 text-rose-400 border border-slate-800 text-xs font-bold"
                title="View Submissions Log"
              >
                <Database className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 animate-in fade-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${
                  item.highlight 
                    ? 'bg-rose-600 text-white font-bold' 
                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-left bg-slate-900 text-rose-400 border border-slate-800"
            >
              <Database className="w-4 h-4" />
              <span>View Candidate Submissions Log & CSV</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
