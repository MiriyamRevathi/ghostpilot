import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  SplitSquareVertical,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
  Sparkles,
  FileCode2,
  FileJson,
  FileText,
  Lightbulb,
  Check,
  Zap,
  Save,
} from 'lucide-react';
import { ProjectFile } from '../../types/ide';
import { highlightLine } from './syntaxHighlighter';
import { predictNextLinesOfCode, MLPrediction } from '../../services/codePredictorML';

interface Props {
  activeFile: ProjectFile;
  openFilePaths: string[];
  files: Record<string, ProjectFile>;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
  onCodeChange: (path: string, newContent: string) => void;
  hasDiagnostic: boolean;
  onCursorMove: (line: number, col: number) => void;
  onFixError?: () => void;
  onSave?: () => void;
  saveToast?: { visible: boolean; fileName: string } | null;
}

export const CodeEditor: React.FC<Props> = ({
  activeFile,
  openFilePaths,
  files,
  onSelectTab,
  onCloseTab,
  onCodeChange,
  hasDiagnostic,
  onCursorMove,
  onFixError,
  onSave,
  saveToast,
}) => {
  const [cursorLine, setCursorLine] = useState(13); // Default on error line
  const [cursorCol, setCursorCol] = useState(16);
  const [hoveredError, setHoveredError] = useState(false);
  const [justFixed, setJustFixed] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<MLPrediction | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlightBackdropRef = useRef<HTMLDivElement>(null);
  const onCursorMoveRef = useRef(onCursorMove);
  onCursorMoveRef.current = onCursorMove;

  const lines = activeFile.content.split('\n');

  // Compute ML next-lines prediction based on cursor position & current typing context
  const computeMLPrediction = useCallback((content: string, pos: number) => {
    const textBefore = content.slice(0, pos);
    const splitLines = textBefore.split('\n');
    const currentLineIndex = splitLines.length - 1;
    const allLines = content.split('\n');
    const currentLineFull = allLines[currentLineIndex] || '';
    const currentColIndex = splitLines[currentLineIndex].length;
    const currentLineTyped = currentLineFull.slice(0, currentColIndex);

    const prediction = predictNextLinesOfCode(
      currentLineTyped,
      textBefore,
      currentLineIndex,
      activeFile.path,
      files
    );
    setMlPrediction(prev => {
      if (!prev && !prediction) return null;
      if (prev && prediction && prev.fullGhostText === prediction.fullGhostText) return prev;
      return prediction;
    });
  }, [activeFile.path, files]);

  // Compute cursor line & column from textarea selection
  const lastCursorRef = useRef({ line: -1, col: -1 });
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const content = activeFile.content;
    const textBefore = content.slice(0, pos);
    const splitLines = textBefore.split('\n');
    const currentLineIndex = splitLines.length - 1;
    const currentColIndex = splitLines[splitLines.length - 1].length;

    if (lastCursorRef.current.line !== currentLineIndex || lastCursorRef.current.col !== currentColIndex) {
      lastCursorRef.current = { line: currentLineIndex, col: currentColIndex };
      setCursorLine(currentLineIndex);
      setCursorCol(currentColIndex);
      if (onCursorMoveRef.current) {
        onCursorMoveRef.current(currentLineIndex + 1, currentColIndex + 1);
      }
    }

    computeMLPrediction(content, pos);
  }, [activeFile.content, computeMLPrediction]);

  // Reset ML prediction and cursor only when user switches active file path (skip on mount)
  const prevPathRef = useRef(activeFile.path);
  useEffect(() => {
    if (prevPathRef.current !== activeFile.path) {
      prevPathRef.current = activeFile.path;
      setMlPrediction(null);
      setCursorLine(0);
      setCursorCol(0);
      lastCursorRef.current = { line: 0, col: 0 };
      if (textareaRef.current) {
        textareaRef.current.selectionStart = 0;
        textareaRef.current.selectionEnd = 0;
      }
    }
  }, [activeFile.path]);

  // Sync scrolling between textarea, line numbers gutter, and highlight backdrop
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const scrollTop = textareaRef.current.scrollTop;
    const scrollLeft = textareaRef.current.scrollLeft;

    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
    if (highlightBackdropRef.current) {
      highlightBackdropRef.current.scrollTop = scrollTop;
      highlightBackdropRef.current.scrollLeft = scrollLeft;
    }
  };

  // Accept the predicted ML completion (inserts current line suffix + subsequent next lines)
  const acceptPrediction = useCallback(() => {
    if (!mlPrediction || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const pos = textarea.selectionStart;
    const currentContent = activeFile.content;

    const textToInsert = mlPrediction.fullGhostText;
    const newContent = currentContent.slice(0, pos) + textToInsert + currentContent.slice(pos);

    onCodeChange(activeFile.path, newContent);
    const newPos = pos + textToInsert.length;
    setMlPrediction(null);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        updateCursorPosition();
      }
    }, 0);
  }, [mlPrediction, activeFile.content, activeFile.path, onCodeChange, updateCursorPosition]);

  // Quick Fix Handler: executes fix on the error line (replaces user.name with user?.name)
  const handleExecuteFix = useCallback(() => {
    if (onFixError) {
      onFixError();
    } else if (activeFile.content.includes('return user.name;')) {
      const fixedContent = activeFile.content.replace('return user.name;', 'return user?.name;');
      onCodeChange(activeFile.path, fixedContent);
    }
    setJustFixed(true);
    setHoveredError(false);
    setTimeout(() => setJustFixed(false), 3500);
  }, [onFixError, activeFile.content, activeFile.path, onCodeChange]);

  // Handle keyboard inputs (Ctrl+S to save, Tab key for ML prediction/indent, Escape to dismiss)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Intercept Ctrl+S / Cmd+S (Save file)
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      if (onSave) {
        onSave();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (mlPrediction) {
        acceptPrediction();
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = activeFile.content;
      const newVal = currentVal.substring(0, start) + '    ' + currentVal.substring(end);

      onCodeChange(activeFile.path, newVal);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
          updateCursorPosition();
        }
      }, 0);
    } else if (e.key === 'Escape') {
      if (mlPrediction) {
        e.preventDefault();
        setMlPrediction(null);
      }
    }
  };

  const renderFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx')) {
      return (
        <span className="w-3.5 h-3.5 rounded-xs bg-[#3178c6]/20 text-[#3178c6] flex items-center justify-center font-bold text-[8.5px] leading-none shrink-0">
          TSX
        </span>
      );
    }
    if (fileName.endsWith('.ts')) {
      return (
        <span className="w-3.5 h-3.5 rounded-xs bg-[#3178c6]/20 text-[#3178c6] flex items-center justify-center font-bold text-[9px] leading-none shrink-0">
          TS
        </span>
      );
    }
    if (fileName.endsWith('.json')) {
      return <FileJson className="w-3.5 h-3.5 text-[#cbcb41] shrink-0" />;
    }
    if (fileName.endsWith('.md')) {
      return <FileText className="w-3.5 h-3.5 text-[#519aba] shrink-0" />;
    }
    return <FileCode2 className="w-3.5 h-3.5 text-[#9cdcfe] shrink-0" />;
  };

  // Check if a line contains the target error in UserService.ts
  const isErrorLine = (lineText: string, lineIndex: number) => {
    return (
      hasDiagnostic &&
      activeFile.path === 'src/services/UserService.ts' &&
      lineText.includes('return user.name;')
    );
  };

  return (
    <div
      id="vscode-center-editor"
      className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden select-text relative h-full"
    >
      {/* 1. Top Editor Tabs */}
      <div
        id="editor-tabs-bar"
        className="h-9 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between select-none shrink-0"
      >
        <div className="flex items-center h-full overflow-x-auto no-scrollbar">
          {openFilePaths.map(filePath => {
            const file = files[filePath];
            if (!file) return null;
            const isActive = activeFile.path === filePath;
            const hasError =
              hasDiagnostic &&
              (filePath === 'src/services/UserService.ts' || filePath === 'tests/UserService.test.ts');

            return (
              <div
                key={filePath}
                id={`tab-${filePath.replace(/[/.]/g, '-')}`}
                onClick={() => onSelectTab(filePath)}
                className={`group h-full flex items-center gap-2 px-3 border-r border-[#1e1e1e] text-[12px] cursor-pointer transition relative ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc] font-medium'
                    : 'bg-[#2d2d2d] hover:bg-[#2a2d2e] text-[#969696] hover:text-[#cccccc]'
                }`}
              >
                {renderFileIcon(file.name)}
                <span className="truncate">{file.name}</span>

                <div className="flex items-center ml-1">
                  {file.isModified ? (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (onSave && isActive) onSave();
                      }}
                      className="w-2 h-2 rounded-full bg-[#cccccc] hover:bg-white group-hover:hidden cursor-pointer transition"
                      title="Unsaved changes (Click or Ctrl+S to save)"
                    />
                  ) : hasError ? (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#f14c4c] group-hover:hidden"
                      title="1 Error"
                    />
                  ) : null}

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onCloseTab(filePath);
                    }}
                    className="p-0.5 rounded hover:bg-[#37373d] text-[#858585] hover:text-white hidden group-hover:block transition"
                    title="Close (Ctrl+W)"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Bar Actions Right with Quick Save */}
        <div className="flex items-center gap-1.5 px-2 text-[#858585]">
          {onSave && (
            <button
              id="editor-tab-save-btn"
              onClick={onSave}
              className={`h-6 flex items-center gap-1 px-2 rounded text-[11px] font-sans transition cursor-pointer ${
                activeFile.isModified
                  ? 'bg-[#007acc] hover:bg-[#0062a3] text-white font-medium shadow-sm'
                  : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
              title="Save File (Ctrl+S)"
            >
              {activeFile.isModified ? (
                <>
                  <Save className="w-3 h-3 text-white shrink-0" />
                  <span>Save</span>
                  <span className="text-[9.5px] bg-black/25 px-1 py-0.2 rounded font-mono">Ctrl+S</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Saved</span>
                </>
              )}
            </button>
          )}

          <button className="p-1 rounded hover:text-white hover:bg-[#2a2d2e]" title="Split Editor Right">
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:text-white hover:bg-[#2a2d2e]" title="More Actions...">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Breadcrumbs Bar with ML Next-Lines Status */}
      <div
        id="editor-breadcrumbs"
        className="h-7 bg-[#1e1e1e] border-b border-[#252526] px-4 flex items-center gap-1.5 text-[11px] text-[#858585] select-none shrink-0 font-sans"
      >
        <span className="hover:text-[#cccccc] cursor-pointer">my-project</span>
        {activeFile.path.split('/').map((segment, idx, arr) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span
              className={`hover:text-[#cccccc] cursor-pointer ${
                idx === arr.length - 1 ? 'text-[#cccccc] font-medium' : ''
              }`}
            >
              {segment}
            </span>
          </React.Fragment>
        ))}

        {/* Save Status pill in breadcrumb */}
        <div className="ml-2 flex items-center gap-1 text-[10.5px]">
          {activeFile.isModified ? (
            <span className="text-[#e2c08d] flex items-center gap-1 bg-[#e2c08d]/10 px-1.5 py-0.5 rounded border border-[#e2c08d]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2c08d]" />
              <span>Unsaved (Ctrl+S)</span>
            </span>
          ) : (
            <span className="text-[#858585] flex items-center gap-1 text-[10.5px]">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {/* ML Status Indicator */}
        <div className="ml-auto flex items-center gap-2">
          {mlPrediction ? (
            <div className="flex items-center gap-2 bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2 py-0.5 rounded text-[10.5px] text-[#38bdf8]">
              <Sparkles className="w-3 h-3 animate-pulse text-[#38bdf8]" />
              <span className="font-semibold">Next Lines Ready</span>
              <span className="text-[#9cdcfe] font-mono text-[10px]">
                ({Math.round(mlPrediction.confidence * 100)}% conf • {mlPrediction.latencyMs}ms)
              </span>
              <button
                onClick={acceptPrediction}
                className="bg-[#007acc] hover:bg-[#0062a3] text-white px-2 py-0.5 rounded text-[10px] font-sans font-medium flex items-center gap-1 cursor-pointer transition shadow"
              >
                <span>Accept</span>
                <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">Tab ⇥</kbd>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-[10.5px] text-[#858585]">
              <Zap className="w-3 h-3 text-[#38bdf8]" />
              <span>Local ML Autocomplete (No API keys)</span>
            </div>
          )}

          {hasDiagnostic && activeFile.path === 'src/services/UserService.ts' ? (
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] text-[#f14c4c] bg-[#f14c4c]/10 px-2 py-0.5 rounded border border-[#f14c4c]/20 font-mono">
                ts(2532): Object is possibly 'undefined'
              </span>
              <button
                id="breadcrumb-fix-btn"
                onClick={handleExecuteFix}
                className="bg-[#007acc] hover:bg-[#0062a3] active:scale-95 text-white px-2 py-0.5 rounded text-[10.5px] font-sans font-medium flex items-center gap-1 cursor-pointer transition shadow"
              >
                <Sparkles className="w-3 h-3 text-sky-200" />
                <span>Fix Error</span>
              </button>
            </div>
          ) : activeFile.path === 'src/services/UserService.ts' && activeFile.content.includes('user?.name') ? (
            <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Diagnostic resolved: user?.name</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* 3. Main Editor Code Canvas */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-[13px] leading-[21px]">
        {/* Editor Gutter: Line Numbers & Error Glyphs */}
        <div
          ref={gutterRef}
          className="w-13 bg-[#1e1e1e] border-r border-[#252526] py-3 select-none flex flex-col text-right pr-3 text-[#858585] shrink-0 overflow-hidden"
        >
          {lines.map((lineText, i) => {
            const lineNum = i + 1;
            const hasErr = isErrorLine(lineText, i);
            const isCurrent = i === cursorLine;

            return (
              <div
                key={lineNum}
                className="h-[21px] flex items-center justify-end gap-1.5 relative group"
              >
                {hasErr && (
                  <button
                    id="gutter-fix-btn"
                    onClick={handleExecuteFix}
                    title="Click to fix error: return user?.name;"
                    className="w-2.5 h-2.5 rounded-full bg-[#f14c4c] hover:bg-[#ff6b6b] flex items-center justify-center shrink-0 cursor-pointer transition hover:scale-125 shadow-sm"
                  />
                )}
                <span
                  className={`text-[12px] ${
                    hasErr
                      ? 'text-[#f14c4c] font-bold'
                      : isCurrent
                      ? 'text-[#cccccc] font-semibold'
                      : 'text-[#6e7681]'
                  }`}
                >
                  {lineNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Code Content Stack */}
        <div className="flex-1 relative overflow-hidden h-full">
          {/* Layer A: Syntax Highlighted Backdrop + Ghost Line Highlighting */}
          <div
            ref={highlightBackdropRef}
            className="absolute inset-0 py-3 px-4 overflow-hidden pointer-events-none whitespace-pre select-none font-mono text-[13px] leading-[21px]"
          >
            {lines.map((lineText, lineIdx) => {
              const hasErr = isErrorLine(lineText, lineIdx);
              const isCurrent = lineIdx === cursorLine;
              const hasCurrentLineGhost = isCurrent && mlPrediction && mlPrediction.currentLineGhost;

              return (
                <div
                  key={lineIdx}
                  className={`h-[21px] flex items-center whitespace-pre relative ${
                    isCurrent ? 'bg-[#282828]/60' : ''
                  }`}
                >
                  {hasErr ? (
                    <div className="flex items-center relative">
                      <span>{highlightLine(lineText.replace('user.name;', ''), activeFile.language)}</span>
                      {/* Red wavy underline on error token */}
                      <span
                        className="text-[#9cdcfe] font-semibold underline decoration-wavy decoration-[#f14c4c] cursor-pointer"
                        style={{ textUnderlineOffset: '3px' }}
                      >
                        user.name
                      </span>
                      <span className="text-[#cccccc]">;</span>
                    </div>
                  ) : hasCurrentLineGhost ? (
                    <div className="flex items-center">
                      <span>{highlightLine(lineText.slice(0, cursorCol), activeFile.language)}</span>
                      {/* Ghost completion text for current line */}
                      <span className="text-[#9ca3af] italic opacity-90 select-none font-mono font-medium bg-[#38bdf8]/15 px-0.5 rounded-xs border-b border-dashed border-[#38bdf8]/60">
                        {mlPrediction.currentLineGhost}
                      </span>
                      <span>{highlightLine(lineText.slice(cursorCol), activeFile.language)}</span>
                    </div>
                  ) : (
                    <span>{highlightLine(lineText, activeFile.language)}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Layer B: Interactive, Editable Textarea */}
          <textarea
            ref={textareaRef}
            id="vscode-code-textarea"
            value={activeFile.content}
            onChange={e => {
              const val = e.target.value;
              onCodeChange(activeFile.path, val);
              const pos = e.target.selectionStart;
              computeMLPrediction(val, pos);
              updateCursorPosition();
            }}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            className="absolute inset-0 py-3 px-4 w-full h-full bg-transparent text-transparent caret-white font-mono text-[13px] leading-[21px] whitespace-pre resize-none outline-none border-none overflow-auto z-10 selection:bg-[#264f78]/60"
            style={{
              tabSize: 4,
            }}
          />

          {/* Layer C: Floating Multi-Line Next Lines Suggestion Box (Colab / Copilot Style) */}
          {mlPrediction && mlPrediction.subsequentLinesGhost.length > 0 && (
            <div
              id="ml-next-lines-widget"
              style={{
                top: `${Math.min(
                  lines.length * 21 + 25,
                  Math.max(30, (cursorLine + 1) * 21 + 16)
                )}px`,
                left: '24px',
              }}
              className="absolute z-20 pointer-events-auto bg-[#181818]/95 backdrop-blur-md border border-[#38bdf8]/50 rounded-lg shadow-2xl p-3 font-mono text-[12px] leading-[20px] max-w-2xl animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2d2d2d] font-sans">
                <div className="flex items-center gap-2 text-[#38bdf8] font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ML Next Lines Prediction</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#007acc]/20 text-[#38bdf8] font-mono">
                    {mlPrediction.algorithm}
                  </span>
                  <span className="text-[10.5px] text-[#4ec9b0] font-mono font-normal">
                    {Math.round(mlPrediction.confidence * 100)}% confidence • {mlPrediction.latencyMs}ms • Offline ML
                  </span>
                </div>
                <div className="flex items-center gap-1.5 ml-4">
                  <button
                    onClick={acceptPrediction}
                    className="bg-[#007acc] hover:bg-[#0062a3] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition shadow cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Accept (Tab)</span>
                  </button>
                  <button
                    onClick={() => setMlPrediction(null)}
                    className="text-[#858585] hover:text-white px-1.5 py-1 rounded text-xs cursor-pointer"
                    title="Dismiss (Esc)"
                  >
                    <kbd className="font-mono text-[10px]">Esc</kbd>
                  </button>
                </div>
              </div>

              {/* Multi-line code preview */}
              <div className="text-[#a1a1aa] italic opacity-95 space-y-0.5 overflow-x-auto whitespace-pre bg-[#141414] p-2 rounded border border-[#2b2b2b]">
                {mlPrediction.currentLineGhost && (
                  <div className="flex items-center gap-2 text-[#e0e0e0] font-medium not-italic bg-[#38bdf8]/10 px-1 py-0.5 rounded">
                    <span className="select-none text-[#38bdf8] text-[10.5px] w-5 text-right">Line</span>
                    <span className="text-[#38bdf8]">{mlPrediction.currentLineGhost}</span>
                  </div>
                )}
                {mlPrediction.subsequentLinesGhost.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="select-none text-[#666666] text-[10.5px] w-5 text-right font-sans">
                      +{idx + 1}
                    </span>
                    <span className="text-[#9cdcfe]">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layer D: Interactive TypeScript Diagnostic Tooltip when Error is present */}
          {hasDiagnostic && activeFile.path === 'src/services/UserService.ts' && (
            <div
              id="ts-diagnostic-tooltip"
              className="absolute left-36 top-[280px] z-30 bg-[#252526] border border-[#454545] rounded-md shadow-2xl p-3 w-88 font-sans text-xs select-none"
              onMouseEnter={() => setHoveredError(true)}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[#f14c4c] font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>TypeScript Diagnostic ts(2532)</span>
                </div>
                <span className="text-[10px] text-[#858585] font-mono">StrictNullChecks</span>
              </div>
              <div className="text-[#cccccc] text-[12px] font-mono leading-relaxed bg-[#1e1e1e] p-2 rounded border border-[#333333]">
                TypeError: Cannot read properties of undefined (reading 'name')
              </div>
              <div className="text-[11px] text-[#858585] mt-2.5 pt-2 border-t border-[#3c3c3c] flex items-center justify-between gap-2 font-mono">
                <span className="text-[10.5px]">src/services/UserService.ts:14</span>
                <button
                  id="tooltip-fix-error-btn"
                  onClick={handleExecuteFix}
                  className="bg-[#007acc] hover:bg-[#0062a3] active:scale-95 text-white px-2.5 py-1 rounded text-xs font-sans font-medium flex items-center gap-1.5 cursor-pointer transition shadow hover:shadow-sky-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                  <span>Fix Error</span>
                  <span className="text-[9.5px] bg-black/30 px-1 py-0.2 rounded font-mono text-sky-200">user?.name</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Toast when fixed */}
          {justFixed && (
            <div className="absolute top-4 right-6 z-40 bg-[#1a2e22] border border-emerald-500/50 text-emerald-200 rounded-md px-3 py-2 shadow-2xl flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Fix Applied:</span>
                <span className="ml-1 text-emerald-300 font-mono">user?.name</span>
                <span className="text-emerald-400/80 text-[11px] ml-1.5">— StrictNullChecks resolved</span>
              </div>
            </div>
          )}

          {/* VS Code Style Save Toast Notification */}
          {saveToast?.visible && (
            <div
              id="vscode-save-toast"
              className="absolute bottom-6 right-6 z-50 bg-[#252526] text-white border border-[#007acc]/60 shadow-2xl rounded-md px-3.5 py-2.5 flex items-center gap-3 text-xs font-sans transition-all duration-200"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-[12px] flex items-center gap-1.5 text-white">
                  <span>File Saved</span>
                  <span className="font-mono text-[11px] text-[#38bdf8] bg-black/40 px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
                    {saveToast.fileName}
                  </span>
                </div>
                <div className="text-[10px] text-[#999999] font-mono mt-0.5 flex items-center gap-1">
                  <span>Saved via shortcut</span>
                  <kbd className="bg-[#1e1e1e] border border-[#444] px-1 py-0.2 rounded text-white text-[9.5px]">Ctrl+S</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
