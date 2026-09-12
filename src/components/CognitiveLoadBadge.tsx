import React from 'react';
import { CognitiveLoadLevel } from '../types';
import { Activity } from 'lucide-react';

interface Props {
  level: CognitiveLoadLevel;
  compact?: boolean;
}

export const CognitiveLoadBadge: React.FC<Props> = ({ level, compact = false }) => {
  const styles = {
    LOW: 'bg-green-950/30 text-green-400 border-green-800/40',
    MEDIUM: 'bg-orange-950/30 text-orange-400 border-orange-800/40',
    HIGH: 'bg-red-950/30 text-red-400 border-red-800/40',
  };

  const descriptions = {
    LOW: 'Minimal friction • Fluid typing cadence',
    MEDIUM: 'Moderate friction • Hesitation / edits detected',
    HIGH: 'High friction • Multiple diagnostics / prolonged pause',
  };

  return (
    <div
      id={`cognitive-load-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${styles[level]}`}
      title={descriptions[level]}
    >
      <Activity className="w-3.5 h-3.5 animate-pulse" />
      <span className="font-semibold">{level}</span>
      {!compact && (
        <span className="text-[11px] text-[#8E8E93] opacity-90 hidden sm:inline">
          (Friction)
        </span>
      )}
    </div>
  );
};

