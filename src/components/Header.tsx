import React from 'react';
import { RefreshCw, Play, RotateCcw, Menu } from 'lucide-react';

interface Props {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onResetDemo: () => void;
  isPredicting: boolean;
  onTriggerPrediction: () => void;
  systemStatus: string;
  vsCodeConnected: boolean;
  activeIntent?: string;
  confidence?: number;
  projectName?: string;
  activeFile?: string;
  cursorLine?: number;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<Props> = ({
  isDemoMode,
  onToggleDemoMode,
  onResetDemo,
  isPredicting,
  onTriggerPrediction,
  systemStatus,
  vsCodeConnected,
  projectName = 'TaskManager',
  activeFile = 'src/services/UserService.ts',
  cursorLine = 16,
  onToggleMobileNav,
}) => {
  return (
    <header
      id="ghostpilot-header"
      className="h-16 border-b border-[#1F1F23] flex items-center justify-between px-4 sm:px-8 bg-[#0D0D10]/80 backdrop-blur-md sticky top-0 z-30 shrink-0"
    >
      {/* Left: Mobile Nav Toggle + Project & Active File */}
      <div className="flex items-center gap-3 sm:gap-6">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-1.5 rounded-md hover:bg-[#1A1A1E] text-[#8E8E93] hover:text-white border border-[#1F1F23] transition"
            title="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col">
          <span className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider">
            Project
          </span>
          <span className="text-sm font-medium text-[#E0E0E6] truncate max-w-[120px] sm:max-w-none">
            {projectName}
          </span>
        </div>

        <div className="w-[1px] h-8 bg-[#1F1F23] hidden sm:block"></div>

        <div className="flex flex-col hidden sm:flex">
          <span className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider">
            Active File
          </span>
          <span className="text-sm font-medium text-blue-400 font-mono truncate max-w-[240px] lg:max-w-none">
            {activeFile}:{cursorLine}
          </span>
        </div>
      </div>

      {/* Right: Status Pills & Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* VS Code Connected Pill */}
        <div className="bg-[#1A1A1E] border border-[#1F1F23] rounded-full px-3.5 py-1 flex items-center gap-2 text-xs text-[#E0E0E6]">
          <span className="text-green-500">●</span>
          <span className="hidden sm:inline">VS Code</span>
          <span>{vsCodeConnected ? 'Connected' : 'Offline'}</span>
        </div>

        {/* Ollama Offline pill */}
        <div className="bg-[#1A1A1E] border border-[#1F1F23] rounded-full px-3.5 py-1 flex items-center gap-2 text-xs opacity-60 text-[#8E8E93] hidden xl:flex">
          <span className="text-red-400">○</span>
          <span>Ollama Offline</span>
        </div>

        {/* Demo Mode Toggle */}
        <button
          id="header-demo-toggle-btn"
          onClick={onToggleDemoMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono transition ${
            isDemoMode
              ? 'bg-blue-950/60 border-blue-500/60 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
              : 'bg-[#1A1A1E] border-[#1F1F23] text-[#8E8E93] hover:text-[#E0E0E6]'
          }`}
        >
          <Play className="w-3 h-3 text-blue-400" />
          <span className="hidden sm:inline">{isDemoMode ? 'Demo Active' : 'Run Demo'}</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {isDemoMode && (
          <button
            id="header-demo-reset-btn"
            onClick={onResetDemo}
            className="p-1.5 sm:px-2 sm:py-1 rounded bg-[#1A1A1E] border border-[#1F1F23] text-[#8E8E93] hover:text-[#E0E0E6] text-xs transition"
            title="Reset UserService scenario to initial failing state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Predict Intent Button */}
        <button
          id="header-run-predict-btn"
          onClick={onTriggerPrediction}
          disabled={isPredicting}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-1.5 rounded-md font-semibold text-xs transition-all shadow-lg flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          title="Trigger Intent Classification on current developer signals"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPredicting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isPredicting ? 'Predicting...' : 'Predict Intent'}</span>
          <span className="sm:hidden">Predict</span>
        </button>
      </div>
    </header>
  );
};

