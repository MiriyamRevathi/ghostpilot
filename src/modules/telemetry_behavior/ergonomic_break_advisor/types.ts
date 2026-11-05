/**
 * GhostPilot AI Developer Platform - Type Definitions
 * Subsystem Domain: telemetry_behavior
 * Component: Ergonomic Rest Reminder and Fatigue Advisor (ergonomic-break-advisor)
 * High-throughput speculative execution, AST graphs, and intent prediction schemas.
 */

export enum ErgonomicBreakAdvisorStatus {
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

export enum ErgonomicBreakAdvisorPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  BACKGROUND = 'BACKGROUND',
}}

export enum ErgonomicBreakAdvisorExecutionTier {
  KERNEL_LEVEL = 'KERNEL_LEVEL',
  WORKSPACE_SANDBOX = 'WORKSPACE_SANDBOX',
  SPECULATIVE_SHADOW = 'SPECULATIVE_SHADOW',
  BACKGROUND_DAEMON = 'BACKGROUND_DAEMON',
  CLIENT_STANDALONE = 'CLIENT_STANDALONE',
}}

export enum ErgonomicBreakAdvisorFailureCode {
  NONE = 'NONE',
  TIMEOUT = 'TIMEOUT',
  SYNTAX_VIOLATION = 'SYNTAX_VIOLATION',
  TYPE_MISMATCH = 'TYPE_MISMATCH',
  MEMORY_EXCEEDED = 'MEMORY_EXCEEDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}}

export interface ErgonomicBreakAdvisorMetadata {
  readonly transactionId: string;
  readonly sessionId: string;
  readonly developerId: string;
  readonly workspaceRoot: string;
  readonly createdEpochMs: number;
  readonly updatedTimestamp: string;
  readonly schemaVersion: string;
  readonly correlationId: string;
}}

export interface ErgonomicBreakAdvisorConfiguration {
  maxConcurrency: number;
  timeoutMs: number;
  speculativeDepth: number;
  enableTelemetry: boolean;
  strictValidation: boolean;
  retryBudget: number;
  cacheTtlMs: number;
  memoryLimitMb: number;
}}

export interface ErgonomicBreakAdvisorDiagnosticStamp {
  filePath: string;
  lineRange: [number, number];
  severity: 'error' | 'warning' | 'info';
  message: string;
  ruleCode: string;
  timestamp: number;
}}

export interface ErgonomicBreakAdvisorMetricSummary {
  totalEvaluations: number;
  successRatePercentage: number;
  meanLatencyMs: number;
  memoryFootprintKb: number;
  peakSpeculativeForks: number;
  healthIndex: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_1 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_1 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_1[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_2 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_2 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_2[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_3 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_3 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_3[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_4 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_4 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_4[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_5 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_5 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_5[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_6 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_6 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_6[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_7 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_7 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_7[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_8 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_8 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_8[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_9 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_9 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_9[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_10 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_10 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_10[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_11 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_11 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_11[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_12 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_12 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_12[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_13 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_13 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_13[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_14 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_14 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_14[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_15 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_15 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_15[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}

export interface ErgonomicBreakAdvisorEntityRecord_16 {
  entityId: string;
  sequenceIndex: number;
  recordSlug: string;
  categoryDomain: 'ergonomic' | 'advisor' | 'speculative' | 'runtime';
  executionState: ErgonomicBreakAdvisorStatus;
  priorityLevel: ErgonomicBreakAdvisorPriority;
  systemTier: ErgonomicBreakAdvisorExecutionTier;
  failureCode: ErgonomicBreakAdvisorFailureCode;
  scalarScore: number;
  confidenceWeight: number;
  complexityMetric: number;
  thresholdLimit: number;
  isSpeculativeBranch: boolean;
  isAutoReconciled: boolean;
  auditTrail: string[];
  systemMetadata: ErgonomicBreakAdvisorMetadata;
  diagnosticContext: ErgonomicBreakAdvisorDiagnosticStamp;
  propertyBag: Record<string, string | number | boolean>;
  temporalMarkers: {
    registeredEpoch: number;
    evaluatedEpoch: number;
    expirationEpoch: number;
  };
}}

export interface ErgonomicBreakAdvisorBatchOperationResult_16 {
  batchId: string;
  timestampIso: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  records: ErgonomicBreakAdvisorEntityRecord_16[];
  checksumSha256: string;
  elapsedLatencyMs: number;
}}
