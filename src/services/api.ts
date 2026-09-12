import {
  DeveloperContext,
  DeveloperSignals,
  DiagnosticItem,
  PredictionResult,
  ASTAnalysisResult,
  SuggestionItem,
  LatencyBreakdown,
  SystemSettings,
  GazeContextData
} from '../types';

export const api = {
  async getContext(): Promise<{
    context: DeveloperContext;
    signals: DeveloperSignals;
    diagnostics: DiagnosticItem[];
  }> {
    const res = await fetch('/api/context');
    if (!res.ok) throw new Error('Failed to fetch context');
    return res.json();
  },

  async updateContext(payload: {
    context?: Partial<DeveloperContext>;
    signals?: Partial<DeveloperSignals>;
    diagnostics?: DiagnosticItem[];
  }): Promise<{ status: string }> {
    const res = await fetch('/api/context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update context');
    return res.json();
  },

  async predictIntent(): Promise<PredictionResult & { active_suggestion?: SuggestionItem }> {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to predict intent');
    return res.json();
  },

  async analyzeCode(code?: string, language?: string): Promise<ASTAnalysisResult> {
    const res = await fetch('/api/analyze-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });
    if (!res.ok) throw new Error('Failed to analyze code AST');
    return res.json();
  },

  async getDiagnostics(): Promise<DiagnosticItem[]> {
    const res = await fetch('/api/diagnostics');
    if (!res.ok) throw new Error('Failed to fetch diagnostics');
    return res.json();
  },

  async addDiagnostic(diag: Partial<DiagnosticItem>): Promise<{ status: string; diagnostic: DiagnosticItem }> {
    const res = await fetch('/api/diagnostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diag)
    });
    if (!res.ok) throw new Error('Failed to add diagnostic');
    return res.json();
  },

  async deleteDiagnostic(id: string): Promise<{ status: string }> {
    const res = await fetch(`/api/diagnostics/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete diagnostic');
    return res.json();
  },

  async getLatestSuggestion(): Promise<SuggestionItem | null> {
    const res = await fetch('/api/suggestions/latest');
    if (!res.ok) throw new Error('Failed to fetch suggestion');
    return res.json();
  },

  async applySuggestion(payload: { suggestedFix: string; originalCode?: string; targetFile?: string }): Promise<{
    status: string;
    sourceCode: string;
    message: string;
  }> {
    const res = await fetch('/api/suggestions/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to apply suggestion');
    return res.json();
  },

  async dismissSuggestion(): Promise<{ status: string }> {
    const res = await fetch('/api/suggestions/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to dismiss suggestion');
    return res.json();
  },

  async getCache(): Promise<{
    entries: SuggestionItem[];
    stats: { hits: number; misses: number; evictions: number; entryCount: number; ttlSeconds: number };
  }> {
    const res = await fetch('/api/cache');
    if (!res.ok) throw new Error('Failed to fetch cache');
    return res.json();
  },

  async clearCache(): Promise<{ status: string; clearedCount: number }> {
    const res = await fetch('/api/cache', {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear cache');
    return res.json();
  },

  async getLatency(): Promise<LatencyBreakdown> {
    const res = await fetch('/api/latency');
    if (!res.ok) throw new Error('Failed to fetch latency metrics');
    return res.json();
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async getGaze(): Promise<GazeContextData> {
    const res = await fetch('/api/gaze');
    if (!res.ok) throw new Error('Failed to fetch gaze data');
    return res.json();
  },

  async updateGaze(data: Partial<GazeContextData>): Promise<GazeContextData> {
    const res = await fetch('/api/gaze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update gaze data');
    return res.json();
  },

  async getVSCodeStatus(): Promise<{
    connected: boolean;
    extension: string;
    version: string;
    activeWorkspace: string;
    activeFile: string;
  }> {
    const res = await fetch('/api/vscode/status');
    if (!res.ok) throw new Error('Failed to fetch VS Code status');
    return res.json();
  },

  async getInferenceStatus(): Promise<{
    available: boolean;
    endpoint: string;
    model: string;
    fallbackMode: string;
    status: string;
  }> {
    const res = await fetch('/api/inference/status');
    if (!res.ok) throw new Error('Failed to fetch inference status');
    return res.json();
  },

  async resetDemo(): Promise<{ status: string }> {
    const res = await fetch('/api/demo/reset', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo');
    return res.json();
  }
};
