import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-2xl font-black">
          🚀
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Ready for Your New Project
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          The canvas has been completely cleaned and reset. Tell me what you would like to build!
        </p>
      </div>
    </div>
  );
}
