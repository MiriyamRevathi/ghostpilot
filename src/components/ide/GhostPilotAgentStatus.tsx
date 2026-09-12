import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  CheckCircle,
  Eye,
  Layers,
  ChevronUp,
  ChevronDown,
  Terminal,
  Cpu,
  Shield,
  Clock,
  Save,
  Check,
} from 'lucide-react';
import { GhostPilotAgentState } from '../../types/ide';

interface Props {
  agentState: GhostPilotAgentState;
  hasDiagnostic: boolean;
  isFixApplied: boolean;
  onResetError?: () => void;
  onFixError?: () => void;
  isModified?: boolean;
  onSave?: () => void;
}

export const GhostPilotAgentStatus: React.FC<Props> = ({
  agentState,
  hasDiagnostic,
  isFixApplied,
  onResetError,
  onFixError,
  isModified = false,
  onSave,
}) => {
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState(false);

  return (
    <div
      id="ghostpilot-agent-bottom-bar"
      className="bg-[#007acc] text-white select-none border-t border-[#0062a3] shrink-0 font-sans text-[11.5px] relative"
    >
      {/* Telemetry & Speculative Flow Drawer (Collapsible) */}
      {showTelemetryDrawer && (
        <div className="absolute bottom-full left-0 right-0 bg-[#181818] border-t border-[#333333] text-[#cccccc] p-4 shadow-2xl z-40 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2d2d2d] font-sans">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              <span>GhostPilot Speculative Intent Pipeline (Offline / Local Rule & AST Analysis)</span>
            </div>
            <button
              onClick={() => setShowTelemetryDrawer(false)}
              className="text-[#858585] hover:text-white text-xs cursor-pointer"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <div className="text-[#858585] uppercase text-[10px] font-bold mb-1">1. Signal Collection</div>
              <div className="text-white">Dwell Time: {agentState.dwellTimeSeconds}s</div>
              <div className="text-[#858585]">Cursor: Ln {agentState.cursorLine}, Col {agentState.cursorCol}</div>
              <div className="text-[#858585]">Typing pauses: Observed</div>
            </div>

            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <div className="text-[#858585] uppercase text-[10px] font-bold mb-1">2. Feature Extraction</div>
              <div className="text-white">Active AST: MemberExpression</div>
              <div className="text-[#858585]">Diagnostics: ts(2532) Object is possibly 'undefined'</div>
              <div className="text-[#858585]">Null Dereference: High Risk</div>
            </div>

            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <div className="text-[#858585] uppercase text-[10px] font-bold mb-1">3. Intent Prediction</div>
              <div className="text-emerald-400 font-bold">DEBUG_ERROR ({agentState.confidence}%)</div>
              <div className="text-[#858585]">Mode: Speculative Pre-computation</div>
              <div className="text-[#858585]">API Requirement: 0 (Offline)</div>
            </div>

            <div className="p-2.5 rounded bg-[#252526] border border-[#333333]">
              <div className="text-[#858585] uppercase text-[10px] font-bold mb-1">4. Prepared Patch</div>
              <div className="text-white font-mono">return user?.name;</div>
              <div className="text-[#38bdf8]">Ready in Right Fixing Panel</div>
              <div className="text-[#858585]">Awaiting Dev Approval</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Single-Line Status Bar (Compact, authentic IDE style) */}
      <div className="h-7 px-3 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        {/* Left Elements matching user exact requirement */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className="flex items-center gap-1.5 font-bold cursor-pointer hover:bg-[#0062a3] px-1.5 py-0.5 rounded transition"
            title="Click to view speculative signals and telemetry"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GhostPilot Agent</span>
            {showTelemetryDrawer ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3 text-white/70" />
            )}
          </div>

          <span className="text-white/40 select-none">|</span>

          {/* Status: Monitoring coding context */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Status:</span>
            <span className="font-semibold text-white/95">{agentState.status}</span>
          </div>

          <span className="text-white/40 select-none">|</span>

          {/* Intent: DEBUG_ERROR */}
          <div className="flex items-center gap-1.5">
            <span>Intent:</span>
            <span className="bg-[#005999] px-1.5 py-0.2 rounded font-mono text-[11px] font-bold tracking-wide text-white border border-white/20">
              {agentState.intent}
            </span>
          </div>

          <span className="text-white/40 select-none">|</span>

          {/* Confidence: 92% */}
          <div className="flex items-center gap-1.5">
            <span>Confidence:</span>
            <span className="font-mono font-bold">{agentState.confidence}%</span>
          </div>

          <span className="text-white/40 select-none">|</span>

          {/* Speculative Analysis: READY */}
          <div className="flex items-center gap-1.5">
            <span>Speculative Analysis:</span>
            <span
              className={`font-mono font-bold px-1 rounded text-[11px] ${
                agentState.speculativeAnalysis === 'VALIDATED'
                  ? 'bg-emerald-600 text-white'
                  : agentState.speculativeAnalysis === 'READY'
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/20 text-white'
              }`}
            >
              {agentState.speculativeAnalysis}
            </span>
          </div>
        </div>

        {/* Right Info: IDE Telemetry Indicators */}
        <div className="flex items-center gap-3 shrink-0 text-white/90 font-mono text-[11px]">
          <div className="hidden md:flex items-center gap-1 text-white/80" title="Cursor position in active document">
            <span>Ln {agentState.cursorLine}, Col {agentState.cursorCol}</span>
          </div>

          <span className="text-white/40 select-none hidden md:inline">|</span>

          <div className="hidden lg:flex items-center gap-1 text-white/80" title="Time spent focused on current line">
            <Clock className="w-3 h-3 text-white/70" />
            <span>Dwell: {agentState.dwellTimeSeconds}s</span>
          </div>

          <span className="text-white/40 select-none hidden lg:inline">|</span>

          <div className="flex items-center gap-1" title="Language Server Diagnostics">
            <span
              className={`w-2 h-2 rounded-full ${
                hasDiagnostic && !isFixApplied ? 'bg-red-300' : 'bg-emerald-300'
              }`}
            />
            <span>{hasDiagnostic && !isFixApplied ? '1 Error (ts2532)' : '0 Errors'}</span>
          </div>

          {hasDiagnostic && !isFixApplied && onFixError && (
            <button
              id="status-bar-fix-btn"
              onClick={onFixError}
              className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10.5px] font-sans font-medium cursor-pointer transition flex items-center gap-1 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-sky-200" />
              <span>Fix Error</span>
            </button>
          )}

          {isFixApplied && onResetError && (
            <button
              id="status-bar-retest-btn"
              onClick={onResetError}
              className="bg-white/10 hover:bg-white/20 text-white/90 px-2 py-0.5 rounded text-[10px] font-sans cursor-pointer transition"
              title="Reset code back to test error again"
            >
              <span>Re-trigger Error to Test</span>
            </button>
          )}

          <span className="text-white/40 select-none">|</span>

          {/* File Save Status */}
          {onSave && (
            <button
              id="status-bar-save-btn"
              onClick={onSave}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-sans cursor-pointer transition ${
                isModified
                  ? 'bg-amber-400 text-black font-semibold hover:bg-amber-300'
                  : 'hover:bg-[#0062a3] text-white/90'
              }`}
              title="Save current file (Ctrl+S)"
            >
              {isModified ? (
                <>
                  <Save className="w-3 h-3 text-black" />
                  <span>Unsaved (Ctrl+S)</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-emerald-300" />
                  <span>Saved</span>
                </>
              )}
            </button>
          )}

          <span className="text-white/40 select-none">|</span>

          <div
            onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
            className="hover:bg-[#0062a3] px-1 py-0.5 rounded cursor-pointer transition text-[10.5px]"
            title="Inspect Agent Pipeline"
          >
            Telemetry &gt;
          </div>
        </div>
      </div>
    </div>
  );
};
