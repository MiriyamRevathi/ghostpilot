import React, { useState } from 'react';
import { DeveloperSignals, CognitiveLoadLevel } from '../types';
import { CognitiveLoadBadge } from '../components/CognitiveLoadBadge';
import {
  Activity,
  Sliders,
  Keyboard,
  Timer,
  Delete,
  MousePointer2,
  Terminal,
  Clock
} from 'lucide-react';

interface Props {
  signals: DeveloperSignals;
  cognitiveLoad: CognitiveLoadLevel;
  onUpdateSignals: (sigs: Partial<DeveloperSignals>) => void;
  onRunPrediction: () => void;
}

export const BehavioralSignalsPage: React.FC<Props> = ({
  signals,
  cognitiveLoad,
  onUpdateSignals,
  onRunPrediction,
}) => {
  const [localSignals, setLocalSignals] = useState<DeveloperSignals>(signals);

  const handleChange = (key: keyof DeveloperSignals, val: number) => {
    const updated = { ...localSignals, [key]: val };
    setLocalSignals(updated);
    onUpdateSignals({ [key]: val });
  };

  const applyPreset = (preset: Partial<DeveloperSignals>) => {
    const updated = { ...localSignals, ...preset };
    setLocalSignals(updated);
    onUpdateSignals(preset);
  };

  return (
    <div id="behavioral-signals-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Developer Behavioral Signals
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Subtle behavioral telemetry: typing pauses, backspace bursts, cursor movements, and cognitive load.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <CognitiveLoadBadge level={cognitiveLoad} />
        </div>
      </div>

      {/* Preset simulation buttons */}
      <div className="p-4 bg-[#16161A] border border-[#1F1F23] rounded-xl space-y-2.5 font-mono text-xs shadow-md">
        <div className="text-[#66666E] text-[10px] uppercase tracking-wider font-bold">
          Simulate Real-World Developer States:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              applyPreset({
                pause_duration: 5.2,
                backspace_count: 5,
                typing_speed: 12,
                terminal_activity: 1,
                error_count: 1,
                time_on_problem: 55,
              });
              setTimeout(onRunPrediction, 50);
            }}
            className="px-3 py-1.5 bg-red-950/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-900/30 transition text-xs"
          >
            Blocked / Debugging Panic (High Friction)
          </button>

          <button
            onClick={() => {
              applyPreset({
                pause_duration: 0.8,
                backspace_count: 1,
                typing_speed: 78,
                terminal_activity: 0,
                error_count: 0,
                time_on_problem: 10,
              });
              setTimeout(onRunPrediction, 50);
            }}
            className="px-3 py-1.5 bg-green-950/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-900/30 transition text-xs"
          >
            Flow State / Rapid Coding (Low Friction)
          </button>

          <button
            onClick={() => {
              applyPreset({
                pause_duration: 3.2,
                backspace_count: 2,
                typing_speed: 40,
                terminal_activity: 1,
                error_count: 0,
                time_on_problem: 25,
              });
              setTimeout(onRunPrediction, 50);
            }}
            className="px-3 py-1.5 bg-blue-950/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-900/30 transition text-xs"
          >
            Test Writing Cadence
          </button>

          <button
            onClick={() => {
              applyPreset({
                pause_duration: 6.5,
                backspace_count: 0,
                typing_speed: 5,
                cursor_movement: 4.5,
                mouse_activity: 3.8,
                time_on_problem: 60,
              });
              setTimeout(onRunPrediction, 50);
            }}
            className="px-3 py-1.5 bg-orange-950/20 border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-900/30 transition text-xs"
          >
            Codebase Exploration / Reading
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Typing Speed</span>
            <Keyboard className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-[#E0E0E6]">{signals.typing_speed} WPM</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Pause Duration</span>
            <Timer className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-orange-300">{signals.pause_duration}s</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Backspace Count</span>
            <Delete className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-300">{signals.backspace_count} edits</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Cursor Jumps</span>
            <MousePointer2 className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="text-xl font-bold text-blue-300">{signals.cursor_movement}/min</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Terminal</span>
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className={`text-sm font-bold ${signals.terminal_activity > 0 ? 'text-purple-400' : 'text-[#66666E]'}`}>
            {signals.terminal_activity > 0 ? 'ACTIVE' : 'IDLE'}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#66666E]">
            <span>Time on Task</span>
            <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
          </div>
          <div className="text-xl font-bold text-[#E0E0E6]">{signals.time_on_problem}s</div>
        </div>
      </div>

      {/* Interactive Signal Sliders Grid */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h2 className="font-mono text-sm font-bold text-[#E0E0E6]">
              Interactive Signal Calibration & Simulation
            </h2>
          </div>
          <span className="text-xs font-mono text-[#66666E]">
            Changes immediately propagate to the local ML model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Pause duration slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>Pause Duration (Typing Hesitation)</span>
              <span className="text-blue-400 font-bold">{localSignals.pause_duration} sec</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.2"
              value={localSignals.pause_duration}
              onChange={e => handleChange('pause_duration', parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-[#0D0D10]"
            />
            <div className="text-[11px] text-[#66666E]">Pauses &gt; 3.0s strongly signal problem deliberation or reading error diagnostics.</div>
          </div>

          {/* Typing speed slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>Typing Speed (WPM)</span>
              <span className="text-blue-400 font-bold">{localSignals.typing_speed} WPM</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="1"
              value={localSignals.typing_speed}
              onChange={e => handleChange('typing_speed', parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-[#0D0D10]"
            />
            <div className="text-[11px] text-[#66666E]">High speed signals flow state; low speed indicates debugging hesitation.</div>
          </div>

          {/* Backspace frequency slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>Backspace Frequency (Edit Bursts)</span>
              <span className="text-red-400 font-bold">{localSignals.backspace_count} edits</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={localSignals.backspace_count}
              onChange={e => handleChange('backspace_count', parseInt(e.target.value))}
              className="w-full accent-red-500 bg-[#0D0D10]"
            />
            <div className="text-[11px] text-[#66666E]">Repeated rapid backspaces reflect syntax friction or uncertain logic.</div>
          </div>

          {/* Time on problem slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>Time Spent on Problem</span>
              <span className="text-orange-400 font-bold">{localSignals.time_on_problem} sec</span>
            </div>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={localSignals.time_on_problem}
              onChange={e => handleChange('time_on_problem', parseFloat(e.target.value))}
              className="w-full accent-orange-500 bg-[#0D0D10]"
            />
            <div className="text-[11px] text-[#66666E]">Prolonged time on a single line increases confidence for DEBUG_ERROR or EXPLAIN_ERROR.</div>
          </div>

          {/* Terminal activity toggle */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>Terminal Activity</span>
              <span className="text-purple-400 font-bold">
                {localSignals.terminal_activity > 0 ? 'ACTIVE (exit code 1)' : 'IDLE'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('terminal_activity', 1)}
                className={`flex-1 py-2 rounded-lg border transition text-xs font-semibold ${
                  localSignals.terminal_activity > 0
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                    : 'bg-[#0D0D10] border-[#1F1F23] text-[#8E8E93]'
                }`}
              >
                Active Test/Build Failure
              </button>
              <button
                onClick={() => handleChange('terminal_activity', 0)}
                className={`flex-1 py-2 rounded-lg border transition text-xs font-semibold ${
                  localSignals.terminal_activity === 0
                    ? 'bg-[#1F1F23] border-[#1F1F23] text-white'
                    : 'bg-[#0D0D10] border-[#1F1F23] text-[#8E8E93]'
                }`}
              >
                Idle
              </button>
            </div>
          </div>

          {/* Error Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-[#E0E0E6]">
              <span>LSP Diagnostic Count</span>
              <span className="text-red-400 font-bold">{localSignals.diagnostic_count} diagnostics</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={localSignals.diagnostic_count}
              onChange={e => {
                const c = parseInt(e.target.value);
                handleChange('diagnostic_count', c);
                handleChange('error_count', c);
              }}
              className="w-full accent-red-500 bg-[#0D0D10]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1F1F23] flex justify-end">
          <button
            onClick={onRunPrediction}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold rounded-lg shadow-lg transition active:scale-95"
          >
            <Activity className="w-4 h-4" />
            <span>Re-Compute Intent with Updated Signals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
