import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle, Sparkles, Layers } from 'lucide-react';

interface Props {
  onStepChange: (stepIndex: number) => void;
  onReset: () => void;
  onApplyFix: () => void;
  isApplied: boolean;
}

export const DEMO_STEPS = [
  {
    title: '1. Developer Writes Code',
    desc: 'Developer implements UserService.getUserDisplayName with direct .name dereference.',
    intent: 'FLOW_STATE',
    friction: 'LOW',
    signals: { typing_speed: 72, pause_duration: 0.5, backspace_count: 0, error_count: 0, diagnostic_count: 0, terminal_activity: 0 },
  },
  {
    title: '2. Test Suite Fails',
    desc: 'Terminal reports: TypeError: Cannot read properties of undefined (reading "name") in UserService.ts:16.',
    intent: 'RUN_TEST',
    friction: 'MEDIUM',
    signals: { typing_speed: 25, pause_duration: 1.8, backspace_count: 1, error_count: 1, diagnostic_count: 1, terminal_activity: 1 },
  },
  {
    title: '3. Developer Inspects Error',
    desc: 'Cursor moves to UserService.ts line 16. Gaze focuses on diagnostic overlay.',
    intent: 'EXPLAIN_ERROR',
    friction: 'MEDIUM',
    signals: { typing_speed: 10, pause_duration: 3.4, backspace_count: 2, error_count: 1, diagnostic_count: 1, terminal_activity: 1 },
  },
  {
    title: '4. Cognitive Pause Detected',
    desc: 'Typing stops completely for 4.2s. Backspaces increment. High hesitation pattern.',
    intent: 'DEBUG_ERROR',
    friction: 'HIGH',
    signals: { typing_speed: 4, pause_duration: 4.8, backspace_count: 4, error_count: 1, diagnostic_count: 1, terminal_activity: 1 },
  },
  {
    title: '5. Intent Prediction (92%)',
    desc: 'Local ML model evaluates feature vector: DEBUG_ERROR confidence hits 92% (> 80% threshold).',
    intent: 'DEBUG_ERROR',
    friction: 'HIGH',
    signals: { typing_speed: 2, pause_duration: 5.2, backspace_count: 4, error_count: 1, diagnostic_count: 1, terminal_activity: 1 },
  },
  {
    title: '6. Speculative Pre-Computation',
    desc: 'Zero-touch engine prepares null-safe optional chaining fix, root cause, and unit test in-memory (245ms).',
    intent: 'DEBUG_ERROR',
    friction: 'HIGH',
    signals: { typing_speed: 0, pause_duration: 5.5, backspace_count: 4, error_count: 1, diagnostic_count: 1, terminal_activity: 1 },
  },
  {
    title: '7. Review & Apply Fix',
    desc: 'Developer reviews side-by-side diff. Clicks "Apply Fix" or presses hotkey to resolve diagnostic.',
    intent: 'DEBUG_ERROR',
    friction: 'LOW',
    signals: { typing_speed: 18, pause_duration: 1.2, backspace_count: 0, error_count: 0, diagnostic_count: 0, terminal_activity: 0 },
  },
];

export const DemoBanner: React.FC<Props> = ({ onStepChange, onReset, onApplyFix, isApplied }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= DEMO_STEPS.length - 1) {
          setAutoPlay(false);
          return prev;
        }
        const next = prev + 1;
        onStepChange(next);
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [autoPlay, onStepChange]);

  const goToStep = (idx: number) => {
    setCurrentStep(idx);
    onStepChange(idx);
  };

  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const active = DEMO_STEPS[currentStep];

  return (
    <div
      id="demo-mode-stepper"
      className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-4 sm:p-5 shadow-2xl font-mono text-xs space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1F1F23] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-ping"></div>
          <span className="font-bold text-blue-400 text-sm">Interactive Demo Scenario:</span>
          <span className="text-[#E0E0E6] font-semibold">UserService Failing Test Walkthrough</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="demo-autoplay-btn"
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border transition ${
              autoPlay
                ? 'bg-blue-950/70 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                : 'bg-[#1A1A1E] border-[#1F1F23] text-[#8E8E93] hover:text-[#E0E0E6]'
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'Pause Walkthrough' : 'Auto-Play Walkthrough'}</span>
          </button>

          <button
            id="demo-reset-btn"
            onClick={() => {
              setAutoPlay(false);
              setCurrentStep(0);
              onReset();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] border border-[#1F1F23] rounded-md text-[#8E8E93] hover:text-[#E0E0E6] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {DEMO_STEPS.map((step, idx) => {
          const isCurrent = idx === currentStep;
          const isPassed = idx < currentStep;

          return (
            <button
              key={idx}
              onClick={() => goToStep(idx)}
              className={`p-2 rounded-md text-left transition border ${
                isCurrent
                  ? 'bg-[#1F1F23] border-blue-500/60 text-blue-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : isPassed
                  ? 'bg-[#111114] border-[#1F1F23] text-[#8E8E93] hover:text-[#E0E0E6]'
                  : 'bg-[#0A0A0C] border-[#1F1F23]/60 text-[#66666E] hover:text-[#8E8E93]'
              }`}
            >
              <div className="text-[10px] text-[#66666E]">Step {idx + 1}</div>
              <div className="text-[11px] truncate">{step.title.split('. ')[1]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Step Details */}
      <div className="p-3.5 bg-[#0D0D10] rounded-lg border border-[#1F1F23] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="text-[#E0E0E6] font-bold text-sm flex items-center gap-2">
            <span className="text-blue-400">{active.title}</span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A1A1E] text-[#8E8E93] border border-[#1F1F23]">
              State: {active.intent}
            </span>
          </div>
          <p className="text-[#A9A9B3] text-xs">{active.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-md bg-[#1A1A1E] hover:bg-[#25252B] border border-[#1F1F23] text-[#8E8E93] hover:text-[#E0E0E6] transition"
            >
              Previous
            </button>
          )}

          {currentStep < DEMO_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg active:scale-95"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onApplyFix}
              disabled={isApplied}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-semibold transition shadow-lg ${
                isApplied
                  ? 'bg-[#1F1F23] text-[#66666E] cursor-not-allowed border border-[#1F1F23]'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isApplied ? 'Fix Applied' : 'Apply Speculative Fix'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
