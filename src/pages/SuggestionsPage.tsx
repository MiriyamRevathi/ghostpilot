import React, { useState } from 'react';
import { SuggestionItem, DeveloperContext } from '../types';
import { DiffViewer } from '../components/DiffViewer';
import {
  Lightbulb,
  CheckCircle2,
  FileCode,
  Sparkles,
  Info,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  suggestion: SuggestionItem | null;
  context: DeveloperContext;
  onApplyFix: () => void;
  onDismiss: () => void;
  isApplied: boolean;
}

export const SuggestionsPage: React.FC<Props> = ({
  suggestion,
  context,
  onApplyFix,
  onDismiss,
  isApplied,
}) => {
  const [activeTab, setActiveTab] = useState<'diff' | 'test' | 'explanation'>('diff');
  const [testCopied, setTestCopied] = useState(false);

  const fallbackSuggestion: SuggestionItem = {
    id: 'sug_default',
    predictionId: 'pred_001',
    intent: 'DEBUG_ERROR',
    confidence: 0.92,
    rootCause:
      'Collection search `this.users.find(...)` returns undefined when no matching element exists, causing an uncaught TypeError on property access `.name`.',
    suggestedFix:
      'const user = this.users.find(u => u.id === id);\nreturn user?.name;',
    originalCode: 'return this.users.find(u => u.id === id).name;',
    targetFile: context.activeFile,
    targetLine: context.cursorLine,
    generatedTest: `describe('UserService.getUserDisplayName', () => {
  it('should handle missing user correctly and return undefined without throwing TypeError', () => {
    const service = new UserService();
    const result = service.getUserDisplayName('unknown_id_999');
    expect(result).toBeUndefined();
  });
});`,
    explanation:
      'Refactored the direct chained property dereference into an intermediate variable assignment guarded with optional chaining `?.name`. This satisfies the strict null check and prevents runtime crashes without breaking callers.',
    timestamp: new Date().toISOString(),
    preparedAgoMs: 230,
    speculativelyPrepared: true,
    status: isApplied ? 'applied' : 'prepared',
  };

  const current = suggestion || fallbackSuggestion;

  const handleCopyTest = () => {
    navigator.clipboard.writeText(current.generatedTest);
    setTestCopied(true);
    setTimeout(() => setTestCopied(false), 2000);
  };

  return (
    <div id="suggestions-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Speculative Suggestion Panel
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Zero-touch candidate fix, root cause analysis, and generated unit test speculatively cached before requested.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#1A1A1E] border border-[#1F1F23] text-[#8E8E93]">
            {current.speculativelyPrepared ? 'Speculatively prepared' : 'Prepared on request'}
          </span>
        </div>
      </div>

      {/* Main Suggestion Banner */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1F23] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider">
                Predicted Intent
              </div>
              <div className="text-base font-mono font-bold text-[#E0E0E6] flex items-center gap-2">
                <span>{current.intent}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  {Math.round(current.confidence * 100)}% Confidence
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0D0D10] border border-[#1F1F23] p-1 rounded-md text-xs font-mono">
            <button
              id="sug-view-diff-tab"
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'diff'
                  ? 'bg-[#1F1F23] text-white font-semibold'
                  : 'text-[#8E8E93] hover:text-[#E0E0E6]'
              }`}
            >
              Diff View
            </button>
            <button
              id="sug-view-test-tab"
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'test'
                  ? 'bg-[#1F1F23] text-white font-semibold'
                  : 'text-[#8E8E93] hover:text-[#E0E0E6]'
              }`}
            >
              Generated Test
            </button>
            <button
              id="sug-view-explanation-tab"
              onClick={() => setActiveTab('explanation')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'explanation'
                  ? 'bg-[#1F1F23] text-white font-semibold'
                  : 'text-[#8E8E93] hover:text-[#E0E0E6]'
              }`}
            >
              Explanation
            </button>
          </div>
        </div>

        {/* Root Cause Callout */}
        <div className="p-4 bg-[#0D0D10] rounded-lg border border-[#1F1F23] font-mono text-xs space-y-1.5">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Root Cause Discovery
          </div>
          <p className="text-[#A9A9B3] leading-relaxed text-xs">{current.rootCause}</p>
        </div>

        {/* Tab Content */}
        {activeTab === 'diff' && (
          <div className="pt-2">
            <DiffViewer
              originalCode={current.originalCode}
              suggestedFix={current.suggestedFix}
              targetFile={current.targetFile}
              targetLine={current.targetLine}
              onApply={onApplyFix}
              onDismiss={onDismiss}
              isApplied={isApplied}
            />
          </div>
        )}

        {activeTab === 'test' && (
          <div className="p-5 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <FileCode className="w-4 h-4" />
                <span>Generated Regression Unit Test (Vitest / Jest)</span>
              </div>
              <button
                onClick={handleCopyTest}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-[#E0E0E6] rounded-md border border-[#1F1F23] transition text-xs"
              >
                {testCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />}
                <span>{testCopied ? 'Copied' : 'Copy Test'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#0A0A0C] rounded-lg border border-[#1F1F23] text-blue-200 overflow-x-auto text-xs leading-relaxed">
              {current.generatedTest}
            </pre>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="p-5 bg-[#0D0D10] rounded-xl border border-[#1F1F23] space-y-3 font-mono text-xs">
            <div className="text-blue-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Technical Synthesis & Refactoring Rationale</span>
            </div>
            <p className="text-[#A9A9B3] leading-relaxed text-xs">{current.explanation}</p>

            <div className="p-3 bg-[#16161A] rounded-lg border border-[#1F1F23] text-[11px] text-[#8E8E93] space-y-1">
              <div className="font-semibold text-[#E0E0E6]">Safety Verification:</div>
              <div>• Strict null check satisfied with standard TypeScript optional chaining.</div>
              <div>• Retains exact return type signature (`string | undefined`).</div>
              <div>• Zero impact on downstream callers expecting valid string or undefined.</div>
            </div>
          </div>
        )}
      </div>

      {/* Safety and non-destructive disclaimer */}
      <div className="p-4 bg-[#16161A] border border-[#1F1F23] rounded-xl text-xs font-mono text-[#8E8E93] flex items-start gap-3 shadow-md">
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#E0E0E6]">Zero-Touch Preparation, Explicit Application: </span>
          GhostPilot speculatively prepares candidate fixes in memory so results are instantaneous,
          but will never mutate, overwrite, or commit to any source file without your explicit manual review and confirmation.
        </div>
      </div>
    </div>
  );
};
