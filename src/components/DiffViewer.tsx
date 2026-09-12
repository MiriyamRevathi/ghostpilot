import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface Props {
  originalCode: string;
  suggestedFix: string;
  targetFile?: string;
  targetLine?: number;
  onApply?: () => void;
  onDismiss?: () => void;
  isApplied?: boolean;
}

export const DiffViewer: React.FC<Props> = ({
  originalCode,
  suggestedFix,
  targetFile = 'src/services/UserService.ts',
  targetLine = 16,
  onApply,
  onDismiss,
  isApplied = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'split' | 'unified'>('split');

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedFix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const origLines = originalCode.trim().split('\n');
  const fixLines = suggestedFix.trim().split('\n');

  return (
    <div id="diff-viewer-card" className="bg-[#16161A] border border-[#1F1F23] rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#1F1F23] border-b border-[#1F1F23] gap-2">
        <div className="flex items-center gap-2 font-mono text-xs text-[#E0E0E6]">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">{targetFile}</span>
          <span className="text-[#8E8E93]">: line {targetLine}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0D0D10] border border-[#1F1F23] rounded-md p-0.5 text-xs font-mono">
            <button
              id="diff-mode-split"
              onClick={() => setMode('split')}
              className={`px-2.5 py-0.5 rounded transition ${
                mode === 'split'
                  ? 'bg-[#1F1F23] text-white font-medium'
                  : 'text-[#8E8E93] hover:text-[#E0E0E6]'
              }`}
            >
              Side-by-side
            </button>
            <button
              id="diff-mode-unified"
              onClick={() => setMode('unified')}
              className={`px-2.5 py-0.5 rounded transition ${
                mode === 'unified'
                  ? 'bg-[#1F1F23] text-white font-medium'
                  : 'text-[#8E8E93] hover:text-[#E0E0E6]'
              }`}
            >
              Unified
            </button>
          </div>

          <button
            id="diff-copy-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-[#E0E0E6] rounded-md border border-[#1F1F23] transition font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Diff Content */}
      {mode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1F1F23] font-mono text-xs">
          {/* Left: Original Code */}
          <div className="p-4 bg-red-950/15">
            <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Original (Diagnostic Trigger)
            </div>
            <div className="space-y-1 overflow-x-auto text-red-200/90 py-1">
              {origLines.map((line, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-[#66666E] select-none w-6 text-right">{targetLine + idx}</span>
                  <span className="text-red-400 select-none">-</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Suggested Fix */}
          <div className="p-4 bg-green-950/15">
            <div className="text-[11px] font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Speculatively Prepared Fix
            </div>
            <div className="space-y-1 overflow-x-auto text-green-300 py-1">
              {fixLines.map((line, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-[#66666E] select-none w-6 text-right">{targetLine + idx}</span>
                  <span className="text-green-400 select-none">+</span>
                  <span className="whitespace-pre font-medium">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 font-mono text-xs space-y-1 overflow-x-auto bg-[#0A0A0C]">
          {origLines.map((line, idx) => (
            <div key={`orig-${idx}`} className="flex gap-3 bg-red-950/25 px-2 py-0.5 rounded text-red-300">
              <span className="text-[#66666E] select-none w-6 text-right">{targetLine + idx}</span>
              <span className="text-red-400 select-none">-</span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
          {fixLines.map((line, idx) => (
            <div key={`fix-${idx}`} className="flex gap-3 bg-green-950/30 px-2 py-0.5 rounded text-green-300">
              <span className="text-[#66666E] select-none w-6 text-right">{targetLine + idx}</span>
              <span className="text-green-400 select-none">+</span>
              <span className="whitespace-pre font-medium">{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Footer */}
      {(onApply || onDismiss) && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D0D10] border-t border-[#1F1F23]">
          <div className="text-xs text-[#8E8E93]">
            {isApplied ? (
              <span className="text-green-400 font-mono font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Fix applied to local workspace
              </span>
            ) : (
              <span>Explicit review required. GhostPilot never modifies code without confirmation.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onDismiss && (
              <button
                id="diff-dismiss-btn"
                onClick={onDismiss}
                className="px-3 py-1.5 text-xs font-mono text-[#8E8E93] hover:text-[#E0E0E6] transition"
              >
                Dismiss
              </button>
            )}
            {onApply && (
              <button
                id="diff-apply-btn"
                onClick={onApply}
                disabled={isApplied}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-semibold rounded-md shadow-lg transition ${
                  isApplied
                    ? 'bg-[#1F1F23] text-[#66666E] cursor-not-allowed border border-[#1F1F23]'
                    : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isApplied ? 'Applied' : 'Apply Fix'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
