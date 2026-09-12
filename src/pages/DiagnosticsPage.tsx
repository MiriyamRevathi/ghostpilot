import React, { useState } from 'react';
import { DiagnosticItem, DeveloperContext } from '../types';
import {
  Plus,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Props {
  diagnostics: DiagnosticItem[];
  context: DeveloperContext;
  onAddDiagnostic: (diag: Partial<DiagnosticItem>) => void;
  onDeleteDiagnostic: (id: string) => void;
}

export const DiagnosticsPage: React.FC<Props> = ({
  diagnostics,
  context,
  onAddDiagnostic,
  onDeleteDiagnostic,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorType, setErrorType] = useState<DiagnosticItem['type']>('TypeError');
  const [errorMessage, setErrorMessage] = useState("Cannot read properties of undefined (reading 'name')");
  const [errorLine, setErrorLine] = useState(16);
  const [errorColumn, setErrorColumn] = useState(45);
  const [errorSnippet, setErrorSnippet] = useState("return this.users.find(u => u.id === id).name;");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDiagnostic({
      type: errorType,
      message: errorMessage,
      file: context.activeFile,
      line: Number(errorLine),
      column: Number(errorColumn),
      severity: 'error',
      relatedCodeSnippet: errorSnippet,
      stackTrace: `${errorType}: ${errorMessage}\n    at ${context.activeFile}:${errorLine}:${errorColumn}`,
    });
    setShowAddModal(false);
  };

  return (
    <div id="diagnostics-page" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E0E0E6] mb-1">
            Diagnostic Processing Engine
          </h1>
          <p className="text-xs text-[#8E8E93] font-mono">
            Accepts structured LSP diagnostics, test failures, and runtime exceptions, mapping them to source lines.
          </p>
        </div>

        <button
          id="diag-inject-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Inject Diagnostic</span>
        </button>
      </div>

      {/* Preset injection shortcuts */}
      <div className="p-4 bg-[#16161A] border border-[#1F1F23] rounded-xl space-y-2.5 font-mono text-xs shadow-md">
        <div className="text-[#66666E] text-[10px] uppercase tracking-wider font-bold">
          Quick Error Injection Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onAddDiagnostic({
                type: 'TypeError',
                message: "Cannot read properties of undefined (reading 'name')",
                file: 'src/services/UserService.ts',
                line: 16,
                column: 45,
                severity: 'error',
                relatedCodeSnippet: 'return this.users.find(u => u.id === id).name;',
              })
            }
            className="px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-red-300 rounded border border-red-500/30 transition text-xs"
          >
            + TypeError (users.find undefined)
          </button>

          <button
            onClick={() =>
              onAddDiagnostic({
                type: 'TestFailure',
                message: 'AssertionError: expected service to handle missing user, but threw TypeError',
                file: 'tests/user.test.ts',
                line: 24,
                column: 12,
                severity: 'error',
                relatedCodeSnippet: "expect(() => service.getUserDisplayName('non_existent')).not.toThrow();",
              })
            }
            className="px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-orange-300 rounded border border-orange-500/30 transition text-xs"
          >
            + Test Failure (AssertionError)
          </button>

          <button
            onClick={() =>
              onAddDiagnostic({
                type: 'ReferenceError',
                message: 'userId is not defined',
                file: 'src/services/UserService.ts',
                line: 22,
                column: 10,
                severity: 'error',
                relatedCodeSnippet: 'const user = this.users.find(u => u.id === userId);',
              })
            }
            className="px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-blue-300 rounded border border-blue-500/30 transition text-xs"
          >
            + ReferenceError (undeclared identifier)
          </button>

          <button
            onClick={() =>
              onAddDiagnostic({
                type: 'SyntaxError',
                message: "Unexpected token ';', expected ')'",
                file: 'src/services/UserService.ts',
                line: 18,
                column: 32,
                severity: 'error',
                relatedCodeSnippet: 'if (id === null;',
              })
            }
            className="px-2.5 py-1 bg-[#1A1A1E] hover:bg-[#25252B] text-purple-300 rounded border border-purple-500/30 transition text-xs"
          >
            + SyntaxError (unclosed token)
          </button>
        </div>
      </div>

      {/* Diagnostics List */}
      <div className="space-y-3">
        {diagnostics.length === 0 ? (
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-8 text-center font-mono shadow-2xl">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-[#E0E0E6]">No Active Diagnostics</div>
            <p className="text-xs text-[#8E8E93] mt-1">
              All diagnostics resolved. Use the presets above to simulate developer errors.
            </p>
          </div>
        ) : (
          diagnostics.map(item => (
            <div
              key={item.id}
              className="bg-[#16161A] border border-[#1F1F23] rounded-xl p-5 font-mono text-xs space-y-3 shadow-2xl hover:border-blue-500/40 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F1F23] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 font-bold">
                    {item.type}
                  </span>
                  <span className="text-[#E0E0E6] font-semibold">{item.file}</span>
                  <span className="text-[#66666E]">
                    Line {item.line} : Col {item.column}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#66666E] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    id={`diag-delete-${item.id}`}
                    onClick={() => onDeleteDiagnostic(item.id)}
                    className="p-1 rounded text-[#8E8E93] hover:text-red-400 hover:bg-[#1F1F23] transition"
                    title="Remove diagnostic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-red-300 text-sm font-medium">{item.message}</div>
                {item.relatedCodeSnippet && (
                  <div className="p-3 bg-[#0A0A0C] rounded-lg border border-[#1F1F23] text-red-200/90 whitespace-pre font-mono mt-1">
                    {item.relatedCodeSnippet}
                  </div>
                )}
              </div>

              {item.stackTrace && (
                <details className="text-[11px] text-[#66666E]">
                  <summary className="cursor-pointer hover:text-[#8E8E93]">View Stack Trace</summary>
                  <pre className="mt-2 p-3 bg-[#0A0A0C] border border-[#1F1F23] rounded text-[#8E8E93] overflow-x-auto whitespace-pre">
                    {item.stackTrace}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal to add diagnostic */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#16161A] border border-[#1F1F23] rounded-xl max-w-lg w-full p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
              <h3 className="font-bold text-[#E0E0E6] text-sm">Inject Custom Diagnostic</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#66666E] hover:text-[#E0E0E6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[#8E8E93] mb-1">Diagnostic Type</label>
                <select
                  value={errorType}
                  onChange={e => setErrorType(e.target.value as any)}
                  className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                >
                  <option value="TypeError">TypeError</option>
                  <option value="ReferenceError">ReferenceError</option>
                  <option value="SyntaxError">SyntaxError</option>
                  <option value="TestFailure">TestFailure</option>
                  <option value="TypeScriptDiagnostic">TypeScriptDiagnostic</option>
                  <option value="PythonException">PythonException</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8E8E93] mb-1">Message</label>
                <input
                  type="text"
                  value={errorMessage}
                  onChange={e => setErrorMessage(e.target.value)}
                  className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8E93] mb-1">Line Number</label>
                  <input
                    type="number"
                    value={errorLine}
                    onChange={e => setErrorLine(Number(e.target.value))}
                    className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#8E8E93] mb-1">Column</label>
                  <input
                    type="number"
                    value={errorColumn}
                    onChange={e => setErrorColumn(Number(e.target.value))}
                    className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E8E93] mb-1">Related Code Snippet</label>
                <input
                  type="text"
                  value={errorSnippet}
                  onChange={e => setErrorSnippet(e.target.value)}
                  className="w-full bg-[#0D0D10] border border-[#1F1F23] rounded-lg p-2.5 text-[#E0E0E6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[#8E8E93] hover:text-[#E0E0E6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg"
                >
                  Inject Error
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
