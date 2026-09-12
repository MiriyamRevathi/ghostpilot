import React, { useState } from 'react';
import { Sparkles, X, Check, Eye, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  confidence?: number;
  onApplyFix: () => void;
  onDismiss: () => void;
  isApplied?: boolean;
}

export const GhostPilotSuggestion: React.FC<Props> = ({
  confidence = 92,
  onApplyFix,
  onDismiss,
  isApplied = false,
}) => {
  const [isViewingFix, setIsViewingFix] = useState(false);

  if (isApplied) {
    return (
      <div
        id="ghostpilot-applied-pill"
        className="fixed bottom-14 right-8 z-40 bg-[#1e1e1e] border border-[#27c93f]/40 shadow-2xl rounded-lg p-3 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="w-5 h-5 rounded-full bg-[#27c93f]/20 text-[#27c93f] flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="text-white font-medium">GhostPilot Fix Applied</span>
          <span className="text-[#858585] ml-1.5 text-[11px] font-mono">Null-safety guard active</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="ghostpilot-inline-suggestion"
      className="absolute bottom-5 right-6 z-30 max-w-sm w-88 bg-[#252526] border border-[#007acc]/40 rounded-lg shadow-2xl overflow-hidden font-sans select-none animate-in fade-in slide-in-from-bottom-3 duration-300"
      style={{
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 122, 204, 0.15)',
      }}
    >
      {/* Top Header Bar */}
      <div className="px-3.5 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-[#38bdf8] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GhostPilot Assistant</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#007acc]/20 text-[#38bdf8] font-mono font-normal">
            Local Intent AI
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#858585] hover:text-white p-0.5 rounded hover:bg-[#37373d] transition"
          title="Dismiss Suggestion"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-3.5 space-y-2.5 text-xs">
        <div>
          <div className="text-[#e0e0e6] font-medium leading-tight">
            GhostPilot detected a possible debugging intent.
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[11.5px] font-mono">
            <span className="text-[#38bdf8] font-bold">Confidence: {confidence}%</span>
            <span className="text-[#6e6e6e]">•</span>
            <span className="text-[#4ec9b0]">Suggested fix is ready</span>
          </div>
        </div>

        {/* Diff preview when user clicks "View Fix" */}
        {isViewingFix && (
          <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-2.5 font-mono text-[11px] space-y-2 animate-in fade-in duration-200">
            <div className="text-[10px] text-[#858585] flex items-center justify-between">
              <span>Proposed Modification (Line 16)</span>
              <span className="text-[#4ec9b0]">Safe Navigation</span>
            </div>

            <div className="space-y-1 overflow-x-auto text-[11px]">
              {/* Removed line */}
              <div className="flex items-center gap-1.5 text-[#f14c4c] bg-[#f14c4c]/10 px-2 py-0.5 rounded">
                <span className="select-none text-[#858585]">-</span>
                <span className="line-through">return this.users.find(u =&gt; u.id === id).name;</span>
              </div>
              {/* Added lines */}
              <div className="flex flex-col gap-0.5 text-[#4ec9b0] bg-[#4ec9b0]/10 px-2 py-1 rounded">
                <div className="flex items-center gap-1.5">
                  <span className="select-none text-[#858585]">+</span>
                  <span>const user = this.users.find(u =&gt; u.id === id);</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="select-none text-[#858585]">+</span>
                  <span>return user?.name;</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#858585] italic pt-0.5">
              Guards against undefined property access when user is not found.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          {!isViewingFix ? (
            <div className="flex items-center gap-2 w-full">
              <button
                id="ghostpilot-view-fix-btn"
                onClick={() => setIsViewingFix(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded font-medium text-xs transition active:scale-98 shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Fix</span>
              </button>
              <button
                id="ghostpilot-dismiss-btn"
                onClick={onDismiss}
                className="px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#37373d] rounded text-xs transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-2">
              <button
                id="ghostpilot-apply-fix-btn"
                onClick={() => {
                  onApplyFix();
                  setIsViewingFix(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded font-medium text-xs transition active:scale-98 shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Fix (Tab)</span>
              </button>
              <button
                onClick={() => setIsViewingFix(false)}
                className="px-3 py-1.5 text-[#cccccc] hover:text-white hover:bg-[#37373d] rounded text-xs transition cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
