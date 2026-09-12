import React, { useState } from 'react';
import { DeveloperContext, DeveloperSignals, DiagnosticItem } from '../types';
import { Code2, AlertCircle, Play, Check } from 'lucide-react';

interface Props {
  context: DeveloperContext;
  signals: DeveloperSignals;
  diagnostics: DiagnosticItem[];
  onUpdateContext: (ctx: Partial<DeveloperContext>) => void;
  onRunAnalysis: () => void;
}

export const LiveContextPage: React.FC<Props> = ({
  context,
  diagnostics,
  onUpdateContext,
  onRunAnalysis,
}) => {
  const [editingCode, setEditingCode] = useState(context.sourceCode);
  const [saved, setSaved] = useState(false);

  const handleSaveCode = () => {
    onUpdateContext({ sourceCode: editingCode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRunAnalysis();
  };

  const lines = (editingCode || context.sourceCode).split('\n');

  return (
    <div id="live-context-page" className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">Developer Context</h1>
        <p className="text-xs text-[#8E8E93] font-mono">
          Live environment metadata, active editor position, and source inspection.
        </p>
      </div>

      {/* Metadata KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Project
          </div>
          <div className="text-sm font-bold text-[#E0E0E6] truncate">{context.projectName}</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md sm:col-span-2">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Active File
          </div>
          <div className="text-sm font-bold text-blue-400 truncate" title={context.activeFile}>
            {context.activeFile}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Language
          </div>
          <div className="text-sm font-bold text-blue-300">{context.language}</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Cursor Position
          </div>
          <div className="text-sm font-bold text-[#E0E0E6]">
            L{context.cursorLine} : C{context.cursorColumn}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Complexity
          </div>
          <div className="text-sm font-bold text-orange-400">{context.codeComplexity} (Low)</div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-1">
            Diagnostics
          </div>
          <div
            className={`text-sm font-bold ${
              diagnostics.length > 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {diagnostics.length} Active
          </div>
        </div>
      </div>

      {/* Editor & Diagnostic Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Source Code Viewer / Editor */}
        <div className="lg:col-span-2 bg-[#16161A] border border-[#1F1F23] rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1F1F23] border-b border-[#1F1F23]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E0E0E6]">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>{context.activeFile}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="context-save-code-btn"
                onClick={handleSaveCode}
                className="flex items-center gap-1.5 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition shadow-md"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{saved ? 'Updated' : 'Sync & Parse'}</span>
              </button>
            </div>
          </div>

          {/* Line by line editor view */}
          <div className="p-4 font-mono text-xs overflow-x-auto bg-[#0A0A0C]">
            <div className="space-y-1">
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isCursorLine = lineNum === context.cursorLine;
                const hasDiag = diagnostics.some(d => d.line === lineNum);

                return (
                  <div
                    key={idx}
                    onClick={() => onUpdateContext({ cursorLine: lineNum })}
                    className={`flex items-start gap-4 px-2.5 py-1 rounded cursor-pointer transition ${
                      isCursorLine
                        ? 'bg-blue-950/40 border-l-2 border-blue-500'
                        : hasDiag
                        ? 'bg-red-950/30 border-l-2 border-red-500'
                        : 'hover:bg-[#16161A]'
                    }`}
                  >
                    <span className="text-[#66666E] select-none w-6 text-right font-mono">
                      {lineNum}
                    </span>
                    <span className="whitespace-pre text-[#A9A9B3] flex-1 font-mono">
                      {line || ' '}
                    </span>
                    {isCursorLine && (
                      <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/30 shrink-0">
                        CURSOR
                      </span>
                    )}
                    {hasDiag && (
                      <span className="text-[10px] text-red-400 font-mono bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/30 shrink-0">
                        LSP ERROR
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-2 bg-[#0D0D10] border-t border-[#1F1F23] text-[11px] font-mono text-[#66666E] flex justify-between">
            <span>Click any line above to shift cursor focus and test signal sensitivity</span>
            <span>UTF-8 • TypeScript • 2 Spaces</span>
          </div>
        </div>

        {/* Right Col: Active Diagnostic Card & Workspace Context */}
        <div className="space-y-4">
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1F1F23]">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <h3 className="font-mono text-xs font-bold text-[#E0E0E6]">
                Active Diagnostic Trigger
              </h3>
            </div>

            {diagnostics.length === 0 ? (
              <p className="text-xs font-mono text-green-400 py-3">
                No active diagnostics in this file. Workspace is clean.
              </p>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {diagnostics.map(d => (
                  <div
                    key={d.id}
                    className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-red-400 font-bold">
                      <span>{d.type}</span>
                      <span className="text-[10px] text-[#8E8E93]">
                        Line {d.line}:{d.column}
                      </span>
                    </div>
                    <p className="text-red-200/90 text-xs leading-relaxed">{d.message}</p>
                    {d.relatedCodeSnippet && (
                      <div className="p-2 bg-[#0A0A0C] border border-[#1F1F23] rounded text-red-300/80 text-[11px] font-mono">
                        {d.relatedCodeSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 font-mono text-xs space-y-3 shadow-2xl">
            <h3 className="font-bold text-[#E0E0E6] pb-2 border-b border-[#1F1F23]">
              Workspace Environment
            </h3>
            <div className="space-y-2 text-[#8E8E93] text-[11px]">
              <div className="flex justify-between">
                <span>IDE Integration:</span>
                <span className="text-blue-400 font-semibold">VS Code Extension API</span>
              </div>
              <div className="flex justify-between">
                <span>IPC Channel:</span>
                <span className="text-[#E0E0E6]">Localhost HTTP (3000)</span>
              </div>
              <div className="flex justify-between">
                <span>Telemetry Mode:</span>
                <span className="text-green-400">Strict Local Only</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-[#E0E0E6]">None (In-Memory)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
