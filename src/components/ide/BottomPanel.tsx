import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  AlertCircle,
  Bug,
  Plus,
  Trash2,
  ChevronDown,
  X,
  RotateCcw,
  SplitSquareVertical,
  CheckCircle2,
  Download,
  Upload,
  FolderArchive,
  Play,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { ProjectFile } from '../../types/ide';
import { downloadWorkspaceZip, importFilesOrZip } from '../../services/zipService';

export type PanelTab = 'problems' | 'output' | 'debug' | 'terminal';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

interface Props {
  hasDiagnostic: boolean;
  isFixApplied: boolean;
  onResetDemo: () => void;
  onClosePanel: () => void;
  files: Record<string, ProjectFile>;
  onImportFiles?: (imported: Record<string, ProjectFile>) => void;
  onFixError?: () => void;
}

export const BottomPanel: React.FC<Props> = ({
  hasDiagnostic,
  isFixApplied,
  onResetDemo,
  onClosePanel,
  files,
  onImportFiles,
  onFixError,
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Terminal command history
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'info',
      text: 'GhostPilot Terminal v2.4.0 (browser-isolated execution)',
    },
    {
      id: 'init-2',
      type: 'info',
      text: 'Type "download" or "zip" to download workspace ZIP. Type "import" or click Upload to import files/ZIP.',
    },
    {
      id: 'init-3',
      type: 'input',
      text: 'npm test',
    },
    {
      id: 'init-4',
      type: hasDiagnostic && !isFixApplied ? 'error' : 'success',
      text:
        hasDiagnostic && !isFixApplied
          ? 'FAIL tests/user.test.ts > UserService > getUserDisplayName (TypeError: Cannot read properties of undefined reading "name")'
          : 'PASS tests/user.test.ts > 3 passed (96ms)',
    },
  ]);

  // Keep terminal scrolled to bottom when history changes
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Handle ZIP Download
  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const timestamp = new Date().toLocaleTimeString();
      setHistory(prev => [
        ...prev,
        { id: `dl-cmd-${Date.now()}`, type: 'input', text: 'zip -r ghostpilot-workspace.zip .' },
        {
          id: `dl-1-${Date.now()}`,
          type: 'info',
          text: `[${timestamp}] ⚡ Packing ${Object.keys(files).length} files into compressed ZIP...`,
        },
      ]);

      const result = await downloadWorkspaceZip(files);

      const sizeKb = (result.sizeBytes / 1024).toFixed(1);
      setHistory(prev => [
        ...prev,
        {
          id: `dl-2-${Date.now()}`,
          type: 'success',
          text: `✔ Successfully generated "${result.fileName}" (${sizeKb} KB) with ${result.fileCount} files.`,
        },
        {
          id: `dl-3-${Date.now()}`,
          type: 'info',
          text: `⬇ Browser download initiated automatically.`,
        },
      ]);

      setStatusNotification(`Downloaded ${result.fileName} (${sizeKb} KB)`);
      setTimeout(() => setStatusNotification(null), 4000);
    } catch (err) {
      console.error(err);
      setHistory(prev => [
        ...prev,
        {
          id: `dl-err-${Date.now()}`,
          type: 'error',
          text: `✖ Error compressing workspace: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger file input
  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  // Handle uploaded ZIP or files
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    try {
      setIsImporting(true);
      const timestamp = new Date().toLocaleTimeString();
      setHistory(prev => [
        ...prev,
        {
          id: `imp-1-${Date.now()}`,
          type: 'input',
          text: `import ${uploaded[0].name}`,
        },
        {
          id: `imp-2-${Date.now()}`,
          type: 'info',
          text: `[${timestamp}] ⚡ Unpacking and parsing selected file(s)...`,
        },
      ]);

      const result = await importFilesOrZip(uploaded);

      if (result.success && onImportFiles) {
        onImportFiles(result.importedFiles);
        setHistory(prev => [
          ...prev,
          {
            id: `imp-3-${Date.now()}`,
            type: 'success',
            text: `✔ Successfully imported ${result.count} file(s) into workspace:`,
          },
          ...result.fileNames.slice(0, 5).map((fn, idx) => ({
            id: `imp-fn-${Date.now()}-${idx}`,
            type: 'info' as const,
            text: `   • ${fn}`,
          })),
        ]);
        setStatusNotification(`Imported ${result.count} file(s) into workspace`);
        setTimeout(() => setStatusNotification(null), 4000);
      } else {
        setHistory(prev => [
          ...prev,
          {
            id: `imp-warn-${Date.now()}`,
            type: 'error',
            text: '✖ No valid code or text files could be parsed.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setHistory(prev => [
        ...prev,
        {
          id: `imp-err-${Date.now()}`,
          type: 'error',
          text: `✖ Import failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Execute terminal command
  const handleExecuteCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory: TerminalLine[] = [
      ...history,
      { id: `cmd-${Date.now()}`, type: 'input', text: trimmed },
    ];

    const lower = trimmed.toLowerCase();

    if (lower === 'download' || lower === 'zip' || lower === 'export' || lower === 'npm run export') {
      setHistory(newHistory);
      setTerminalInput('');
      handleDownloadZip();
      return;
    }

    if (lower === 'import' || lower === 'upload') {
      setHistory(newHistory);
      setTerminalInput('');
      handleTriggerImport();
      return;
    }

    if (lower === 'clear' || lower === 'cls') {
      setHistory([
        {
          id: `clear-${Date.now()}`,
          type: 'info',
          text: 'Terminal cleared. Type "help" for available commands.',
        },
      ]);
      setTerminalInput('');
      return;
    }

    if (lower === 'npm test' || lower === 'test' || lower === 'vitest') {
      if (hasDiagnostic && !isFixApplied) {
        newHistory.push({
          id: `res-${Date.now()}-1`,
          type: 'error',
          text: 'FAIL tests/user.test.ts > UserService > getUserDisplayName',
        });
        newHistory.push({
          id: `res-${Date.now()}-2`,
          type: 'error',
          text: '  TypeError: Cannot read properties of undefined (reading "name") at src/services/UserService.ts:16',
        });
        newHistory.push({
          id: `res-${Date.now()}-3`,
          type: 'info',
          text: '💡 GhostPilot Speculative Engine: fix available ("user?.name"). Click Quick Fix or type "fix".',
        });
      } else {
        newHistory.push({
          id: `res-${Date.now()}-1`,
          type: 'success',
          text: 'PASS tests/user.test.ts',
        });
        newHistory.push({
          id: `res-${Date.now()}-2`,
          type: 'success',
          text: '  ✓ 3 tests passed (88ms). All TypeScript typechecks valid.',
        });
      }
    } else if (lower === 'fix') {
      if (onFixError) {
        onFixError();
        newHistory.push({
          id: `res-${Date.now()}`,
          type: 'success',
          text: '✔ Applied safe optional chaining fix to UserService.ts (user?.name). Diagnostic resolved.',
        });
      }
    } else if (lower === 'ls') {
      const fileList = Object.keys(files);
      newHistory.push({
        id: `ls-${Date.now()}`,
        type: 'info',
        text: fileList.map(f => `${f} (${files[f].content.length} B)`).join('    '),
      });
    } else if (lower.startsWith('cat ')) {
      const target = trimmed.slice(4).trim();
      const matched = files[target] || Object.values(files).find((f: ProjectFile) => f.name === target);
      if (matched) {
        newHistory.push({
          id: `cat-${Date.now()}`,
          type: 'info',
          text: matched.content,
        });
      } else {
        newHistory.push({
          id: `cat-err-${Date.now()}`,
          type: 'error',
          text: `cat: ${target}: No such file in workspace`,
        });
      }
    } else if (lower === 'help') {
      newHistory.push({
        id: `help-${Date.now()}`,
        type: 'info',
        text: 'Available Commands:\n  • download / zip       - Package and download workspace as a ZIP archive\n  • import / upload     - Import code files or extract a ZIP into workspace\n  • npm test / test     - Run Vitest suite on UserService\n  • fix                 - Apply GhostPilot safe optional chaining fix\n  • ls                  - List all files in the virtual workspace\n  • cat <file>          - Print file content to terminal\n  • clear               - Clear terminal output',
      });
    } else {
      newHistory.push({
        id: `unk-${Date.now()}`,
        type: 'error',
        text: `zsh: command not found: ${trimmed}. Type "help" or "download" for options.`,
      });
    }

    setHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <div
      id="vscode-bottom-panel"
      className="h-60 bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col shrink-0 select-text overflow-hidden"
    >
      {/* Hidden File Input for ZIP or code files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".zip,.ts,.tsx,.js,.jsx,.json,.md,.css,.html"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Panel Tab Header */}
      <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] px-3 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center h-full gap-4 text-[11px] uppercase tracking-wider font-semibold">
          {/* Terminal Tab */}
          <button
            onClick={() => setActiveTab('terminal')}
            className={`h-full flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'terminal'
                ? 'text-white border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc] border-transparent'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => setActiveTab('problems')}
            className={`h-full flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'problems'
                ? 'text-white border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc] border-transparent'
            }`}
          >
            <span>Problems</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                hasDiagnostic && !isFixApplied ? 'bg-[#f14c4c] text-white' : 'bg-[#3c3c3c] text-[#858585]'
              }`}
            >
              {hasDiagnostic && !isFixApplied ? 1 : 0}
            </span>
          </button>

          {/* Output Tab */}
          <button
            onClick={() => setActiveTab('output')}
            className={`h-full flex items-center gap-1 border-b-2 transition cursor-pointer ${
              activeTab === 'output'
                ? 'text-white border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc] border-transparent'
            }`}
          >
            <span>Output</span>
          </button>

          {/* Debug Console Tab */}
          <button
            onClick={() => setActiveTab('debug')}
            className={`h-full flex items-center gap-1 border-b-2 transition cursor-pointer ${
              activeTab === 'debug'
                ? 'text-white border-[#007acc]'
                : 'text-[#858585] hover:text-[#cccccc] border-transparent'
            }`}
          >
            <span>Debug Console</span>
          </button>
        </div>

        {/* Action Controls Right: Prominent Download ZIP & Import Buttons */}
        <div className="flex items-center gap-1.5 text-[#858585] text-xs">
          {/* Status Toast inside toolbar */}
          {statusNotification && (
            <span className="hidden sm:flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-[11px] px-2 py-0.5 rounded font-mono animate-pulse">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{statusNotification}</span>
            </span>
          )}

          {/* DOWNLOAD WORKSPACE ZIP BUTTON */}
          <button
            id="terminal-download-zip-btn"
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white px-2.5 py-1 rounded text-[11px] font-medium font-sans transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Download workspace files as a ZIP archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-semibold">Download ZIP</span>
          </button>

          {/* IMPORT ZIP OR FILES BUTTON */}
          <button
            id="terminal-import-btn"
            onClick={handleTriggerImport}
            disabled={isImporting}
            className="flex items-center gap-1.5 bg-[#2a2d2e] hover:bg-[#37373d] text-[#cccccc] hover:text-white px-2.5 py-1 rounded text-[11px] font-sans border border-[#3c3c3c] transition cursor-pointer active:scale-95 disabled:opacity-50"
            title="Import code files or extract a ZIP archive into the workspace"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import</span>
          </button>

          {/* RE-RUN TESTS BUTTON */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2a2d2e] hover:text-white transition text-[11px] text-[#858585] cursor-pointer"
            title="Re-run tests / Reset error scenario"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Re-run</span>
          </button>

          {/* CLEAR TERMINAL BUTTON */}
          <button
            onClick={() => handleExecuteCommand('clear')}
            className="p-1 rounded hover:bg-[#2a2d2e] hover:text-white cursor-pointer"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* CLOSE PANEL */}
          <button
            onClick={onClosePanel}
            className="p-1 rounded hover:bg-[#2a2d2e] hover:text-white ml-1 cursor-pointer"
            title="Close Panel (Ctrl+J)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-2.5 overflow-auto font-mono text-xs text-[#cccccc] bg-[#1e1e1e]">
        {/* TERMINAL TAB */}
        {activeTab === 'terminal' && (
          <div className="flex flex-col h-full justify-between">
            {/* Command History */}
            <div className="space-y-1 leading-relaxed overflow-y-auto flex-1 pr-1 font-mono text-[12px]">
              {history.map(line => {
                if (line.type === 'input') {
                  return (
                    <div key={line.id} className="text-[#858585] flex items-center gap-2">
                      <span className="text-[#38bdf8] font-bold">ghostpilot-workspace %</span>
                      <span className="text-white font-medium">{line.text}</span>
                    </div>
                  );
                }
                if (line.type === 'error') {
                  return (
                    <div key={line.id} className="text-[#f14c4c] whitespace-pre-wrap pl-2 bg-[#f14c4c]/10 py-1 rounded">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'success') {
                  return (
                    <div key={line.id} className="text-[#4ec9b0] whitespace-pre-wrap pl-2 bg-[#4ec9b0]/10 py-1 rounded">
                      {line.text}
                    </div>
                  );
                }
                return (
                  <div key={line.id} className="text-[#9cdcfe] whitespace-pre-wrap pl-2">
                    {line.text}
                  </div>
                );
              })}
              <div ref={terminalBottomRef} />
            </div>

            {/* Interactive Terminal Input Prompt */}
            <div className="pt-2 border-t border-[#2e2e2e] flex items-center gap-2 font-mono text-[12px] shrink-0">
              <span className="text-[#38bdf8] font-semibold shrink-0">ghostpilot-workspace %</span>
              <input
                id="terminal-command-input"
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleExecuteCommand(terminalInput);
                  }
                }}
                placeholder="Type 'download' or 'zip' to export ZIP, 'import' to upload, 'npm test', 'ls', or 'help'..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-[#555555]"
              />
              <button
                onClick={() => handleExecuteCommand(terminalInput)}
                className="text-[11px] bg-[#2a2d2e] hover:bg-[#333333] px-2 py-0.5 rounded text-[#cccccc] hover:text-white cursor-pointer"
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* PROBLEMS TAB */}
        {activeTab === 'problems' && (
          <div>
            {hasDiagnostic && !isFixApplied ? (
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center gap-2 font-semibold text-[#cccccc]">
                  <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
                  <span>UserService.ts</span>
                  <span className="text-[#858585] font-mono text-[11px]">src/services</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#f14c4c]/20 text-[#f14c4c] text-[10px] font-mono font-bold">
                    1
                  </span>
                </div>
                <div
                  onClick={() => {
                    if (onFixError) onFixError();
                  }}
                  className="pl-6 flex items-start gap-2 text-xs hover:bg-[#2a2d2e] py-1.5 px-2 rounded cursor-pointer group"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-[#f14c4c] text-white flex items-center justify-center font-bold text-[8px] mt-0.5 shrink-0">
                    ✕
                  </span>
                  <div className="flex-1">
                    <span className="text-[#cccccc] group-hover:text-white">
                      Object is possibly 'undefined'.
                    </span>
                    <span className="text-[#858585] font-mono text-[11px] ml-2">[16, 47] ts(2532)</span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (onFixError) onFixError();
                    }}
                    className="bg-[#007acc] hover:bg-[#0062a3] text-white px-2 py-0.5 rounded text-[11px] font-sans font-medium opacity-0 group-hover:opacity-100 transition"
                  >
                    Quick Fix (user?.name)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[#858585] font-sans py-4 text-center">
                No problems have been detected in the workspace.
              </div>
            )}
          </div>
        )}

        {/* OUTPUT TAB */}
        {activeTab === 'output' && (
          <div className="space-y-1 text-[#858585] text-[11.5px]">
            <div className="text-[#cccccc] mb-1 font-semibold">[GhostPilot Language Server & Speculative Engine]</div>
            <div>[04:22:10] Initialized AST language index for TypeScript 5.8.2.</div>
            <div>[04:22:11] Monitored telemetry stream: 18 WPM, 4.2s pause, 3 backspaces on line 16.</div>
            <div>[04:22:11] LSP Diagnostic received: ts(2532) Object is possibly 'undefined'.</div>
            <div>[04:22:11] Inferred intent: DEBUG_ERROR with 92% confidence.</div>
            <div className="text-[#38bdf8]">
              [04:22:11] Speculative candidate fix synthesized. Optional chaining ready.
            </div>
            {isFixApplied && (
              <div className="text-[#4ec9b0]">[04:22:15] Speculative fix applied. Codebase patched.</div>
            )}
          </div>
        )}

        {/* DEBUG CONSOLE TAB */}
        {activeTab === 'debug' && (
          <div className="text-[#858585] font-sans text-xs">
            Debugging session idle. Use Run & Debug to launch node process.
          </div>
        )}
      </div>
    </div>
  );
};
