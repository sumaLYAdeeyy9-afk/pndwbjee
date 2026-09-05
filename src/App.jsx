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
  
  // Selected node ID on flowchart for focused inspection
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Compute deterministic simulation result in real-time
  const simulationResult = useMemo(() => {
    return simulateDcPath(constraints);
  }, [constraints]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeViewTab={activeViewTab}
        onViewTabChange={setActiveViewTab}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-4.25rem)] min-h-[620px]">
        
        {/* Left Pane: PDF Container (5 cols on desktop, full height) */}
        <div className={`h-full ${
          activeViewTab === 'pdf' ? 'block' : 'hidden lg:block'
        } lg:col-span-5 xl:col-span-5 min-h-0`}>
          <PdfViewer />
        </div>

        {/* Right Pane: Flowchart, Simulator & Strategy Dossier (7 cols on desktop) */}
        <div className={`h-full ${
          activeViewTab !== 'pdf' ? 'block' : 'hidden lg:block'
        } lg:col-span-7 xl:col-span-7 min-h-0 flex flex-col`}>
          
          {/* Active View Component Rendering */}
          {activeViewTab === 'flowchart' && (
            <FlowchartViewer
              simulationResult={simulationResult}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          )}

          {activeViewTab === 'simulator' && (
            <SimulationEngine
              constraints={constraints}
              onConstraintsChange={setConstraints}
            />
          )}

          {activeViewTab === 'dossier' && (
            <SimulationSummary
              simulationResult={simulationResult}
            />
          )}

          {/* Desktop Fallback if mobile tab was set to pdf */}
          {activeViewTab === 'pdf' && (
            <div className="hidden lg:block h-full">
              <FlowchartViewer
                simulationResult={simulationResult}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
              />
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
