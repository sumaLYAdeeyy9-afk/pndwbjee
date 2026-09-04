import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PdfViewer from './components/PdfViewer';
import VoiceAssistant from './components/VoiceAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'pdf' | 'chat' (for mobile)
  const [pendingQuery, setPendingQuery] = useState('');

  const handleAskQuestionFromPdf = (query) => {
    setPendingQuery(query);
    setActiveTab('chat'); // switch tab on mobile if clicked
    setTimeout(() => setPendingQuery(''), 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-4.25rem)] min-h-[600px]">
        
        {/* Left Pane: PDF Container (5-6 cols on desktop) */}
        <div className={`h-full ${
          activeTab === 'pdf' ? 'block' : 'hidden lg:block'
        } lg:col-span-6 xl:col-span-7 min-h-0`}>
          <PdfViewer onAskQuestion={handleAskQuestionFromPdf} />
        </div>

        {/* Right Pane: Voice & Chat AI Assistant (6-7 cols on desktop) */}
        <div className={`h-full ${
          activeTab === 'chat' ? 'block' : 'hidden lg:block'
        } lg:col-span-6 xl:col-span-5 min-h-0`}>
          <VoiceAssistant
            defaultQuery={pendingQuery}
          />
        </div>

      </main>

    </div>
  );
}
