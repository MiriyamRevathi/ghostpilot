export interface ProjectFile {
  path: string;
  name: string;
  extension: string;
  content: string;
  initialContent: string;
  isModified: boolean;
  language: 'typescript' | 'tsx' | 'json' | 'markdown';
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  isExpanded?: boolean;
}

export interface FixingErrorState {
  errorType: string;
  errorMessage: string;
  rootCause: string;
  targetFile: string;
  targetLine: number;
  oldCodeSnippet: string;
  newCodeSnippet: string;
  status: 'prepared' | 'applied' | 'validating' | 'validated' | 'dismissed';
  confidence: number;
  predictedIntent: string;
}

export interface GhostPilotAgentState {
  status: string;
  intent: string;
  confidence: number;
  speculativeAnalysis: 'READY' | 'ANALYZING' | 'VALIDATED' | 'STANDBY';
  activeFile: string;
  cursorLine: number;
  cursorCol: number;
  dwellTimeSeconds: number;
  backspaceCount: number;
  recentSignals: string[];
}
