import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import PdfViewer from './components/PdfViewer';
import FlowchartViewer from './components/FlowchartViewer';
import SimulationEngine from './components/SimulationEngine';
import SimulationSummary from './components/SimulationSummary';
import { DC_PRESETS, simulateDcPath } from './data/flowchartData';

export default function App() {
  // Active top view tab: 'flowchart' | 'simulator' | 'dossier' | 'pdf'
  const [activeViewTab, setActiveViewTab] = useState('flowchart');
  
  // Active selected candidate constraints
  const [constraints, setConstraints] = useState(DC_PRESETS[0].constraints);

  // Compute deterministic simulation result in real-time
  const simulationResult = useMemo(() => {
    return simulateDcPath(constraints);
  }, [constraints]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white font-sans antialiased">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeViewTab={activeViewTab}
        onViewTabChange={setActiveViewTab}
      />

      {/* Main Full-Width Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col h-[calc(100vh-4rem)] min-h-[640px]">
        
        {/* Tab 1: Front Screen - Interactive Scenario Switcher & Progressive Revealed Flowchart */}
        {activeViewTab === 'flowchart' && (
          <div className="flex-1 h-full min-h-0">
            <FlowchartViewer
              simulationResult={simulationResult}
              constraints={constraints}
              onConstraintsChange={setConstraints}
              onOpenDossier={() => setActiveViewTab('dossier')}
            />
          </div>
        )}

        {/* Tab 2: Candidate Constraint Simulator */}
        {activeViewTab === 'simulator' && (
          <div className="flex-1 h-full min-h-0">
            <SimulationEngine
              constraints={constraints}
              onConstraintsChange={setConstraints}
              onViewFlowchart={() => setActiveViewTab('flowchart')}
            />
          </div>
        )}

        {/* Tab 3: Personalized Strategy Dossier */}
        {activeViewTab === 'dossier' && (
          <div className="flex-1 h-full min-h-0">
            <SimulationSummary
              simulationResult={simulationResult}
              onViewFlowchart={() => setActiveViewTab('flowchart')}
            />
          </div>
        )}

        {/* Tab 4: Official 14-Page Notification PDF in Dedicated Separate Section */}
        {activeViewTab === 'pdf' && (
          <div className="flex-1 h-full min-h-0">
            <PdfViewer />
          </div>
        )}

      </main>

    </div>
  );
}
