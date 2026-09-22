import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Caught by Boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndRecover = () => {
    try {
      // Clear local storage and caches if corrupted
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans selection:bg-rose-500 selection:text-white">
          <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Temporary Loading Glitch
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your browser may have cached an older script or restricted local storage cookies. Tap below to reload fresh.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/50 transition-all active:scale-[0.98] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Campaign</span>
              </button>

              <button
                onClick={this.handleResetAndRecover}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 border border-slate-700/60 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear Cache & Open Home</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono">
                WBJEE 2026 Student Advocacy Portal
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
