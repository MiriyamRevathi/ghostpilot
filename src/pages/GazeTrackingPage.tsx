import React, { useState, useEffect } from 'react';
import { GazeContextData } from '../types';
import { Eye, Shield, Crosshair } from 'lucide-react';

interface Props {
  gazeData: GazeContextData;
  onUpdateGaze: (data: Partial<GazeContextData>) => void;
}

export const GazeTrackingPage: React.FC<Props> = ({ gazeData, onUpdateGaze }) => {
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeZone, setActiveZone] = useState<'editor' | 'terminal' | 'error'>(
    gazeData.activeRegion || 'error'
  );

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Simulate natural saccadic eye jumps
      const zones: ('editor' | 'terminal' | 'error')[] = ['error', 'error', 'editor', 'terminal'];
      const nextZone = zones[Math.floor(Math.random() * zones.length)];
      setActiveZone(nextZone);

      let x = 450;
      let y = 320;
      if (nextZone === 'error') {
        x = 520 + Math.floor(Math.random() * 60 - 30);
        y = 280 + Math.floor(Math.random() * 40 - 20);
      } else if (nextZone === 'editor') {
        x = 320 + Math.floor(Math.random() * 80 - 40);
        y = 380 + Math.floor(Math.random() * 60 - 30);
      } else {
        x = 560 + Math.floor(Math.random() * 50 - 25);
        y = 520 + Math.floor(Math.random() * 30 - 15);
      }

      onUpdateGaze({
        activeRegion: nextZone,
        gazeCoordinates: { x, y },
        timeOnErrorSec: nextZone === 'error' ? gazeData.timeOnErrorSec + 0.5 : gazeData.timeOnErrorSec,
        timeOnSourceCodeSec: nextZone === 'editor' ? gazeData.timeOnSourceCodeSec + 0.5 : gazeData.timeOnSourceCodeSec,
        timeOnTerminalSec: nextZone === 'terminal' ? gazeData.timeOnTerminalSec + 0.5 : gazeData.timeOnTerminalSec,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, gazeData, onUpdateGaze]);

  return (
    <div id="gaze-tracking-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-mono mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>Research Prototype • Experimental Signal</span>
          </div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Gaze & Visual Attention Tracker
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Tracks screen-region fixation (Error Diagnostic vs Terminal vs Code) to accelerate intent classification.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            id="gaze-toggle-sim-btn"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-1.5 rounded-lg border transition font-semibold ${
              isSimulating
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/50 shadow-lg'
                : 'bg-[#16161A] border-[#1F1F23] text-[#8E8E93]'
            }`}
          >
            {isSimulating ? 'Active Simulation' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Primary Gaze Focus Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-blue-400" />
              <h2 className="font-mono text-sm font-bold text-[#E0E0E6]">
                Screen Attention Heatmap (IDE Spatial Zones)
              </h2>
            </div>
            <span className="text-xs font-mono text-blue-400 font-semibold">
              Current Focus: {activeZone.toUpperCase()}
            </span>
          </div>

          {/* Simulated IDE Layout with gaze target */}
          <div className="relative h-64 bg-[#0A0A0C] rounded-xl border border-[#1F1F23] p-3 overflow-hidden font-mono text-xs">
            {/* Zone 1: Code Editor */}
            <div
              onClick={() => {
                setActiveZone('editor');
                onUpdateGaze({ activeRegion: 'editor' });
              }}
              className={`absolute top-3 left-3 w-[55%] h-[60%] rounded-lg border p-3 transition cursor-pointer ${
                activeZone === 'editor'
                  ? 'border-blue-400 bg-blue-950/20 shadow-lg shadow-blue-500/10'
                  : 'border-[#1F1F23] bg-[#16161A]/40 text-[#66666E]'
              }`}
            >
              <div className="font-bold text-[#E0E0E6] text-[11px] mb-1">Source Code Editor</div>
              <div className="text-[10px] text-[#8E8E93] space-y-0.5">
                <div>UserService.ts:16</div>
                <div>return this.users.find(...)</div>
              </div>
            </div>

            {/* Zone 2: Error Diagnostics Panel */}
            <div
              onClick={() => {
                setActiveZone('error');
                onUpdateGaze({ activeRegion: 'error' });
              }}
              className={`absolute top-3 right-3 w-[38%] h-[60%] rounded-lg border p-3 transition cursor-pointer ${
                activeZone === 'error'
                  ? 'border-red-400 bg-red-950/30 shadow-lg shadow-red-500/10'
                  : 'border-[#1F1F23] bg-[#16161A]/40 text-[#66666E]'
              }`}
            >
              <div className="font-bold text-red-300 text-[11px] mb-1">Diagnostic Overlay</div>
              <div className="text-[10px] text-red-200/80 space-y-0.5">
                <div>TypeError: Cannot read properties</div>
                <div className="text-[#66666E]">Prolonged fixation detected</div>
              </div>
            </div>

            {/* Zone 3: Terminal */}
            <div
              onClick={() => {
                setActiveZone('terminal');
                onUpdateGaze({ activeRegion: 'terminal' });
              }}
              className={`absolute bottom-3 left-3 right-3 h-[30%] rounded-lg border p-3 transition cursor-pointer ${
                activeZone === 'terminal'
                  ? 'border-purple-400 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                  : 'border-[#1F1F23] bg-[#16161A]/40 text-[#66666E]'
              }`}
            >
              <div className="font-bold text-[#E0E0E6] text-[11px] mb-0.5">Integrated Terminal</div>
              <div className="text-[10px] text-[#8E8E93]">
                FAIL tests/user.test.ts (exit code 1)
              </div>
            </div>

            {/* Live Gaze Target Reticle */}
            <div
              className="absolute w-6 h-6 rounded-full border-2 border-blue-400 bg-blue-400/20 pointer-events-none transition-all duration-700 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-ping"
              style={{
                left: activeZone === 'error' ? '78%' : activeZone === 'editor' ? '30%' : '50%',
                top: activeZone === 'error' ? '30%' : activeZone === 'editor' ? '30%' : '80%',
              }}
            ></div>
          </div>

          <div className="text-[11px] font-mono text-[#8E8E93] flex justify-between">
            <span>Click any zone in the diagram to simulate visual gaze shifts</span>
            <span>Estimated Fixation: {activeZone === 'error' ? '3.8s (Deliberation)' : '1.2s'}</span>
          </div>
        </div>

        {/* Right Col: Attention Breakdown */}
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 font-mono text-xs shadow-2xl">
          <h3 className="font-bold text-[#E0E0E6] border-b border-[#1F1F23] pb-2">
            Cumulative Fixation Time
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[#8E8E93] mb-1">
                <span>Error Diagnostic Zone</span>
                <span className="text-red-400 font-bold">{Math.round(gazeData.timeOnErrorSec * 10) / 10}s</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D0D10] rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8E8E93] mb-1">
                <span>Source Code Context</span>
                <span className="text-blue-400 font-bold">{Math.round(gazeData.timeOnSourceCodeSec * 10) / 10}s</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D0D10] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8E8E93] mb-1">
                <span>Terminal / Test Output</span>
                <span className="text-purple-400 font-bold">{Math.round(gazeData.timeOnTerminalSec * 10) / 10}s</span>
              </div>
              <div className="h-1.5 w-full bg-[#0D0D10] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          {/* Privacy Box */}
          <div className="p-3.5 bg-[#0D0D10] rounded-lg border border-[#1F1F23] space-y-1.5 text-[11px] text-[#8E8E93]">
            <div className="flex items-center gap-1.5 text-green-400 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>100% On-Device Gaze Security</span>
            </div>
            <p className="leading-relaxed">
              Eye landmarks are converted strictly to 2D coordinates in-memory. Video frames are discarded immediately, with zero telemetry dispatched to external clouds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
