export type IntentType =
  | 'DEBUG_ERROR'
  | 'WRITE_UNIT_TEST'
  | 'EXPLAIN_ERROR'
  | 'REFACTOR_CODE'
  | 'WRITE_DOCUMENTATION'
  | 'NAVIGATE_CODE'
  | 'SEARCH_CODEBASE'
  | 'RUN_TEST'
  | 'FIX_SYNTAX'
  | 'REVIEW_CODE';

export type CognitiveLoadLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DeveloperSignals {
  typing_speed: number; // characters per minute
  pause_duration: number; // seconds
  backspace_count: number; // count in recent window
  cursor_movement: number; // lines/sec or events
  mouse_activity: number; // events/sec
  error_count: number; // count of active errors
  terminal_activity: number; // 0 or 1 (or error exit code)
  diagnostic_count: number;
  code_complexity: number;
  time_on_problem: number; // seconds
}

export interface DeveloperContext {
  projectName: string;
  activeFile: string;
  language: string;
  cursorLine: number;
  cursorColumn: number;
  codeComplexity: number;
  diagnosticCount: number;
  sourceCode: string;
  selectedText?: string;
}

export interface PredictionResult {
  intent: IntentType;
  confidence: number;
  supporting_signals: string[];
  timestamp: string;
  features: DeveloperSignals;
  cognitive_load: CognitiveLoadLevel;
  speculative_status: 'IDLE' | 'PREPARING' | 'READY' | 'DISMISSED' | 'APPLIED';
}

export interface DiagnosticItem {
  id: string;
  type: 'TypeError' | 'ReferenceError' | 'SyntaxError' | 'TestFailure' | 'TypeScriptDiagnostic' | 'PythonException';
  message: string;
  file: string;
  line: number;
  column: number;
  stackTrace?: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: string;
  relatedCodeSnippet?: string;
}

export interface ASTNode {
  type: string;
  name: string;
  startLine: number;
  endLine: number;
  complexity?: number;
  parameters?: string[];
  returnType?: string;
  children?: ASTNode[];
}

export interface ASTAnalysisResult {
  language: string;
  file: string;
  functions: { name: string; line: number; params: string[]; complexity: number }[];
  classes: { name: string; line: number; methodsCount: number }[];
  variables: { name: string; line: number; kind: string }[];
  imports: { source: string; specifiers: string[]; line: number }[];
  calls: { callee: string; line: number }[];
  conditionsCount: number;
  returnStatementsCount: number;
  estimatedComplexity: number;
  syntaxErrors: string[];
  rawTreeSummary: string;
}

export interface SuggestionItem {
  id: string;
  predictionId: string;
  intent: IntentType;
  confidence: number;
  rootCause: string;
  suggestedFix: string;
  originalCode: string;
  targetFile: string;
  targetLine: number;
  generatedTest: string;
  explanation: string;
  timestamp: string;
  preparedAgoMs: number;
  speculativelyPrepared: boolean;
  status: 'prepared' | 'applied' | 'dismissed';
}

export interface LatencyBreakdown {
  contextCollectionMs: number;
  featureExtractionMs: number;
  intentPredictionMs: number;
  speculativeAnalysisMs: number;
  cacheRetrievalMs: number;
  totalPreparationMs: number;
  timestamp: string;
}

export interface GazeContextData {
  enabled: boolean;
  activeRegion: 'terminal' | 'error' | 'source_code' | 'none';
  timeOnTerminalSec: number;
  timeOnErrorSec: number;
  timeOnSourceCodeSec: number;
  gazeCoordinates: { x: number; y: number };
  webcamGranted: boolean;
  lastUpdated: string;
}

export interface SystemSettings {
  behavioralTrackingEnabled: boolean;
  gazeTrackingEnabled: boolean;
  speculativeGenerationEnabled: boolean;
  confidenceThreshold: number; // e.g. 0.80
  localLlmEnabled: boolean;
  ollamaEndpoint: string;
  modelName: string;
  cacheDurationSec: number;
  privacyStrictLocal: boolean;
}

export interface DemoStep {
  stepIndex: number;
  title: string;
  description: string;
  activeFile: string;
  line: number;
  signals: Partial<DeveloperSignals>;
  diagnostics: DiagnosticItem[];
  intent: IntentType;
  confidence: number;
}
