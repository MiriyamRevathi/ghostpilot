import React from 'react';
import {
  GitBranch,
  RefreshCw,
  Sparkles,
  Bell,
  Check,
  Code2,
} from 'lucide-react';

interface Props {
  hasDiagnostic: boolean;
  isFixApplied: boolean;
  onOpenGhostPilot: () => void;
}

export const StatusBar: React.FC<Props> = ({
  hasDiagnostic,
  isFixApplied,
  onOpenGhostPilot,
}) => {
  return (
    <div
      id="vscode-statusbar"
      className="h-6 bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] select-none shrink-0 font-sans tracking-tight"
    >
      {/* Left side items */}
      <div className="flex items-center h-full">
        {/* Remote WSL / Container Button */}
        <div
          className="h-full px-2 bg-[#005999] hover:bg-[#004d80] flex items-center gap-1 cursor-pointer font-bold mr-2 text-[12px]"
          title="Open a Remote Window"
        >
          <span>&gt;&lt;</span>
        </div>

        {/* Git Branch */}
        <div
          className="h-full px-1.5 flex items-center gap-1 hover:bg-[#005999] cursor-pointer"
          title="git repository: ghostpilot-workspace (main)"
        >
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </div>

        {/* Sync status */}
        <div
          className="h-full px-1.5 flex items-center gap-1 hover:bg-[#005999] cursor-pointer"
          title="Synchronize Changes"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          <span>0</span>
        </div>

        {/* Error / Warning count */}
        <div
          className="h-full px-2 flex items-center gap-1.5 hover:bg-[#005999] cursor-pointer ml-1"
          title="Problems"
        >
          <span className="flex items-center gap-1">
            <span className="font-bold text-[11px]">ⓧ</span>
            <span>{hasDiagnostic && !isFixApplied ? 1 : 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-[11px]">⚠</span>
            <span>0</span>
          </span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center h-full gap-0.5">
        {/* GhostPilot Status Pill */}
        <button
          onClick={onOpenGhostPilot}
          className={`h-full px-2.5 flex items-center gap-1.5 cursor-pointer transition font-medium ${
            !isFixApplied
              ? 'bg-[#005999] hover:bg-[#004d80] text-[#e0f2fe]'
              : 'hover:bg-[#005999] text-white/90'
          }`}
          title="GhostPilot Speculative Intent Engine"
        >
          <Sparkles className="w-3 h-3 text-[#7dd3fc]" />
          <span>
            {!isFixApplied ? 'GhostPilot: Fix Ready (92%)' : 'GhostPilot: Active'}
          </span>
        </button>

        {/* Local ML Predictor Status */}
        <div
          className="h-full px-2 flex items-center gap-1.5 hover:bg-[#005999] cursor-pointer text-[#e0f2fe]"
          title="GhostPilot Local ML Predictor: Active (N-gram & AST Beam Search, no external API keys)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
          <span>ML Predictor: Local N-Gram</span>
        </div>

        {/* Cursor position */}
        <div
          className="h-full px-2 flex items-center hover:bg-[#005999] cursor-pointer font-mono text-[11px]"
          title="Go to Line/Column"
        >
          <span>Ln 16, Col 47</span>
        </div>

        {/* Indentation */}
        <div
          className="h-full px-2 flex items-center hover:bg-[#005999] cursor-pointer hidden sm:flex"
          title="Select Indentation"
        >
          <span>Spaces: 2</span>
        </div>

        {/* Encoding */}
        <div
          className="h-full px-2 flex items-center hover:bg-[#005999] cursor-pointer hidden md:flex"
          title="Select Encoding"
        >
          <span>UTF-8</span>
        </div>

        {/* EOL */}
        <div
          className="h-full px-1.5 flex items-center hover:bg-[#005999] cursor-pointer hidden md:flex"
          title="Select End of Line Sequence"
        >
          <span>LF</span>
        </div>

        {/* Language Mode */}
        <div
          className="h-full px-2 flex items-center gap-1 hover:bg-[#005999] cursor-pointer font-semibold"
          title="Select Language Mode"
        >
          <Code2 className="w-3 h-3" />
          <span>TypeScript</span>
        </div>

        {/* Notifications */}
        <div
          className="h-full px-2 flex items-center hover:bg-[#005999] cursor-pointer"
          title="No Notifications"
        >
          <Bell className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
