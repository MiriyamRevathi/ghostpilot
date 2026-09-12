import React, { useState, useEffect } from 'react';
import { SystemSettings } from '../types';
import { api } from '../services/api';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Check,
  Sliders
} from 'lucide-react';

interface Props {
  settings: SystemSettings;
  onUpdateSettings: (s: Partial<SystemSettings>) => void;
}

export const SettingsPage: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [inferenceStatus, setInferenceStatus] = useState<any>(null);

  useEffect(() => {
    setLocalSettings(settings);
    api.getInferenceStatus().then(setInferenceStatus).catch(console.error);
  }, [settings]);

  const handleSave = async () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="settings-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Settings & Privacy Guarantees
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Fine-tune behavioral triggers, speculative thresholds, and verify zero-cloud local security.
          </p>
        </div>

        <button
          id="settings-save-btn"
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 shadow-lg"
        >
          {saved ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span>{saved ? 'Preferences Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 font-mono text-xs shadow-2xl">
        <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Local-First Zero-Telemetry Guarantees</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#A9A9B3]">
          <div className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-1">
            <div className="font-bold text-[#E0E0E6]">100% Local Execution</div>
            <p className="text-[#8E8E93] text-[11px]">
              AST analysis, logistic regression inference, and code synthesis run completely on your local host.
            </p>
          </div>
          <div className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-1">
            <div className="font-bold text-[#E0E0E6]">Zero Cloud Database Required</div>
            <p className="text-[#8E8E93] text-[11px]">
              No Firebase, no cloud SQL, no external accounts. All state lives exclusively in memory and local process cache.
            </p>
          </div>
          <div className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-1">
            <div className="font-bold text-[#E0E0E6]">No External API Keys</div>
            <p className="text-[#8E8E93] text-[11px]">
              Does not require OpenAI, Gemini, or third-party paid keys to operate.
            </p>
          </div>
          <div className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-1">
            <div className="font-bold text-[#E0E0E6]">Zero Keystroke Telemetry</div>
            <p className="text-[#8E8E93] text-[11px]">
              Raw keypresses are never logged or stored; only aggregated statistical cadence intervals are evaluated.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Card 1: Behavioral & Speculative Toggles */}
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 shadow-2xl">
          <h2 className="font-bold text-[#E0E0E6] border-b border-[#1F1F23] pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Behavioral & Speculative Triggers</span>
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-[#E0E0E6] font-semibold">Behavioral Tracking</div>
                <div className="text-[11px] text-[#66666E]">Monitor typing cadence, pauses, and backspaces</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.behavioralTrackingEnabled}
                onChange={e =>
                  setLocalSettings({ ...localSettings, behavioralTrackingEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-[#E0E0E6] font-semibold">Speculative Generation</div>
                <div className="text-[11px] text-[#66666E]">Pre-compute candidate fixes when confidence &gt; threshold</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.speculativeGenerationEnabled}
                onChange={e =>
                  setLocalSettings({ ...localSettings, speculativeGenerationEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-blue-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-[#E0E0E6] font-semibold">Gaze Tracking (Prototype)</div>
                <div className="text-[11px] text-[#66666E]">Enable local spatial screen attention tracking</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.gazeTrackingEnabled}
                onChange={e =>
                  setLocalSettings({ ...localSettings, gazeTrackingEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-blue-500"
              />
            </label>

            <div className="space-y-2 pt-3 border-t border-[#1F1F23]">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Confidence Threshold for Speculation</span>
                <span className="text-blue-400 font-bold">
                  {Math.round(localSettings.confidenceThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={localSettings.confidenceThreshold}
                onChange={e =>
                  setLocalSettings({ ...localSettings, confidenceThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500 bg-[#0D0D10]"
              />
              <div className="text-[11px] text-[#66666E]">
                Fixes are only pre-computed when intent probability exceeds this cutoff.
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">Cache Retention Duration</span>
                <span className="text-blue-300 font-bold">{localSettings.cacheDurationSec} sec</span>
              </div>
              <input
                type="range"
                min="60"
                max="600"
                step="30"
                value={localSettings.cacheDurationSec}
                onChange={e =>
                  setLocalSettings({ ...localSettings, cacheDurationSec: parseInt(e.target.value) })
                }
                className="w-full accent-blue-500 bg-[#0D0D10]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Local AI & Inference Provider */}
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 shadow-2xl">
          <h2 className="font-bold text-[#E0E0E6] border-b border-[#1F1F23] pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Optional Local LLM (Ollama)</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] text-[11px] text-[#8E8E93] space-y-1.5">
              <div className="text-[#E0E0E6] font-semibold">Active Synthesis Mode:</div>
              <div className="text-green-400 font-bold">
                Local Rule-Based & AST Synthesis Engine
              </div>
              <p>
                GhostPilot operates completely standalone out of the box using built-in AST heuristics and regression models. If you have Ollama running locally, you can optionally connect it below.
              </p>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-[#E0E0E6] font-semibold">Enable Local Ollama Adapter</div>
                <div className="text-[11px] text-[#66666E]">Route synthesis through local Ollama daemon</div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.localLlmEnabled}
                onChange={e =>
                  setLocalSettings({ ...localSettings, localLlmEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-blue-500"
              />
            </label>

            <div>
              <label className="block text-[#8E8E93] mb-1">Ollama HTTP Endpoint</label>
              <input
                type="text"
                value={localSettings.ollamaEndpoint}
                onChange={e => setLocalSettings({ ...localSettings, ollamaEndpoint: e.target.value })}
                className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                placeholder="http://localhost:11434"
              />
            </div>

            <div>
              <label className="block text-[#8E8E93] mb-1">Local Model Tag</label>
              <select
                value={localSettings.modelName}
                onChange={e => setLocalSettings({ ...localSettings, modelName: e.target.value })}
                className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
              >
                <option value="codellama">codellama (7b)</option>
                <option value="deepseek-coder">deepseek-coder (6.7b)</option>
                <option value="starcoder2">starcoder2 (3b)</option>
                <option value="llama3">llama3 (8b)</option>
              </select>
            </div>

            <div className="p-3 bg-[#0D0D10] rounded-lg border border-[#1F1F23] text-[10px] text-[#66666E]">
              Connection Status: {inferenceStatus?.status || 'Offline (Graceful local fallback active)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
