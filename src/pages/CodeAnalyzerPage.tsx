import React, { useState, useEffect } from 'react';
import { ASTAnalysisResult, DeveloperContext } from '../types';
import { api } from '../services/api';
import {
  Boxes,
  FunctionSquare,
  Package,
  AlertOctagon,
  RefreshCw,
  Code
} from 'lucide-react';

interface Props {
  context: DeveloperContext;
}

export const CodeAnalyzerPage: React.FC<Props> = ({ context }) => {
  const [code, setCode] = useState(context.sourceCode);
  const [language, setLanguage] = useState(context.language || 'TypeScript');
  const [analysis, setAnalysis] = useState<ASTAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async (c = code, lang = language) => {
    setIsLoading(true);
    try {
      const res = await api.analyzeCode(c, lang);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(context.sourceCode, context.language);
  }, [context.sourceCode, context.language]);

  return (
    <div id="code-analyzer-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">Local AST Code Analyzer</h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Multi-language semantic and syntax parsing for JavaScript, TypeScript, and Python without cloud APIs.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            id="analyzer-language-select"
            value={language}
            onChange={e => {
              setLanguage(e.target.value);
              runAnalysis(code, e.target.value);
            }}
            className="bg-[#0D0D10] border border-[#1F1F23] rounded-lg px-3 py-1.5 text-[#E0E0E6] focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>

          <button
            id="analyzer-parse-btn"
            onClick={() => runAnalysis()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg active:scale-95 transition shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Parsing...' : 'Re-Parse AST'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Functions</div>
          <div className="text-base font-bold text-blue-400">
            {analysis?.functions.length || 0}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Classes</div>
          <div className="text-base font-bold text-blue-300">
            {analysis?.classes.length || 0}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Imports</div>
          <div className="text-base font-bold text-purple-400">
            {analysis?.imports.length || 0}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Conditions</div>
          <div className="text-base font-bold text-orange-400">
            {analysis?.conditionsCount || 0}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Returns</div>
          <div className="text-base font-bold text-[#E0E0E6]">
            {analysis?.returnStatementsCount || 0}
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-3.5 shadow-md">
          <div className="text-[#66666E] uppercase font-bold text-[10px] mb-1">Complexity</div>
          <div className="text-base font-bold text-red-400">
            {analysis?.estimatedComplexity || 1.0}
          </div>
        </div>
      </div>

      {/* Main Split: Code Input vs Extracted AST Symbols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Source Buffer */}
        <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1F1F23] border-b border-[#1F1F23] text-xs font-mono text-[#E0E0E6]">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span>Source Buffer ({language})</span>
            </div>
            <span className="text-[11px] text-[#66666E]">Live Editable</span>
          </div>

          <textarea
            id="analyzer-code-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full flex-1 min-h-[360px] p-4 bg-[#0A0A0C] font-mono text-xs text-[#E0E0E6] resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 leading-relaxed"
            placeholder="Paste or write code here..."
          />
        </div>

        {/* Right: Extracted AST Nodes */}
        <div className="space-y-4">
          {/* Syntax Errors if any */}
          {analysis?.syntaxErrors && analysis.syntaxErrors.length > 0 && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl font-mono text-xs space-y-2">
              <div className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>Grammar & Bracket Issues Detected</span>
              </div>
              <ul className="list-disc list-inside text-red-200 text-[11px] space-y-1">
                {analysis.syntaxErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Functions & Classes */}
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F1F23] text-[#E0E0E6] font-bold">
              <FunctionSquare className="w-4 h-4 text-blue-400" />
              <span>Declared Functions & Methods ({analysis?.functions.length || 0})</span>
            </div>
            <div className="space-y-1.5">
              {analysis?.functions.map((fn, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D10] border border-[#1F1F23]"
                >
                  <span className="text-blue-300 font-semibold">
                    {fn.name}({fn.params.join(', ')})
                  </span>
                  <span className="text-[10px] text-[#66666E]">Line {fn.line}</span>
                </div>
              ))}
              {(!analysis?.functions || analysis.functions.length === 0) && (
                <div className="text-[#66666E] text-xs py-2">No top-level functions found.</div>
              )}
            </div>
          </div>

          {/* Classes */}
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F1F23] text-[#E0E0E6] font-bold">
              <Boxes className="w-4 h-4 text-blue-300" />
              <span>Classes ({analysis?.classes.length || 0})</span>
            </div>
            <div className="space-y-1.5">
              {analysis?.classes.map((cls, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D10] border border-[#1F1F23]"
                >
                  <span className="text-blue-200 font-semibold">class {cls.name}</span>
                  <span className="text-[10px] text-[#66666E]">Line {cls.line}</span>
                </div>
              ))}
              {(!analysis?.classes || analysis.classes.length === 0) && (
                <div className="text-[#66666E] text-xs py-2">No class declarations found.</div>
              )}
            </div>
          </div>

          {/* Imports & External Dependencies */}
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F1F23] text-[#E0E0E6] font-bold">
              <Package className="w-4 h-4 text-purple-400" />
              <span>Module Imports ({analysis?.imports.length || 0})</span>
            </div>
            <div className="space-y-1.5">
              {analysis?.imports.map((imp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D10] border border-[#1F1F23]"
                >
                  <span className="text-purple-300 font-semibold">{imp.source}</span>
                  <span className="text-[10px] text-[#66666E]">{imp.specifiers.join(', ')}</span>
                </div>
              ))}
              {(!analysis?.imports || analysis.imports.length === 0) && (
                <div className="text-[#66666E] text-xs py-2">No imports declared.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
