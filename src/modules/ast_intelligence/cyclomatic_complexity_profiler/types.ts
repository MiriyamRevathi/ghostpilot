/**
 * GhostPilot AI Developer Platform - Type Definitions
 * Subsystem Domain: ast_intelligence
 * Component: Cyclomatic Complexity and Halstead Metric Profiler (cyclomatic-complexity-profiler)
 * High-throughput speculative execution, AST graphs, and intent prediction schemas.
 */

export enum CyclomaticComplexityProfilerStatus {
  INITIALIZED = 'INITIALIZED',
  ACTIVE = 'ACTIVE',
  PREPARING = 'PREPARING',
  SPECULATING = 'SPECULATING',
  EVALUATING = 'EVALUATING',
  COMMITTED = 'COMMITTED',
  REVERTED = 'REVERTED',
  ERROR = 'ERROR',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}}

export enum CyclomaticComplexityProfilerPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  BACKGROUND = 'BACKGROUND',
}}

export enum CyclomaticComplexityProfilerExecutionTier {
  KERNEL_LEVEL = 'KERNEL_LEVEL',
  WORKSPACE_SANDBOX = 'WORKSPACE_SANDBOX',
  SPECULATIVE_SHADOW = 'SPECULATIVE_SHADOW',
  BACKGROUND_DAEMON = 'BACKGROUND_DAEMON',
  CLIENT_STANDALONE = 'CLIENT_STANDALONE',
}}

export enum CyclomaticComplexityProfilerFailureCode {
  NONE = 'NONE',
  TIMEOUT = 'TIMEOUT',
  SYNTAX_VIOLATION = 'SYNTAX_VIOLATION',
  TYPE_MISMATCH = 'TYPE_MISMATCH',
  MEMORY_EXCEEDED = 'MEMORY_EXCEEDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}}

export interface CyclomaticComplexityProfilerMetadata {
  readonly transactionId: string;
  readonly sessionId: string;
  readonly developerId: string;
  readonly workspaceRoot: string;
  readonly createdEpochMs: number;
  readonly updatedTimestamp: string;
  readonly schemaVersion: string;
  readonly correlationId: string;
}}

export interface CyclomaticComplexityProfilerConfiguration {
  maxConcurrency: number;
  timeoutMs: number;
  speculativeDepth: number;
  enableTelemetry: boolean;
  strictValidation: boolean;
  retryBudget: number;
  cacheTtlMs: number;
  memoryLimitMb: number;
}}

export interface CyclomaticComplexityProfilerDiagnosticStamp {
  filePath: string;
  lineRange: [number, number];
  severity: 'error' | 'warning' | 'info';
  message: string;
  ruleCode: string;
  timestamp: number;
}}

export interface CyclomaticComplexityProfilerMetricSummary {
  totalEvaluations: number;
  successRatePercentage: number;
  meanLatencyMs: number;
  memoryFootprintKb: number;
  peakSpeculativeForks: number;
  healthIndex: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_1 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_1 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_1[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_2 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_2 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_2[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_3 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_3 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_3[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_4 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_4 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_4[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_5 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_5 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_5[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_6 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_6 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_6[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_7 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_7 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_7[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_8 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_8 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_8[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_9 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_9 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_9[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_10 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_10 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_10[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_11 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_11 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_11[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_12 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_12 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_12[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_13 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_13 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_13[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_14 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_14 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_14[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_15 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_15 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_15[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface CyclomaticComplexityProfilerEntityRecord_16 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'cyclomatic' | 'profiler' | 'speculative' | 'runtime';
  executionState: CyclomaticComplexityProfilerStatus;
  priorityLevel: CyclomaticComplexityProfilerPriority;
  systemTier: CyclomaticComplexityProfilerExecutionTier;
  failureCode: CyclomaticComplexityProfilerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: CyclomaticComplexityProfilerMetadata;
  diagnosticContext: CyclomaticComplexityProfilerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface CyclomaticComplexityProfilerBatchOperationResult_16 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: CyclomaticComplexityProfilerEntityRecord_16[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}
