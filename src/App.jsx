import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PdfViewer from './components/PdfViewer';
import VoiceAssistant from './components/VoiceAssistant';
import ApiKeyModal from './components/ApiKeyModal';
import { getSavedApiKey, getSavedModel } from './lib/openai';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentModel, setCurrentModel] = useState('gpt-4o-mini');
  const [activeTab, setActiveTab] = useState('chat'); // 'pdf' | 'chat' (for mobile)
  const [pendingQuery, setPendingQuery] = useState('');

  // Check if API key is configured on mount
  useEffect(() => {
    const key = getSavedApiKey();
    setHasApiKey(Boolean(key && key.trim().length > 0));
    setCurrentModel(getSavedModel());

    // If no key is set yet, show settings modal after a short delay
    if (!key || !key.trim()) {
      const timer = setTimeout(() => {
        setIsSettingsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleKeySaved = (key, model) => {
    setHasApiKey(Boolean(key && key.trim().length > 0));
    if (model) setCurrentModel(model);
  };

  const handleAskQuestionFromPdf = (query) => {
    setPendingQuery(query);
    setActiveTab('chat'); // switch tab on mobile if clicked
    // Clear pending query after triggering
    setTimeout(() => setPendingQuery(''), 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        hasApiKey={hasApiKey}
        currentModel={currentModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-4.25rem)] min-h-[600px]">
        
        {/* Left Pane: PDF Container (5 cols on lg) */}
        <div className={`h-full ${
          activeTab === 'pdf' ? 'block' : 'hidden lg:block'
        } lg:col-span-6 xl:col-span-7 min-h-0`}>
          <PdfViewer onAskQuestion={handleAskQuestionFromPdf} />
        </div>

        {/* Right Pane: Voice & Chat AI Assistant (7 cols on lg) */}
        <div className={`h-full ${
          activeTab === 'chat' ? 'block' : 'hidden lg:block'
        } lg:col-span-6 xl:col-span-5 min-h-0`}>
          <VoiceAssistant
            onOpenSettings={() => setIsSettingsOpen(true)}
            defaultQuery={pendingQuery}
          />
        </div>

      </main>

      {/* OpenAI API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={handleKeySaved}
      />

    </div>
  );
}
