/**
 * GhostPilot AI Developer Platform - Type Definitions
 * Subsystem Domain: speculative_execution
 * Component: Ghost Text Stream Synchronizer and Pipeline (ghost-text-stream-synchronizer)
 * High-throughput speculative execution, AST graphs, and intent prediction schemas.
 */

export enum GhostTextStreamSynchronizerStatus {
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

export enum GhostTextStreamSynchronizerPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  BACKGROUND = 'BACKGROUND',
}}

export enum GhostTextStreamSynchronizerExecutionTier {
  KERNEL_LEVEL = 'KERNEL_LEVEL',
  WORKSPACE_SANDBOX = 'WORKSPACE_SANDBOX',
  SPECULATIVE_SHADOW = 'SPECULATIVE_SHADOW',
  BACKGROUND_DAEMON = 'BACKGROUND_DAEMON',
  CLIENT_STANDALONE = 'CLIENT_STANDALONE',
}}

export enum GhostTextStreamSynchronizerFailureCode {
  NONE = 'NONE',
  TIMEOUT = 'TIMEOUT',
  SYNTAX_VIOLATION = 'SYNTAX_VIOLATION',
  TYPE_MISMATCH = 'TYPE_MISMATCH',
  MEMORY_EXCEEDED = 'MEMORY_EXCEEDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}}

export interface GhostTextStreamSynchronizerMetadata {
  readonly transactionId: string;
  readonly sessionId: string;
  readonly developerId: string;
  readonly workspaceRoot: string;
  readonly createdEpochMs: number;
  readonly updatedTimestamp: string;
  readonly schemaVersion: string;
  readonly correlationId: string;
}}

export interface GhostTextStreamSynchronizerConfiguration {
  maxConcurrency: number;
  timeoutMs: number;
  speculativeDepth: number;
  enableTelemetry: boolean;
  strictValidation: boolean;
  retryBudget: number;
  cacheTtlMs: number;
  memoryLimitMb: number;
}}

export interface GhostTextStreamSynchronizerDiagnosticStamp {
  filePath: string;
  lineRange: [number, number];
  severity: 'error' | 'warning' | 'info';
  message: string;
  ruleCode: string;
  timestamp: number;
}}

export interface GhostTextStreamSynchronizerMetricSummary {
  totalEvaluations: number;
  successRatePercentage: number;
  meanLatencyMs: number;
  memoryFootprintKb: number;
  peakSpeculativeForks: number;
  healthIndex: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_1 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_1 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_1[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_2 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_2 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_2[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_3 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_3 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_3[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_4 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_4 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_4[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_5 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_5 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_5[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_6 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_6 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_6[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_7 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_7 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_7[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_8 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_8 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_8[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_9 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_9 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_9[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_10 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_10 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_10[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_11 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_11 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_11[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_12 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_12 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_12[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_13 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_13 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_13[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_14 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_14 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_14[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_15 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_15 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_15[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface GhostTextStreamSynchronizerEntityRecord_16 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ghost' | 'synchronizer' | 'speculative' | 'runtime';
  executionState: GhostTextStreamSynchronizerStatus;
  priorityLevel: GhostTextStreamSynchronizerPriority;
  systemTier: GhostTextStreamSynchronizerExecutionTier;
  failureCode: GhostTextStreamSynchronizerFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: GhostTextStreamSynchronizerMetadata;
  diagnosticContext: GhostTextStreamSynchronizerDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface GhostTextStreamSynchronizerBatchOperationResult_16 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: GhostTextStreamSynchronizerEntityRecord_16[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}
