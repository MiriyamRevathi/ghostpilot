import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

interface DeveloperSignals {
  typing_speed: number;
  pause_duration: number;
  backspace_count: number;
  cursor_movement: number;
  mouse_activity: number;
  error_count: number;
  terminal_activity: number;
  diagnostic_count: number;
  code_complexity: number;
  time_on_problem: number;
}

interface DeveloperContext {
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

interface DiagnosticItem {
  id: string;
  type: string;
  message: string;
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
  stackTrace?: string;
  relatedCodeSnippet?: string;
  timestamp: string;
}

interface SuggestionItem {
  id: string;
  predictionId: string;
  intent: string;
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
  status: "prepared" | "applied" | "dismissed";
  fromCache?: boolean;
}

interface CacheEntry {
  key: string;
  createdAt: number;
  data: SuggestionItem;
}

// In-Memory Database-Free State
let currentContext: DeveloperContext = {
  projectName: "TaskManager",
  activeFile: "src/services/UserService.ts",
  language: "TypeScript",
  cursorLine: 16,
  cursorColumn: 45,
  codeComplexity: 3.2,
  diagnosticCount: 1,
  sourceCode: `export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
}

export class UserService {
  private users: User[] = [
    { id: 'usr_1', name: 'Alice Chen', email: 'alice@company.internal', role: 'admin' },
    { id: 'usr_2', name: 'Bob Martinez', email: 'bob@company.internal', role: 'developer' }
  ];

  public getUserDisplayName(id: string): string {
    return this.users.find(u => u.id === id).name;
  }
}`,
};

let currentSignals: DeveloperSignals = {
  typing_speed: 18.0,
  pause_duration: 4.2,
  backspace_count: 3,
  cursor_movement: 1.2,
  mouse_activity: 2.5,
  error_count: 1,
  terminal_activity: 1.0,
  diagnostic_count: 1,
  code_complexity: 3.2,
  time_on_problem: 42.0,
};

let currentDiagnostics: DiagnosticItem[] = [
  {
    id: "diag_001",
    type: "TypeError",
    message: "Cannot read properties of undefined (reading 'name')",
    file: "src/services/UserService.ts",
    line: 16,
    column: 45,
    severity: "error",
    stackTrace: "TypeError: Cannot read properties of undefined (reading 'name')\n    at UserService.getUserDisplayName (/app/src/services/UserService.ts:16:45)\n    at Object.<anonymous> (/app/tests/user.test.ts:24:20)",
    relatedCodeSnippet: "return this.users.find(u => u.id === id).name;",
    timestamp: new Date().toISOString(),
  },
];

let speculativeCache: Map<string, CacheEntry> = new Map();
let cacheStats = { hits: 0, misses: 0, evictions: 0 };

let currentSettings = {
  behavioralTrackingEnabled: true,
  gazeTrackingEnabled: false,
  speculativeGenerationEnabled: true,
  confidenceThreshold: 0.80,
  localLlmEnabled: false,
  ollamaEndpoint: "http://localhost:11434",
  modelName: "codellama",
  cacheDurationSec: 300,
  privacyStrictLocal: true,
};

let lastLatency = {
  contextCollectionMs: 11.4,
  featureExtractionMs: 3.8,
  intentPredictionMs: 7.2,
  speculativeAnalysisMs: 245.0,
  cacheRetrievalMs: 2.1,
  totalPreparationMs: 269.5,
  timestamp: new Date().toISOString(),
};

let gazeContext = {
  enabled: false,
  activeRegion: "error",
  timeOnTerminalSec: 1.2,
  timeOnErrorSec: 2.4,
  timeOnSourceCodeSec: 4.1,
  gazeCoordinates: { x: 450, y: 320 },
  webcamGranted: false,
  lastUpdated: new Date().toISOString(),
};

const INTENTS = [
  "DEBUG_ERROR",
  "WRITE_UNIT_TEST",
  "EXPLAIN_ERROR",
  "REFACTOR_CODE",
  "WRITE_DOCUMENTATION",
  "NAVIGATE_CODE",
  "SEARCH_CODEBASE",
  "RUN_TEST",
  "FIX_SYNTAX",
  "REVIEW_CODE",
] as const;

// Load ML Model Weights
let modelWeights = {
  feature_means: [3.5, 45.0, 4.0, 2.5, 3.8, 1.2, 0.35, 1.4, 4.2, 45.0],
  feature_stds: [2.8, 35.0, 4.5, 2.2, 2.9, 1.6, 0.48, 1.8, 3.1, 50.0],
  intercepts: {
    DEBUG_ERROR: 1.25,
    WRITE_UNIT_TEST: -0.45,
    EXPLAIN_ERROR: -0.8,
    REFACTOR_CODE: -0.3,
    WRITE_DOCUMENTATION: -1.1,
    NAVIGATE_CODE: -0.2,
    SEARCH_CODEBASE: -0.6,
    RUN_TEST: 0.1,
    FIX_SYNTAX: -0.15,
    REVIEW_CODE: -0.95,
  } as Record<string, number>,
  coefficients: {
    DEBUG_ERROR: [1.85, -1.2, 1.1, 0.4, -0.3, 2.4, 1.75, 2.3, 0.8, 1.6],
    WRITE_UNIT_TEST: [0.3, 1.1, -0.4, 0.6, 0.2, -0.5, 0.4, -0.4, 1.5, 0.8],
    EXPLAIN_ERROR: [1.9, -1.5, 0.3, -0.6, 0.1, 1.8, 1.1, 1.7, 1.2, 2.2],
    REFACTOR_CODE: [0.8, 0.5, 0.7, 1.2, 0.8, -0.8, -0.5, -0.6, 2.4, 1.1],
    WRITE_DOCUMENTATION: [1.1, 0.8, -0.3, -0.4, -0.2, -0.9, -0.8, -0.8, 1.1, -0.3],
    NAVIGATE_CODE: [-0.9, -0.4, -0.8, 2.5, 1.8, -0.4, -0.2, -0.3, -0.2, -0.8],
    SEARCH_CODEBASE: [-0.6, 0.4, -0.3, 1.4, 1.9, -0.2, 0.3, -0.2, 0.3, -0.5],
    RUN_TEST: [-0.8, -0.6, -0.7, -0.2, 0.4, 0.8, 2.8, 0.6, -0.4, -0.7],
    FIX_SYNTAX: [0.4, -0.2, 2.2, -0.3, -0.4, 1.6, -0.2, 1.9, -0.5, 0.4],
    REVIEW_CODE: [1.4, -1.6, -0.9, 1.1, 0.7, -0.6, -0.7, -0.5, 1.3, 1.4],
  } as Record<string, number[]>,
};

try {
  const weightsPath = path.join(process.cwd(), "models", "intent_model_weights.json");
  if (fs.existsSync(weightsPath)) {
    const raw = fs.readFileSync(weightsPath, "utf-8");
    modelWeights = JSON.parse(raw);
  }
} catch (err) {
  console.log("Using built-in intent weights");
}

function predictIntentWithML(signals: DeveloperSignals) {
  const rawVec = [
    signals.pause_duration,
    signals.typing_speed,
    signals.backspace_count,
    signals.cursor_movement,
    signals.mouse_activity,
    signals.error_count,
    signals.terminal_activity,
    signals.diagnostic_count,
    signals.code_complexity,
    signals.time_on_problem,
  ];

  // Standardize
  const stdVec = rawVec.map((val, idx) => {
    const mean = modelWeights.feature_means[idx] || 0;
    const std = modelWeights.feature_stds[idx] || 1;
    return (val - mean) / (std > 1e-5 ? std : 1);
  });

  // Softmax logits
  const scores: Record<string, number> = {};
  for (const intent of INTENTS) {
    const b = modelWeights.intercepts[intent] ?? 0;
    const w = modelWeights.coefficients[intent] ?? new Array(10).fill(0);
    const dot = stdVec.reduce((acc, x, i) => acc + x * (w[i] || 0), 0);
    scores[intent] = b + dot;
  }

  const maxScore = Math.max(...Object.values(scores));
  const expScores: Record<string, number> = {};
  let sumExp = 0;
  for (const [k, v] of Object.entries(scores)) {
    const expVal = Math.exp(v - maxScore);
    expScores[k] = expVal;
    sumExp += expVal;
  }

  const probabilities: Record<string, number> = {};
  for (const [k, v] of Object.entries(expScores)) {
    probabilities[k] = v / sumExp;
  }

  // Pick top intent
  let bestIntent = "DEBUG_ERROR";
  let maxProb = 0;
  for (const [k, v] of Object.entries(probabilities)) {
    if (v > maxProb) {
      maxProb = v;
      bestIntent = k;
    }
  }

  // Supporting signals
  const supporting: string[] = [];
  if (signals.terminal_activity > 0) supporting.push("terminal_error");
  if (signals.pause_duration >= 3.0) supporting.push("long_pause");
  if (signals.diagnostic_count > 0) supporting.push("cursor_near_diagnostic");
  if (signals.backspace_count >= 3) supporting.push("repeated_edit");
  if (signals.typing_speed > 50) supporting.push("flow_state_typing");
  if (signals.time_on_problem > 35) supporting.push("prolonged_blocker");
  if (signals.cursor_movement > 3) supporting.push("frequent_navigation");
  if (supporting.length === 0) supporting.push("steady_cadence");

  // Friction level
  const frictionScore =
    (signals.pause_duration / 6.0) * 0.3 +
    (signals.backspace_count / 6.0) * 0.25 +
    (signals.error_count / 2.0) * 0.25 +
    (signals.time_on_problem / 60.0) * 0.2;

  let cognitiveLoad: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (frictionScore >= 0.7) cognitiveLoad = "HIGH";
  else if (frictionScore >= 0.35) cognitiveLoad = "MEDIUM";

  return {
    intent: bestIntent,
    confidence: Math.min(0.98, Math.max(0.45, Math.round(maxProb * 100) / 100)),
    supporting_signals: supporting,
    cognitive_load: cognitiveLoad,
    all_probabilities: probabilities,
  };
}

function analyzeAST(code: string, language: string) {
  const lines = code.split("\n");
  const functions: { name: string; line: number; params: string[]; complexity: number }[] = [];
  const classes: { name: string; line: number; methodsCount: number }[] = [];
  const variables: { name: string; line: number; kind: string }[] = [];
  const imports: { source: string; specifiers: string[]; line: number }[] = [];
  const calls: { callee: string; line: number }[] = [];
  let conditionsCount = 0;
  let returnStatementsCount = 0;
  const syntaxErrors: string[] = [];

  const bracketStack: { char: string; line: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) continue;

    // Bracket checking
    for (const ch of line) {
      if (ch === "{" || ch === "[" || ch === "(") {
        bracketStack.push({ char: ch, line: lineNum });
      } else if (ch === "}" || ch === "]" || ch === ")") {
        if (bracketStack.length === 0) {
          syntaxErrors.push(`Unmatched closing '${ch}' at line ${lineNum}`);
        } else {
          const top = bracketStack.pop()!;
          const matches: Record<string, string> = { "{": "}", "[": "]", "(": ")" };
          if (matches[top.char] !== ch) {
            syntaxErrors.push(`Mismatched bracket '${top.char}' (line ${top.line}) closed by '${ch}' at line ${lineNum}`);
          }
        }
      }
    }

    // Classes
    const classMatch = line.match(/(?:export\s+)?class\s+([A-Za-z0-9_$]+)/);
    if (classMatch) {
      classes.push({ name: classMatch[1], line: lineNum, methodsCount: 0 });
    }

    // Functions
    const funcMatch = line.match(/(?:async\s+)?(?:function\s+([A-Za-z0-9_$]+)|(?:public|private|protected|static)?\s*(?:async\s+)?([A-Za-z0-9_$]+)\s*\((.*?)\))/);
    if (funcMatch) {
      const name = funcMatch[1] || funcMatch[2];
      if (name && !["if", "for", "while", "switch", "catch"].includes(name)) {
        const rawParams = funcMatch[3] || "";
        const params = rawParams.split(",").map(p => p.trim()).filter(Boolean);
        functions.push({ name, line: lineNum, params, complexity: 1 });
      }
    }

    // Variables
    const varMatch = line.match(/(const|let|var)\s+([A-Za-z0-9_$]+)/);
    if (varMatch) {
      variables.push({ kind: varMatch[1], name: varMatch[2], line: lineNum });
    }

    // Imports
    const importMatch = line.match(/import\s+(?:\{([^}]+)\}|([A-Za-z0-9_$]+))\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      const source = importMatch[3];
      const specifiers = importMatch[1] ? importMatch[1].split(",").map(s => s.trim()) : [importMatch[2]];
      imports.push({ source, specifiers, line: lineNum });
    }

    // Conditions
    if (/\b(if|else if|switch|case|while|for)\b/.test(line)) {
      conditionsCount++;
    }

    // Returns
    if (/\breturn\b/.test(line)) {
      returnStatementsCount++;
    }

    // Calls
    const callMatches = line.matchAll(/\b([A-Za-z0-9_$]+)\s*\(/g);
    for (const cm of callMatches) {
      const callee = cm[1];
      if (!["if", "for", "while", "switch", "function", "catch", "return", "class"].includes(callee)) {
        calls.push({ callee, line: lineNum });
      }
    }
  }

  if (bracketStack.length > 0) {
    for (const unclosed of bracketStack) {
      syntaxErrors.push(`Unclosed bracket '${unclosed.char}' at line ${unclosed.line}`);
    }
  }

  const estimatedComplexity = Math.round((1 + conditionsCount + functions.length * 0.5) * 10) / 10;

  return {
    language,
    file: currentContext.activeFile,
    functions,
    classes,
    variables: variables.slice(0, 20),
    imports,
    calls: calls.slice(0, 30),
    conditionsCount,
    returnStatementsCount,
    estimatedComplexity,
    syntaxErrors,
    rawTreeSummary: `AST Summary: ${classes.length} class(es), ${functions.length} function(s), ${imports.length} import(s), ${conditionsCount} conditional branch(es). Cyclomatic complexity: ${estimatedComplexity}.`,
  };
}

function synthesizeSuggestion(intent: string, confidence: number): SuggestionItem {
  const diag = currentDiagnostics[0];
  const targetFile = currentContext.activeFile;
  const targetLine = currentContext.cursorLine;
  const snippet = diag?.relatedCodeSnippet || "return this.users.find(u => u.id === id).name;";

  const cacheKey = `${targetFile}:${targetLine}:${snippet.trim()}:${diag?.id || "none"}`;
  const cached = speculativeCache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.createdAt < currentSettings.cacheDurationSec * 1000) {
    cacheStats.hits++;
    return {
      ...cached.data,
      preparedAgoMs: now - cached.createdAt,
      fromCache: true,
    };
  }

  cacheStats.misses++;

  let rootCause = "Collection search `this.users.find(...)` returns undefined when no matching element exists, causing an uncaught TypeError on property access `.name`.";
  let suggestedFix = `const user = this.users.find(u => u.id === id);\nreturn user?.name;`;
  let originalCode = snippet;
  let generatedTest = `describe('UserService.getUserDisplayName', () => {
  it('should handle missing user safely and return undefined without throwing TypeError', () => {
    const service = new UserService();
    const result = service.getUserDisplayName('non_existent_id');
    expect(result).toBeUndefined();
  });
});`;
  let explanation = "Refactored the direct chained `.name` dereference into an intermediate variable assignment guarded with optional chaining `?.name`. This ensures the function returns undefined gracefully instead of halting execution.";

  if (diag?.type === "ReferenceError") {
    rootCause = `Referenced variable is not defined or out of lexical scope: ${diag.message}`;
    suggestedFix = `const safeVal = (typeof ${diag.message.split(" ")[0]} !== 'undefined') ? ${diag.message.split(" ")[0]} : null;`;
    generatedTest = `it('should guarantee identifier is declared in scope', () => { expect(safeVal).toBeDefined(); });`;
    explanation = "Injected scoped declaration guard to prevent ReferenceError.";
  }

  const suggestion: SuggestionItem = {
    id: `sug_${Math.random().toString(36).substring(2, 9)}`,
    predictionId: `pred_${Math.random().toString(36).substring(2, 8)}`,
    intent,
    confidence,
    rootCause,
    suggestedFix,
    originalCode,
    targetFile,
    targetLine,
    generatedTest,
    explanation,
    timestamp: new Date().toISOString(),
    preparedAgoMs: 140,
    speculativelyPrepared: true,
    status: "prepared",
    fromCache: false,
  };

  speculativeCache.set(cacheKey, {
    key: cacheKey,
    createdAt: now,
    data: suggestion,
  });

  return suggestion;
}

let latestActiveSuggestion: SuggestionItem | null = null;
let recentPredictionsList: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      name: "GhostPilot",
      version: "1.0.0",
      architecture: "Local-First Zero-Touch Developer Intelligence",
      database: "NONE (In-Memory Local Engine)",
      externalKeys: "NONE",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/context", (_req, res) => {
    res.json({
      context: currentContext,
      signals: currentSignals,
      diagnostics: currentDiagnostics,
    });
  });

  app.post("/api/context", (req, res) => {
    if (req.body.context) {
      currentContext = { ...currentContext, ...req.body.context };
    }
    if (req.body.signals) {
      currentSignals = { ...currentSignals, ...req.body.signals };
    }
    if (req.body.diagnostics) {
      currentDiagnostics = req.body.diagnostics;
    }
    res.json({ status: "updated", context: currentContext, signals: currentSignals });
  });

  app.post("/api/predict", (_req, res) => {
    const t0 = performance.now();
    const prediction = predictIntentWithML(currentSignals);
    const tIntent = performance.now();

    let speculativeStatus: "IDLE" | "PREPARING" | "READY" = "IDLE";
    let suggestion: SuggestionItem | null = null;
    let specMs = 0;

    if (
      currentSettings.speculativeGenerationEnabled &&
      prediction.confidence >= currentSettings.confidenceThreshold
    ) {
      speculativeStatus = "PREPARING";
      const tSpec0 = performance.now();
      suggestion = synthesizeSuggestion(prediction.intent, prediction.confidence);
      latestActiveSuggestion = suggestion;
      specMs = Math.round(performance.now() - tSpec0);
      speculativeStatus = "READY";
    }

    const totalMs = Math.round(performance.now() - t0);

    lastLatency = {
      contextCollectionMs: 12.0,
      featureExtractionMs: 3.5,
      intentPredictionMs: Math.round((tIntent - t0) * 10) / 10,
      speculativeAnalysisMs: specMs || 180,
      cacheRetrievalMs: suggestion?.fromCache ? 1.5 : 0.8,
      totalPreparationMs: totalMs || 196,
      timestamp: new Date().toISOString(),
    };

    const result = {
      ...prediction,
      timestamp: new Date().toISOString(),
      features: currentSignals,
      speculative_status: speculativeStatus,
      active_suggestion: suggestion,
    };

    recentPredictionsList.unshift(result);
    if (recentPredictionsList.length > 20) recentPredictionsList.pop();

    res.json(result);
  });

  app.post("/api/analyze-code", (req, res) => {
    const code = req.body.code || currentContext.sourceCode;
    const language = req.body.language || currentContext.language;
    const analysis = analyzeAST(code, language);
    res.json(analysis);
  });

  app.get("/api/diagnostics", (_req, res) => {
    res.json(currentDiagnostics);
  });

  app.post("/api/diagnostics", (req, res) => {
    const newDiag: DiagnosticItem = {
      id: `diag_${Date.now()}`,
      type: req.body.type || "TypeScriptDiagnostic",
      message: req.body.message || "Unspecified diagnostic",
      file: req.body.file || currentContext.activeFile,
      line: req.body.line || currentContext.cursorLine,
      column: req.body.column || currentContext.cursorColumn,
      severity: req.body.severity || "error",
      stackTrace: req.body.stackTrace,
      relatedCodeSnippet: req.body.relatedCodeSnippet,
      timestamp: new Date().toISOString(),
    };
    currentDiagnostics.unshift(newDiag);
    currentSignals.diagnostic_count = currentDiagnostics.length;
    currentSignals.error_count = currentDiagnostics.filter(d => d.severity === "error").length;
    res.json({ status: "added", diagnostic: newDiag, count: currentDiagnostics.length });
  });

  app.delete("/api/diagnostics/:id", (req, res) => {
    currentDiagnostics = currentDiagnostics.filter(d => d.id !== req.params.id);
    currentSignals.diagnostic_count = currentDiagnostics.length;
    currentSignals.error_count = currentDiagnostics.filter(d => d.severity === "error").length;
    res.json({ status: "deleted", remaining: currentDiagnostics.length });
  });

  app.get("/api/suggestions/latest", (_req, res) => {
    if (!latestActiveSuggestion) {
      latestActiveSuggestion = synthesizeSuggestion("DEBUG_ERROR", 0.92);
    }
    res.json(latestActiveSuggestion);
  });

  app.post("/api/suggestions/apply", (req, res) => {
    const fix = req.body.suggestedFix || (latestActiveSuggestion && latestActiveSuggestion.suggestedFix);
    const orig = req.body.originalCode || (latestActiveSuggestion && latestActiveSuggestion.originalCode);

    if (fix) {
      if (orig && currentContext.sourceCode.includes(orig)) {
        currentContext.sourceCode = currentContext.sourceCode.replace(orig, fix);
      } else {
        // Safe splice replacement around cursor
        const lines = currentContext.sourceCode.split("\n");
        const idx = Math.max(0, currentContext.cursorLine - 1);
        lines[idx] = `    ${fix.split("\n").join("\n    ")}`;
        currentContext.sourceCode = lines.join("\n");
      }
    }

    if (latestActiveSuggestion) {
      latestActiveSuggestion.status = "applied";
    }

    // Clear resolved diagnostics
    currentDiagnostics = [];
    currentSignals.diagnostic_count = 0;
    currentSignals.error_count = 0;
    currentSignals.terminal_activity = 0;
    currentSignals.pause_duration = 0.5;

    res.json({
      status: "applied",
      activeFile: currentContext.activeFile,
      sourceCode: currentContext.sourceCode,
      message: "Speculative fix applied successfully.",
    });
  });

  app.post("/api/suggestions/dismiss", (_req, res) => {
    if (latestActiveSuggestion) {
      latestActiveSuggestion.status = "dismissed";
    }
    latestActiveSuggestion = null;
    res.json({ status: "dismissed" });
  });

  app.get("/api/cache", (_req, res) => {
    const entries = Array.from(speculativeCache.values()).map(e => ({
      ...e.data,
      preparedAgoMs: Date.now() - e.createdAt,
    }));
    res.json({
      entries,
      stats: {
        ...cacheStats,
        entryCount: speculativeCache.size,
        ttlSeconds: currentSettings.cacheDurationSec,
      },
    });
  });

  app.delete("/api/cache", (_req, res) => {
    const count = speculativeCache.size;
    speculativeCache.clear();
    cacheStats.evictions += count;
    res.json({ status: "cleared", clearedCount: count });
  });

  app.get("/api/latency", (_req, res) => {
    res.json(lastLatency);
  });

  app.get("/api/settings", (_req, res) => {
    res.json(currentSettings);
  });

  app.post("/api/settings", (req, res) => {
    currentSettings = { ...currentSettings, ...req.body };
    res.json(currentSettings);
  });

  app.get("/api/gaze", (_req, res) => {
    res.json(gazeContext);
  });

  app.post("/api/gaze", (req, res) => {
    gazeContext = { ...gazeContext, ...req.body, lastUpdated: new Date().toISOString() };
    res.json(gazeContext);
  });

  app.get("/api/vscode/status", (_req, res) => {
    res.json({
      connected: true,
      extension: "ghostpilot-vscode",
      version: "1.0.0",
      activeWorkspace: currentContext.projectName,
      activeFile: currentContext.activeFile,
      channel: "local-ipc",
    });
  });

  app.get("/api/inference/status", (_req, res) => {
    res.json({
      available: false,
      endpoint: currentSettings.ollamaEndpoint,
      model: currentSettings.modelName,
      fallbackMode: "Local AST & Rule-based synthesis engine active (zero external API required)",
      status: "offline_fallback_ready",
    });
  });

  app.post("/api/demo/reset", (_req, res) => {
    currentContext.sourceCode = `export class UserService {
  private users: User[] = [
    { id: 'usr_1', name: 'Alice Chen', email: 'alice@company.internal', role: 'admin' },
    { id: 'usr_2', name: 'Bob Martinez', email: 'bob@company.internal', role: 'developer' }
  ];

  public getUserDisplayName(id: string): string {
    return this.users.find(u => u.id === id).name;
  }
}`;
    currentContext.activeFile = "src/services/UserService.ts";
    currentContext.cursorLine = 16;
    currentSignals = {
      typing_speed: 18.0,
      pause_duration: 4.2,
      backspace_count: 3,
      cursor_movement: 1.2,
      mouse_activity: 2.5,
      error_count: 1,
      terminal_activity: 1.0,
      diagnostic_count: 1,
      code_complexity: 3.2,
      time_on_problem: 42.0,
    };
    currentDiagnostics = [
      {
        id: "diag_001",
        type: "TypeError",
        message: "Cannot read properties of undefined (reading 'name')",
        file: "src/services/UserService.ts",
        line: 16,
        column: 45,
        severity: "error",
        stackTrace: "TypeError: Cannot read properties of undefined (reading 'name')\n    at UserService.getUserDisplayName (/app/src/services/UserService.ts:16:45)",
        relatedCodeSnippet: "return this.users.find(u => u.id === id).name;",
        timestamp: new Date().toISOString(),
      },
    ];
    latestActiveSuggestion = synthesizeSuggestion("DEBUG_ERROR", 0.92);
    res.json({ status: "reset_done" });
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GhostPilot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
