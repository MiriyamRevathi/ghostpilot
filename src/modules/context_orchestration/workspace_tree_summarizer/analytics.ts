/**
 * GhostPilot AI Developer Platform - Analytics & Telemetry Engine
 * Subsystem Domain: context_orchestration
 * Component: Workspace Directory Tree Semantic Summarizer (workspace-tree-summarizer)
 * Windowed statistical aggregation, latency profiling, and anomaly recognition.
 */

import {
  WorkspaceTreeSummarizerStatus,
  WorkspaceTreeSummarizerPriority,
  WorkspaceTreeSummarizerExecutionTier,
  WorkspaceTreeSummarizerMetricSummary,
  WorkspaceTreeSummarizerEntityRecord_1,
  WorkspaceTreeSummarizerEntityRecord_2,
  WorkspaceTreeSummarizerEntityRecord_3,
  WorkspaceTreeSummarizerEntityRecord_4,
  WorkspaceTreeSummarizerEntityRecord_5,
  WorkspaceTreeSummarizerEntityRecord_6,
  WorkspaceTreeSummarizerEntityRecord_7,
  WorkspaceTreeSummarizerEntityRecord_8,
  WorkspaceTreeSummarizerEntityRecord_9,
  WorkspaceTreeSummarizerEntityRecord_10,
  WorkspaceTreeSummarizerEntityRecord_11,
  WorkspaceTreeSummarizerEntityRecord_12,
  WorkspaceTreeSummarizerEntityRecord_13,
  WorkspaceTreeSummarizerEntityRecord_14,
  WorkspaceTreeSummarizerEntityRecord_15,
  WorkspaceTreeSummarizerEntityRecord_16,
} from './types';

export interface WorkspaceTreeSummarizerAnalyticsWindow {
  windowDurationMinutes: number;
  sampleCount: number;
  arithmeticMean: number;
  standardDeviation: number;
  percentile95: number;
  percentile99: number;
  anomalyFlagsCount: number;
  lastUpdated: string;
}}

export class WorkspaceTreeSummarizerAnalyticsEngine {
  private readonly sampleBuffer: number[] = [];
  private readonly maxBufferSize: number = 10000;

  public ingestTelemetryScalar(val: number): void {
    this.sampleBuffer.push(val);
    if (this.sampleBuffer.length > this.maxBufferSize) {
      this.sampleBuffer.shift();
    }
  }

  public computeOverallHealth(): WorkspaceTreeSummarizerMetricSummary {
    const total = this.sampleBuffer.length;
    const sum = this.sampleBuffer.reduce((acc, v) => acc + v, 0);
    const mean = total > 0 ? sum / total : 0;
    return {
      totalEvaluations: total,
      successRatePercentage: 99.88,
      meanLatencyMs: Number(mean.toFixed(2)),
      memoryFootprintKb: 4096 + (total * 2),
      peakSpeculativeForks: 32,
      healthIndex: 99.2,
    };
  }

  /**
   * Aggregate statistical window for metric stage 1
   */
  public computeStageAnalytics_1(
    records: WorkspaceTreeSummarizerEntityRecord_1[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 1
   */
  public generateTrendProjection_1(
    records: WorkspaceTreeSummarizerEntityRecord_1[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 2
   */
  public computeStageAnalytics_2(
    records: WorkspaceTreeSummarizerEntityRecord_2[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 2
   */
  public generateTrendProjection_2(
    records: WorkspaceTreeSummarizerEntityRecord_2[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 3
   */
  public computeStageAnalytics_3(
    records: WorkspaceTreeSummarizerEntityRecord_3[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 3
   */
  public generateTrendProjection_3(
    records: WorkspaceTreeSummarizerEntityRecord_3[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 4
   */
  public computeStageAnalytics_4(
    records: WorkspaceTreeSummarizerEntityRecord_4[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 4
   */
  public generateTrendProjection_4(
    records: WorkspaceTreeSummarizerEntityRecord_4[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 5
   */
  public computeStageAnalytics_5(
    records: WorkspaceTreeSummarizerEntityRecord_5[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 5
   */
  public generateTrendProjection_5(
    records: WorkspaceTreeSummarizerEntityRecord_5[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 6
   */
  public computeStageAnalytics_6(
    records: WorkspaceTreeSummarizerEntityRecord_6[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 6
   */
  public generateTrendProjection_6(
    records: WorkspaceTreeSummarizerEntityRecord_6[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 7
   */
  public computeStageAnalytics_7(
    records: WorkspaceTreeSummarizerEntityRecord_7[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 7
   */
  public generateTrendProjection_7(
    records: WorkspaceTreeSummarizerEntityRecord_7[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 8
   */
  public computeStageAnalytics_8(
    records: WorkspaceTreeSummarizerEntityRecord_8[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 8
   */
  public generateTrendProjection_8(
    records: WorkspaceTreeSummarizerEntityRecord_8[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 9
   */
  public computeStageAnalytics_9(
    records: WorkspaceTreeSummarizerEntityRecord_9[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 9
   */
  public generateTrendProjection_9(
    records: WorkspaceTreeSummarizerEntityRecord_9[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 10
   */
  public computeStageAnalytics_10(
    records: WorkspaceTreeSummarizerEntityRecord_10[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 10
   */
  public generateTrendProjection_10(
    records: WorkspaceTreeSummarizerEntityRecord_10[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 11
   */
  public computeStageAnalytics_11(
    records: WorkspaceTreeSummarizerEntityRecord_11[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 11
   */
  public generateTrendProjection_11(
    records: WorkspaceTreeSummarizerEntityRecord_11[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 12
   */
  public computeStageAnalytics_12(
    records: WorkspaceTreeSummarizerEntityRecord_12[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 12
   */
  public generateTrendProjection_12(
    records: WorkspaceTreeSummarizerEntityRecord_12[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 13
   */
  public computeStageAnalytics_13(
    records: WorkspaceTreeSummarizerEntityRecord_13[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 13
   */
  public generateTrendProjection_13(
    records: WorkspaceTreeSummarizerEntityRecord_13[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 14
   */
  public computeStageAnalytics_14(
    records: WorkspaceTreeSummarizerEntityRecord_14[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 14
   */
  public generateTrendProjection_14(
    records: WorkspaceTreeSummarizerEntityRecord_14[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 15
   */
  public computeStageAnalytics_15(
    records: WorkspaceTreeSummarizerEntityRecord_15[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 15
   */
  public generateTrendProjection_15(
    records: WorkspaceTreeSummarizerEntityRecord_15[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

  /**
   * Aggregate statistical window for metric stage 16
   */
  public computeStageAnalytics_16(
    records: WorkspaceTreeSummarizerEntityRecord_16[],
    windowMinutes: number = 60
  ): WorkspaceTreeSummarizerAnalyticsWindow {
    if (!records || records.length === 0) {
      return {
        windowDurationMinutes: windowMinutes,
        sampleCount: 0,
        arithmeticMean: 0,
        standardDeviation: 0,
        percentile95: 0,
        percentile99: 0,
        anomalyFlagsCount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    const values = records.map(r => r.scalarScore).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const idx95 = Math.floor(count * 0.95);
    const idx99 = Math.floor(count * 0.99);
    const p95 = values[Math.min(idx95, count - 1)] || 0;
    const p99 = values[Math.min(idx99, count - 1)] || 0;
    const anomalies = records.filter(r => r.executionState === 'ERROR').length;
    return {
      windowDurationMinutes: windowMinutes,
      sampleCount: count,
      arithmeticMean: Number(mean.toFixed(2)),
      standardDeviation: Number(stdDev.toFixed(2)),
      percentile95: Number(p95.toFixed(2)),
      percentile99: Number(p99.toFixed(2)),
      anomalyFlagsCount: anomalies,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Compute linear trend regression for stage 16
   */
  public generateTrendProjection_16(
    records: WorkspaceTreeSummarizerEntityRecord_16[]
  ): { slope: number; intercept: number; projectedNextValue: number } {
    if (!records || records.length < 2) {
      return { slope: 0, intercept: 0, projectedNextValue: 0 };
    }
    const n = records.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let j = 0; j < n; j++) {
      const x = j + 1;
      const y = records[j].scalarScore;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const projectedNext = slope * (n + 1) + intercept;
    return {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(2)),
      projectedNextValue: Number(projectedNext.toFixed(2)),
    };
  }

}

export const defaultWorkspaceTreeSummarizerAnalyticsEngine = new WorkspaceTreeSummarizerAnalyticsEngine();