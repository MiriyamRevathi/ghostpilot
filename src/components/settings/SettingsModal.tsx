import React, { useState } from 'react';
import {
  Settings,
  X,
  Check,
  ShieldCheck,
  Cpu,
  Sparkles,
  Sliders,
  Type,
  Home,
  User,
  RotateCcw,
} from 'lucide-react';
import { EditorSettings } from '../../types/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onSaveSettings: (newSettings: EditorSettings) => void;
  onOpenLandingPage?: () => void;
  onOpenAccount: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenLandingPage,
  onOpenAccount,
}) => {
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings);
  const [activeCategory, setActiveCategory] = useState<'editor' | 'ghostpilot' | 'privacy'>('editor');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    const defaults: EditorSettings = {
      fontSize: 13,
      tabSize: 2,
      theme: 'dark-modern',
      wordWrap: 'on',
      minimap: true,
      autoSave: 'off',
      ghostPilotEnabled: true,
      ghostPilotConfidenceThreshold: 85,
      soundEffects: false,
    };
    setLocalSettings(defaults);
    onSaveSettings(defaults);
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="settings-modal-card"
        className="w-full max-w-2xl bg-[#1e1e1e] border border-[#3c3c3c] rounded-xl shadow-2xl overflow-hidden text-[#cccccc] flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#252526] border-b border-[#333333] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#007acc]/20 border border-[#007acc]/40 flex items-center justify-center text-[#007acc]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Settings & Preferences</h2>
              <p className="text-[11px] text-[#858585]">Configure Editor, GhostPilot AI Telemetry, and Layout</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLandingPage && (
              <button
                onClick={onOpenLandingPage}
                className="px-2.5 py-1 rounded bg-[#2d2d30] hover:bg-[#383838] text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-[#3c3c3c]"
                title="Go to GhostPilot Landing Page"
              >
                <Home className="w-3.5 h-3.5 text-blue-400" />
                <span>Landing Page</span>
              </button>
            )}
            <button
              id="close-settings-btn"
              onClick={onClose}
              className="p-1 rounded hover:bg-[#333333] text-[#858585] hover:text-white transition cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body with Side Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Side Menu */}
          <div className="w-44 bg-[#181818] border-r border-[#2b2b2b] p-2 flex flex-col justify-between shrink-0 select-none">
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('editor')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition text-left cursor-pointer ${
                  activeCategory === 'editor'
                    ? 'bg-[#007acc] text-white'
                    : 'text-[#858585] hover:text-white hover:bg-[#252526]'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Text Editor</span>
              </button>

              <button
                onClick={() => setActiveCategory('ghostpilot')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition text-left cursor-pointer ${
                  activeCategory === 'ghostpilot'
                    ? 'bg-[#007acc] text-white'
                    : 'text-[#858585] hover:text-white hover:bg-[#252526]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GhostPilot AI</span>
              </button>

              <button
                onClick={() => setActiveCategory('privacy')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition text-left cursor-pointer ${
                  activeCategory === 'privacy'
                    ? 'bg-[#007acc] text-white'
                    : 'text-[#858585] hover:text-white hover:bg-[#252526]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security & Keys</span>
              </button>
            </div>

            <div className="p-2 border-t border-[#2b2b2b] space-y-1">
              <button
                onClick={onOpenAccount}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-[#858585] hover:text-white hover:bg-[#252526] transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={handleResetDefaults}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-[#858585] hover:text-amber-300 hover:bg-[#252526] transition cursor-pointer"
                title="Reset all settings to initial defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Setting Fields Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {activeCategory === 'editor' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Editor Appearance & Behavior</h3>
                  <p className="text-xs text-[#858585]">Configure typography, indentation, and visual aids.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Font Size */}
                  <div className="p-3 bg-[#252526] rounded-lg border border-[#333333]">
                    <label className="block text-xs font-medium text-white mb-1.5">Font Size</label>
                    <select
                      value={localSettings.fontSize}
                      onChange={e => setLocalSettings({ ...localSettings, fontSize: Number(e.target.value) })}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value={12}>12 px (Compact)</option>
                      <option value={13}>13 px (Default)</option>
                      <option value={14}>14 px (Comfortable)</option>
                      <option value={16}>16 px (Large)</option>
                    </select>
                  </div>

                  {/* Tab Size */}
                  <div className="p-3 bg-[#252526] rounded-lg border border-[#333333]">
                    <label className="block text-xs font-medium text-white mb-1.5">Tab Indentation</label>
                    <select
                      value={localSettings.tabSize}
                      onChange={e => setLocalSettings({ ...localSettings, tabSize: Number(e.target.value) })}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value={2}>2 Spaces (JS/TS Standard)</option>
                      <option value={4}>4 Spaces (Classic)</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="p-3 bg-[#252526] rounded-lg border border-[#333333]">
                    <label className="block text-xs font-medium text-white mb-1.5">Color Theme</label>
                    <select
                      value={localSettings.theme}
                      onChange={e => setLocalSettings({ ...localSettings, theme: e.target.value as any })}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="dark-modern">Dark Modern (VS Code 2024)</option>
                      <option value="vscode-dark">VS Code Dark+ (Classic)</option>
                      <option value="github-dark">GitHub Dark</option>
                      <option value="dracula">Dracula Official</option>
                    </select>
                  </div>

                  {/* Auto Save */}
                  <div className="p-3 bg-[#252526] rounded-lg border border-[#333333]">
                    <label className="block text-xs font-medium text-white mb-1.5">Auto Save</label>
                    <select
                      value={localSettings.autoSave}
                      onChange={e => setLocalSettings({ ...localSettings, autoSave: e.target.value as any })}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="off">Off (Manual Ctrl+S)</option>
                      <option value="afterDelay">After 1000ms Delay</option>
                      <option value="onFocusChange">On Tab / Focus Switch</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 bg-[#252526] rounded-lg border border-[#333333] cursor-pointer hover:border-[#444] transition">
                    <div>
                      <span className="text-xs font-medium text-white block">Word Wrap</span>
                      <span className="text-[11px] text-[#858585]">Wrap long lines to editor viewport width</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.wordWrap === 'on'}
                      onChange={e => setLocalSettings({ ...localSettings, wordWrap: e.target.checked ? 'on' : 'off' })}
                      className="rounded border-[#3c3c3c] bg-[#181818] text-[#007acc] w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[#252526] rounded-lg border border-[#333333] cursor-pointer hover:border-[#444] transition">
                    <div>
                      <span className="text-xs font-medium text-white block">Minimap Overview</span>
                      <span className="text-[11px] text-[#858585]">Show visual vertical code map in right margin</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.minimap}
                      onChange={e => setLocalSettings({ ...localSettings, minimap: e.target.checked })}
                      className="rounded border-[#3c3c3c] bg-[#181818] text-[#007acc] w-4 h-4"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeCategory === 'ghostpilot' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">GhostPilot AI Autonomous Assistance</h3>
                  <p className="text-xs text-[#858585]">Speculative AST pre-computation, error anticipation, and suggestions.</p>
                </div>

                <label className="flex items-center justify-between p-3 bg-[#252526] rounded-lg border border-[#333333] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white block">GhostPilot Intelligence</span>
                      <span className="text-[11px] text-[#858585]">Proactively synthesize candidate fixes before requested</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.ghostPilotEnabled}
                    onChange={e => setLocalSettings({ ...localSettings, ghostPilotEnabled: e.target.checked })}
                    className="rounded border-[#3c3c3c] bg-[#181818] text-[#007acc] w-4 h-4"
                  />
                </label>

                {/* Slider */}
                <div className="p-4 bg-[#252526] rounded-lg border border-[#333333] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white">Confidence Acceptance Threshold</span>
                    <span className="text-[#007acc] font-mono font-bold">
                      {localSettings.ghostPilotConfidenceThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={98}
                    value={localSettings.ghostPilotConfidenceThreshold}
                    onChange={e =>
                      setLocalSettings({ ...localSettings, ghostPilotConfidenceThreshold: Number(e.target.value) })
                    }
                    className="w-full accent-[#007acc] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#858585]">
                    <span>50% (Eager)</span>
                    <span>85% (Balanced Recommended)</span>
                    <span>98% (Strict)</span>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'privacy' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Local-First Security & Zero API Keys</h3>
                  <p className="text-xs text-[#858585]">GhostPilot guarantees local-first AST evaluation.</p>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>No Third-Party API Keys Required</span>
                  </div>
                  <p className="text-[#a0a0a0] leading-relaxed text-[11.5px]">
                    All code inspections, predictive typing, AST analysis, and diagnostic heuristics run strictly within your browser environment. Your code never leaves your device.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-[#181818] rounded border border-[#2b2b2b] flex justify-between items-center">
                    <span className="text-[#858585]">External Network Calls:</span>
                    <span className="text-emerald-400 font-bold">0 (Blocked)</span>
                  </div>
                  <div className="p-3 bg-[#181818] rounded border border-[#2b2b2b] flex justify-between items-center">
                    <span className="text-[#858585]">API Key Requirements:</span>
                    <span className="text-emerald-400 font-bold">None (100% Free / Local)</span>
                  </div>
                  <div className="p-3 bg-[#181818] rounded border border-[#2b2b2b] flex justify-between items-center">
                    <span className="text-[#858585]">Telemetry & Profiling:</span>
                    <span className="text-white">Strictly In-Memory Client State</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#252526] border-t border-[#333333] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#858585]">
            {savedToast ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Settings saved successfully
              </span>
            ) : (
              <span>Changes apply instantly to current workspace</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded hover:bg-[#333333] text-xs text-[#cccccc] hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-settings-submit-btn"
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-xs font-medium text-white transition cursor-pointer shadow flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
