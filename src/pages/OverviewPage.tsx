import React from 'react';
import {
  PredictionResult,
  SuggestionItem,
  DeveloperContext,
  DeveloperSignals,
  LatencyBreakdown
} from '../types';
import { CognitiveLoadBadge } from '../components/CognitiveLoadBadge';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface Props {
  prediction: PredictionResult | null;
  suggestion: SuggestionItem | null;
  context: DeveloperContext;
  signals: DeveloperSignals;
  latency: LatencyBreakdown | null;
  recentPredictions: PredictionResult[];
  onNavigateTab: (tab: any) => void;
  onApplyFix: () => void;
  isApplied: boolean;
}

export const OverviewPage: React.FC<Props> = ({
  prediction,
  suggestion,
  context,
  signals,
  latency,
  recentPredictions,
  onNavigateTab,
  onApplyFix,
  isApplied,
}) => {
  const currentIntent = prediction?.intent || 'DEBUG_ERROR';
  const confidence = prediction ? Math.round(prediction.confidence * 100) : 92;
  const cognitiveLoad = prediction?.cognitive_load || 'HIGH';

  // Format code lines for preview
  const codeLines = [
    { num: 38, code: 'async findUser(id: string) {', isErr: false },
    { num: 39, code: '  const users = await this.db.getUsers();', isErr: false },
    { num: 40, code: '  ', isErr: false },
    {
      num: 41,
      code: isApplied
        ? '  const user = users.find(u => u.id === id);\n  return user?.name;'
        : '  return users.find(u => u.id === id).name;',
      isErr: !isApplied
    },
    { num: 42, code: '}', isErr: false },
  ];

  return (
    <div id="overview-page" className="space-y-6">
      {/* Primary 12-Column Immersive UI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Code Editor Window Card */}
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl flex flex-col min-h-[400px] shadow-2xl relative overflow-hidden">
            {/* Window title bar with colored dots */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1F1F23] border-b border-[#1F1F23]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <span className="text-[11px] text-[#8E8E93] ml-2 font-mono">UserService.ts</span>
              </div>
              <span className="text-[10px] font-mono text-[#66666E]">TypeScript • AST Inspected</span>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-5 font-mono text-xs leading-relaxed overflow-hidden text-[#A9A9B3] space-y-1">
              <div className="flex gap-4 opacity-40">
                <span className="w-5 text-[#66666E] select-none">38</span>
                <span>async findUser(id: string) &#123;</span>
              </div>
              <div className="flex gap-4 opacity-40">
                <span className="w-5 text-[#66666E] select-none">39</span>
                <span>&nbsp;&nbsp;const users = await this.db.getUsers();</span>
              </div>
              <div className="flex gap-4 opacity-40">
                <span className="w-5 text-[#66666E] select-none">40</span>
                <span>&nbsp;&nbsp;</span>
              </div>

              {/* Line 41: Diagnostic Highlight or Resolved */}
              {!isApplied ? (
                <div className="space-y-1">
                  <div className="flex gap-4 bg-red-900/20 border-l-2 border-red-500 py-1 -mx-5 px-5">
                    <span className="w-5 text-red-500 font-bold select-none">41</span>
                    <span className="text-red-200">
                      &nbsp;&nbsp;return users.find(u =&gt; u.id === id).name;
                    </span>
                  </div>
                  <div className="flex flex-col ml-8 py-2">
                    <div className="text-red-400 text-xs py-1.5 px-3 bg-red-400/10 border border-red-500/20 rounded flex items-center gap-2 w-fit">
                      <span className="text-red-500 font-bold">▲</span>
                      <span>TypeError: Cannot read properties of undefined (reading 'name')</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-4 bg-green-900/20 border-l-2 border-green-500 py-1 -mx-5 px-5">
                    <span className="w-5 text-green-400 font-bold select-none">41</span>
                    <span className="text-green-300">
                      &nbsp;&nbsp;const user = users.find(u =&gt; u.id === id);
                    </span>
                  </div>
                  <div className="flex gap-4 bg-green-900/20 border-l-2 border-green-500 py-0.5 -mx-5 px-5">
                    <span className="w-5 text-green-400 font-bold select-none">42</span>
                    <span className="text-green-300">&nbsp;&nbsp;return user?.name;</span>
                  </div>
                  <div className="flex flex-col ml-8 py-1.5">
                    <div className="text-green-400 text-xs py-1 px-2.5 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2 w-fit">
                      <span className="text-green-400">✓</span>
                      <span>Safe optional chaining applied • Zero errors</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 opacity-40">
                <span className="w-5 text-[#66666E] select-none">{isApplied ? 43 : 42}</span>
                <span>&#125;</span>
              </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#16161A] to-transparent pointer-events-none"></div>
          </div>

          {/* 3 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-4">
              <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-2">
                Typing Speed
              </div>
              <div className="text-2xl font-semibold text-[#E0E0E6] font-mono">
                {Math.round(signals.typing_speed)}{' '}
                <span className="text-xs text-[#66666E] font-sans">wpm</span>
              </div>
              <div className="mt-2 h-1 bg-[#1F1F23] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, signals.typing_speed))}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-4">
              <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-2">
                Pause Duration
              </div>
              <div className="text-2xl font-semibold text-[#E0E0E6] font-mono">
                {signals.pause_duration.toFixed(1)}{' '}
                <span className="text-xs text-[#66666E] font-sans">sec</span>
              </div>
              <div className="mt-2 h-1 bg-[#1F1F23] rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(10, (signals.pause_duration / 6) * 100))}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-4">
              <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-2">
                Friction Score
              </div>
              <div
                className={`text-2xl font-semibold font-mono ${
                  cognitiveLoad === 'HIGH'
                    ? 'text-orange-400'
                    : cognitiveLoad === 'MEDIUM'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}
              >
                {cognitiveLoad}
              </div>
              <div className="mt-2 text-[11px] text-[#66666E] italic">
                {signals.backspace_count > 2
                  ? 'Repeating backspaces...'
                  : 'Stable cadence observed'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Speculative GhostPilot Intent Prediction Card */}
          <div className="bg-[#1C1C21] border border-blue-500/30 rounded-xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden">
            {/* Top-Right Glowing Ambient Blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative">
              <div className="flex flex-col">
                <span className="text-blue-400 text-[10px] uppercase tracking-widest font-bold">
                  GhostPilot Intent Prediction
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 uppercase tracking-tight">
                  {currentIntent.replace('_', ' ')}
                </h3>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/50 px-3 py-1 rounded text-blue-400 font-mono text-xl font-bold">
                {confidence}%
              </div>
            </div>

            <div className="space-y-4 relative">
              {/* Preparation Status */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
                <span className="text-[#8E8E93] text-xs">Speculative Analysis Prepared</span>
                <span className="ml-auto text-xs text-[#66666E] font-mono">
                  {suggestion?.preparedAgoMs ? `${suggestion.preparedAgoMs}ms ago` : '245ms ago'}
                </span>
              </div>

              {/* Root Cause Discovery Box */}
              <div className="bg-[#16161A] rounded-lg p-4 border border-[#1F1F23]">
                <div className="text-[10px] text-[#66666E] mb-2 uppercase font-bold tracking-wider">
                  Root Cause Discovery
                </div>
                <p className="text-xs leading-relaxed text-[#A9A9B3]">
                  {suggestion?.rootCause ||
                    'users.find() may return undefined if no matching ID exists. Accessing .name property causes runtime crash.'}
                </p>
              </div>

              {/* Code Diff Preview Box */}
              <div className="bg-[#0A0A0C] rounded-lg p-3 border border-[#1F1F23] font-mono text-xs text-green-400 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-[#66666E] select-none">+</span>
                  <span>const user = users.find(u =&gt; u.id === id);</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#66666E] select-none">+</span>
                  <span>return user?.name;</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  id="overview-apply-fix-hero-btn"
                  onClick={onApplyFix}
                  disabled={isApplied}
                  className={`flex-1 py-2.5 rounded-md font-semibold text-xs transition-all shadow-lg active:scale-95 ${
                    isApplied
                      ? 'bg-[#1F1F23] text-[#66666E] cursor-not-allowed border border-[#1F1F23]'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isApplied ? 'Fix Applied' : 'Apply Suggested Fix'}
                </button>
                <button
                  id="overview-dismiss-btn"
                  onClick={() => onNavigateTab('suggestions')}
                  className="px-4 bg-[#1F1F23] hover:bg-[#2A2A2F] text-[#8E8E93] hover:text-[#E0E0E6] py-2.5 rounded-md border border-[#1F1F23] text-xs transition"
                >
                  Diff View
                </button>
              </div>
            </div>
          </div>

          {/* Latent Signals Engine Card */}
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl flex-1 flex flex-col p-5">
            <div className="text-[10px] text-[#66666E] uppercase font-bold tracking-wider mb-4 flex justify-between">
              <span>Latent Signals Engine</span>
              <span className="text-blue-400 lowercase italic">Processing local metrics</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E8E93]">Context Collection</span>
                <span className="text-xs font-mono text-[#E0E0E6]">
                  {latency?.contextCollectionMs?.toFixed(0) || 12}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E8E93]">Feature Extraction</span>
                <span className="text-xs font-mono text-[#E0E0E6]">
                  {latency?.featureExtractionMs?.toFixed(0) || 4}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E8E93]">ML Prediction (Local Model)</span>
                <span className="text-xs font-mono text-[#E0E0E6]">
                  {latency?.intentPredictionMs?.toFixed(0) || 8}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8E8E93]">Speculative Analysis</span>
                <span className="text-xs font-mono text-[#E0E0E6]">
                  {latency?.speculativeAnalysisMs?.toFixed(0) || 245}ms
                </span>
              </div>

              <div className="h-px bg-[#1F1F23] my-2"></div>

              <div className="flex items-center justify-between font-bold">
                <span className="text-xs text-white uppercase tracking-wider">
                  Prediction Ready
                </span>
                <span className="text-xs text-blue-400 font-mono">
                  {latency?.totalPreparationMs?.toFixed(0) || 269}ms Total
                </span>
              </div>
            </div>

            {/* Gaze Focus summary at bottom */}
            <div className="mt-auto pt-6 flex items-center justify-between bg-[#0D0D10]/50 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-[#1F1F23]">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#66666E] uppercase font-bold tracking-wider">
                  Gaze Focus
                </span>
                <span className="text-[11px] text-[#A9A9B3] font-mono">
                  Editor (72%) / Diagnostics (28%)
                </span>
              </div>
              <div className="w-9 h-9 rounded-full border border-blue-500/30 flex items-center justify-center p-1 overflow-hidden bg-blue-500/10">
                <div className="text-[10px] text-blue-400 font-bold font-mono">AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-Touch Pipeline & Architecture Spec */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F23]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-[#E0E0E6]">Zero-Touch Pipeline Execution</h2>
          </div>
          <span className="text-[10px] text-[#66666E] uppercase tracking-wider font-mono">
            Autonomous Speculative Loop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 bg-[#0D0D10] border border-[#1F1F23] rounded-lg space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="text-[10px] text-[#66666E]">Signal</span>
            </div>
            <div className="font-semibold text-[#E0E0E6]">Diagnostic Encountered</div>
            <div className="text-[11px] text-[#8E8E93]">
              TypeError at UserService.ts:16 captured from compiler
            </div>
          </div>

          <div className="p-3.5 bg-[#0D0D10] border border-[#1F1F23] rounded-lg space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span className="text-[10px] text-[#66666E]">Behavior</span>
            </div>
            <div className="font-semibold text-[#E0E0E6]">Cognitive Pause</div>
            <div className="text-[11px] text-[#8E8E93]">
              Pause: {signals.pause_duration}s • Backspaces: {signals.backspace_count} • Cadence dip
            </div>
          </div>

          <div className="p-3.5 bg-[#0D0D10] border border-[#1F1F23] rounded-lg space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span className="text-[10px] text-[#66666E]">Inference</span>
            </div>
            <div className="font-semibold text-[#E0E0E6]">Intent Classified</div>
            <div className="text-[11px] text-[#8E8E93]">
              {currentIntent} confidence {confidence}% (&gt;80% cutoff)
            </div>
          </div>

          <div className="p-3.5 bg-blue-950/20 border border-blue-500/30 rounded-lg space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                4
              </span>
              <span className="text-[10px] text-blue-400 font-bold">Speculative</span>
            </div>
            <div className="font-semibold text-blue-300">Fix Prepared In-Memory</div>
            <div className="text-[11px] text-[#8E8E93]">
              Solution cached in 245ms before keypress
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions Ledger */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F23] mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8E8E93]" />
            <h2 className="text-sm font-bold text-[#E0E0E6]">Recent Intent Predictions</h2>
          </div>
          <span className="text-xs font-mono text-[#66666E]">
            {recentPredictions.length} events logged
          </span>
        </div>

        {recentPredictions.length === 0 ? (
          <p className="text-xs font-mono text-[#66666E] py-4 text-center">
            No prediction events yet. Click "Predict Intent" or run Demo Mode.
          </p>
        ) : (
          <div className="divide-y divide-[#1F1F23] font-mono text-xs">
            {recentPredictions.slice(0, 5).map((item, idx) => (
              <div key={idx} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#E0E0E6]">{item.intent}</span>
                  <span className="px-2 py-0.5 rounded bg-[#1F1F23] text-blue-400 font-semibold text-[11px]">
                    {Math.round(item.confidence * 100)}%
                  </span>
                  <span className="text-[#66666E] text-[11px] hidden sm:inline">
                    {item.supporting_signals.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#8E8E93] text-[11px]">
                  <CognitiveLoadBadge level={item.cognitive_load} compact />
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
