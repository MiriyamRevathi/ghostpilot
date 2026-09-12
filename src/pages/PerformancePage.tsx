import React, { useState, useEffect } from 'react';
import { LatencyBreakdown, SuggestionItem } from '../types';
import { api } from '../services/api';
import {
  Gauge,
  Database,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface Props {
  latency: LatencyBreakdown | null;
}

export const PerformancePage: React.FC<Props> = ({ latency }) => {
  const [cacheData, setCacheData] = useState<{
    entries: SuggestionItem[];
    stats: { hits: number; misses: number; evictions: number; entryCount: number; ttlSeconds: number };
  } | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const loadCache = async () => {
    try {
      const res = await api.getCache();
      setCacheData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCache();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await api.clearCache();
      await loadCache();
    } catch (e) {
      console.error(e);
    } finally {
      setIsClearing(false);
    }
  };

  const metrics = latency || {
    contextCollectionMs: 11.4,
    featureExtractionMs: 3.8,
    intentPredictionMs: 7.2,
    speculativeAnalysisMs: 245.0,
    cacheRetrievalMs: 2.1,
    totalPreparationMs: 269.5,
    timestamp: new Date().toISOString(),
  };

  return (
    <div id="performance-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Performance & Speculative Cache
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Zero-latency developer experience achieved by preparing candidate fixes in advance of user request.
          </p>
        </div>

        <button
          onClick={loadCache}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#16161A] hover:bg-[#1F1F23] text-[#E0E0E6] text-xs font-mono border border-[#1F1F23] transition shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Cache Metrics</span>
        </button>
      </div>

      {/* Latency Waterfall Card */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            <h2 className="font-mono text-sm font-bold text-[#E0E0E6]">
              Pipeline Latency Breakdown (Target: Zero-Touch &lt; 300ms)
            </h2>
          </div>
          <span className="text-xs font-mono text-green-400 font-bold">
            Total Prep: {metrics.totalPreparationMs} ms
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          <div className="bg-[#0D0D10] p-4 rounded-xl border border-[#1F1F23] shadow-sm">
            <div className="text-[#66666E] text-[10px] uppercase font-bold mb-1">Context Collection</div>
            <div className="text-lg font-bold text-[#E0E0E6]">{metrics.contextCollectionMs} ms</div>
            <div className="text-[10px] text-[#66666E] mt-1">LSP & AST extraction</div>
          </div>

          <div className="bg-[#0D0D10] p-4 rounded-xl border border-[#1F1F23] shadow-sm">
            <div className="text-[#66666E] text-[10px] uppercase font-bold mb-1">Feature Extraction</div>
            <div className="text-lg font-bold text-[#E0E0E6]">{metrics.featureExtractionMs} ms</div>
            <div className="text-[10px] text-[#66666E] mt-1">10-vector normalization</div>
          </div>

          <div className="bg-[#0D0D10] p-4 rounded-xl border border-[#1F1F23] shadow-sm">
            <div className="text-[#66666E] text-[10px] uppercase font-bold mb-1">Intent Prediction</div>
            <div className="text-lg font-bold text-blue-400">{metrics.intentPredictionMs} ms</div>
            <div className="text-[10px] text-[#66666E] mt-1">Local logistic regression</div>
          </div>

          <div className="bg-[#0D0D10] p-4 rounded-xl border border-[#1F1F23] shadow-sm">
            <div className="text-[#66666E] text-[10px] uppercase font-bold mb-1">Speculative Analysis</div>
            <div className="text-lg font-bold text-orange-400">{metrics.speculativeAnalysisMs} ms</div>
            <div className="text-[10px] text-[#66666E] mt-1">Fix & test synthesis</div>
          </div>

          <div className="bg-[#0D0D10] p-4 rounded-xl border border-[#1F1F23] shadow-sm">
            <div className="text-[#66666E] text-[10px] uppercase font-bold mb-1">Cache Retrieval</div>
            <div className="text-lg font-bold text-green-400">{metrics.cacheRetrievalMs} ms</div>
            <div className="text-[10px] text-[#66666E] mt-1">Instant hot fetch</div>
          </div>
        </div>

        {/* Visual Waterfall Bar */}
        <div className="space-y-2 font-mono text-xs pt-2">
          <div className="text-[#8E8E93] text-[11px]">Execution Timeline Waterfall:</div>
          <div className="h-3.5 w-full bg-[#0D0D10] rounded-lg overflow-hidden flex border border-[#1F1F23]">
            <div
              style={{ width: `${(metrics.contextCollectionMs / metrics.totalPreparationMs) * 100}%` }}
              className="bg-blue-600 h-full"
              title="Context Collection"
            ></div>
            <div
              style={{ width: `${(metrics.featureExtractionMs / metrics.totalPreparationMs) * 100}%` }}
              className="bg-indigo-500 h-full"
              title="Feature Extraction"
            ></div>
            <div
              style={{ width: `${(metrics.intentPredictionMs / metrics.totalPreparationMs) * 100}%` }}
              className="bg-blue-400 h-full"
              title="Intent Prediction"
            ></div>
            <div
              style={{ width: `${(metrics.speculativeAnalysisMs / metrics.totalPreparationMs) * 100}%` }}
              className="bg-orange-500 h-full"
              title="Speculative Analysis"
            ></div>
            <div
              style={{ width: `${(metrics.cacheRetrievalMs / metrics.totalPreparationMs) * 100}%` }}
              className="bg-green-500 h-full"
              title="Cache Retrieval"
            ></div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] text-[#8E8E93] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-600"></span> Context</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> Features</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-400"></span> Intent ML</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-orange-500"></span> Speculation</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-500"></span> Cache</span>
          </div>
        </div>
      </div>

      {/* Speculative Cache Inspector */}
      <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F1F23] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <h2 className="font-mono text-sm font-bold text-[#E0E0E6]">
              In-Memory Speculative Cache (LRU)
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-lg bg-[#0D0D10] border border-[#1F1F23] text-[#8E8E93]">
              Hits: <strong className="text-green-400">{cacheData?.stats.hits || 0}</strong> • Misses: <strong className="text-orange-400">{cacheData?.stats.misses || 0}</strong>
            </span>
            <button
              id="perf-clear-cache-btn"
              onClick={handleClearCache}
              disabled={isClearing}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1E] hover:bg-red-950 hover:text-red-300 text-[#8E8E93] rounded-lg border border-[#1F1F23] transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Clearing...' : 'Clear Cache'}</span>
            </button>
          </div>
        </div>

        {/* Cache Entries List */}
        <div className="space-y-2 font-mono text-xs">
          {(!cacheData?.entries || cacheData.entries.length === 0) ? (
            <div className="p-6 bg-[#0D0D10] rounded-xl text-center text-[#66666E] border border-[#1F1F23]">
              Cache currently warm but empty. Run intent prediction to generate candidate entries.
            </div>
          ) : (
            cacheData.entries.map((entry, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0D0D10] rounded-xl border border-[#1F1F23] flex flex-wrap items-center justify-between gap-3 shadow-md"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-400">{entry.intent}</span>
                    <span className="text-[#66666E]">•</span>
                    <span className="text-[#E0E0E6]">{entry.targetFile}:{entry.targetLine}</span>
                  </div>
                  <div className="text-[11px] text-[#8E8E93] truncate max-w-xl">
                    {entry.rootCause}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#8E8E93]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-[#1F1F23] text-[#8E8E93]">
                    Prepared {Math.round((entry.preparedAgoMs || 100) / 100) / 10}s ago
                  </span>
                  <span className="text-green-400 font-bold">READY</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
