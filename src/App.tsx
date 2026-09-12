import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TitleBar } from './components/ide/TitleBar';
import { ActivityBar, ActivityTab } from './components/ide/ActivityBar';
import { FileExplorer } from './components/ide/FileExplorer';
import { CodeEditor } from './components/ide/CodeEditor';
import { BottomPanel } from './components/ide/BottomPanel';
import { GhostPilotAgentStatus } from './components/ide/GhostPilotAgentStatus';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SettingsModal } from './components/settings/SettingsModal';
import { INITIAL_FILES } from './data/defaultWorkspace';
import { ProjectFile, GhostPilotAgentState } from './types/ide';
import { UserProfile, EditorSettings } from './types/auth';
import { downloadWorkspaceZip, importFilesOrZip } from './services/zipService';
import { Maximize2, Code2, ArrowUpRight } from 'lucide-react';

export default function App() {
  // 1. User Authentication (Zero-Cloud Local Storage, No API Keys)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ghostpilot_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      id: 'usr-1',
      name: 'Revathi Miriyam',
      email: 'revathi@ghostpilot.dev',
      username: 'revathi_dev',
      role: 'Lead Full-Stack Engineer',
      initials: 'RM',
      joinedDate: 'Joined Sep 2024',
      isAuthenticated: true,
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 2. Settings State
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem('ghostpilot_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fontSize: 13,
      tabSize: 2,
      theme: 'dark-modern',
      wordWrap: 'on',
      minimap: true,
      autoSave: 'off',
      ghostPilotEnabled: true,
      ghostPilotConfidenceThreshold: 85,
      soundEffects: false,
    };
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // 3. Files & Project State
  const [files, setFiles] = useState<Record<string, ProjectFile>>(INITIAL_FILES);
  const [activeFilePath, setActiveFilePath] = useState('src/services/UserService.ts');
  const [openFilePaths, setOpenFilePaths] = useState<string[]>([
    'src/services/UserService.ts',
    'tests/UserService.test.ts',
    'src/components/Header.tsx',
  ]);
  const [saveToast, setSaveToast] = useState<{ visible: boolean; fileName: string } | null>(null);

  // 4. UI Panes & Views State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Terminal Bottom Panel
  const [activeActivityTab, setActiveActivityTab] = useState<ActivityTab>('explorer');

  // Window State for Title Bar Controls (—, □, ✕)
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // 5. Error Diagnostic State
  const [hasDiagnostic, setHasDiagnostic] = useState(true);

  // 6. GhostPilot Agent Telemetry State
  const [agentState, setAgentState] = useState<GhostPilotAgentState>({
    status: 'Monitoring coding context',
    intent: 'DEBUG_ERROR',
    confidence: 92,
    speculativeAnalysis: 'READY',
    activeFile: 'UserService.ts',
    cursorLine: 14,
    cursorCol: 21,
    dwellTimeSeconds: 4.2,
    backspaceCount: 3,
    recentSignals: ['Cursor dwell > 3s on null dereference', 'Diagnostic ts(2532) detected'],
  });

  const globalFileInputRef = useRef<HTMLInputElement>(null);

  // Persist user changes to localStorage (strictly local, zero external calls)
  const handleLogin = useCallback((newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('ghostpilot_user', JSON.stringify(newUser));
    } catch (e) {}
  }, []);

  const handleLogout = useCallback(() => {
    const loggedOutUser: UserProfile = {
      id: 'guest',
      name: 'Guest Developer',
      email: 'guest@developer.local',
      username: 'guest',
      role: 'Developer',
      initials: 'GD',
      joinedDate: 'Joined Today',
      isAuthenticated: false,
    };
    setUser(loggedOutUser);
    try {
      localStorage.setItem('ghostpilot_user', JSON.stringify(loggedOutUser));
    } catch (e) {}
  }, []);

  const handleSaveSettings = useCallback((newSettings: EditorSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('ghostpilot_settings', JSON.stringify(newSettings));
    } catch (e) {}
  }, []);

  // Keep dwell time lively when in UserService.ts around error line
  useEffect(() => {
    if (!hasDiagnostic) return;
    const timer = setInterval(() => {
      setAgentState(prev => {
        if (prev.activeFile === 'UserService.ts' && hasDiagnostic) {
          const nextDwell = Math.min(12, +(prev.dwellTimeSeconds + 0.5).toFixed(1));
          if (prev.dwellTimeSeconds === nextDwell) return prev;
          return { ...prev, dwellTimeSeconds: nextDwell };
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [hasDiagnostic]);

  // File Selection
  const handleSelectFile = useCallback((path: string) => {
    setActiveFilePath(path);
    setOpenFilePaths(prev => (prev.includes(path) ? prev : [...prev, path]));
    setActiveActivityTab('explorer');
    const fileName = path.split('/').pop() || '';
    setAgentState(prev => ({
      ...prev,
      activeFile: fileName,
      status:
        path === 'src/services/UserService.ts' && hasDiagnostic
          ? 'Monitoring coding context'
          : 'Observing AST structure',
    }));
  }, [hasDiagnostic]);

  // Tab Close
  const handleCloseTab = useCallback((path: string) => {
    setOpenFilePaths(prev => {
      const nextTabs = prev.filter(p => p !== path);
      if (activeFilePath === path && nextTabs.length > 0) {
        setActiveFilePath(nextTabs[0]);
      }
      return nextTabs;
    });
  }, [activeFilePath]);

  // Code Editing Handler
  const handleCodeChange = useCallback((path: string, newContent: string) => {
    setFiles(prev => {
      const current = prev[path];
      if (!current || current.content === newContent) return prev;
      return {
        ...prev,
        [path]: {
          ...current,
          content: newContent,
          isModified: newContent !== current.initialContent,
        },
      };
    });

    // Real-time local AST/syntax diagnostic check for UserService.ts
    if (path === 'src/services/UserService.ts') {
      if (newContent.includes('return user.name;')) {
        setHasDiagnostic(true);
        setAgentState(prev => ({
          ...prev,
          intent: 'DEBUG_ERROR',
          confidence: 92,
          speculativeAnalysis: 'READY',
          status: 'Monitoring coding context',
        }));
      } else if (newContent.includes('return user?.name;')) {
        setHasDiagnostic(false);
        setAgentState(prev => ({
          ...prev,
          speculativeAnalysis: 'VALIDATED',
          status: 'Code validated',
        }));
      }
    }
  }, []);

  // Cursor Move Observer with guard against redundant renders
  const handleCursorMove = useCallback((line: number, col: number) => {
    setAgentState(prev => {
      if (prev.cursorLine === line && prev.cursorCol === col) {
        return prev;
      }
      const isAroundError =
        activeFilePath === 'src/services/UserService.ts' && Math.abs(line - 14) <= 2;
      const nextIntent = isAroundError && hasDiagnostic ? 'DEBUG_ERROR' : prev.intent;
      const nextConfidence = isAroundError && hasDiagnostic ? 92 : prev.confidence;
      if (
        prev.cursorLine === line &&
        prev.cursorCol === col &&
        prev.intent === nextIntent &&
        prev.confidence === nextConfidence
      ) {
        return prev;
      }
      return {
        ...prev,
        cursorLine: line,
        cursorCol: col,
        intent: nextIntent,
        confidence: nextConfidence,
      };
    });
  }, [activeFilePath, hasDiagnostic]);

  // Quick Fix for Null Dereference
  const handleQuickFix = useCallback(() => {
    setFiles(prev => {
      const current = prev['src/services/UserService.ts'];
      if (!current) return prev;
      const fixedContent = current.content.replace('return user.name;', 'return user?.name;');
      return {
        ...prev,
        'src/services/UserService.ts': {
          ...current,
          content: fixedContent,
          isModified: true,
        },
      };
    });

    setHasDiagnostic(false);
    setAgentState(prev => ({
      ...prev,
      intent: 'REFACTOR_CODE',
      confidence: 98,
      speculativeAnalysis: 'VALIDATED',
      status: 'Applied safe optional chaining (user?.name)',
      dwellTimeSeconds: 0.5,
    }));
  }, []);

  // Reset Error for demonstration
  const handleResetError = useCallback(() => {
    setFiles(prev => {
      const current = prev['src/services/UserService.ts'];
      if (!current) return prev;
      const brokenContent = current.content.replace('return user?.name;', 'return user.name;');
      return {
        ...prev,
        'src/services/UserService.ts': {
          ...current,
          content: brokenContent,
          isModified: false,
        },
      };
    });

    setHasDiagnostic(true);
    setAgentState(prev => ({
      ...prev,
      intent: 'DEBUG_ERROR',
      confidence: 92,
      speculativeAnalysis: 'READY',
      status: 'Re-evaluating AST diagnostic in UserService.ts',
      dwellTimeSeconds: 3.5,
    }));
  }, []);

  // Save current active file
  const handleSaveFile = useCallback((pathToSave?: string) => {
    const targetPath = pathToSave || activeFilePath;
    setFiles(prev => {
      const current = prev[targetPath];
      if (!current) return prev;
      return {
        ...prev,
        [targetPath]: {
          ...current,
          initialContent: current.content,
          isModified: false,
        },
      };
    });

    const fileName = targetPath.split('/').pop() || targetPath;
    setSaveToast({ visible: true, fileName });
    setTimeout(() => {
      setSaveToast(prev => (prev?.fileName === fileName ? { ...prev, visible: false } : prev));
    }, 2000);
  }, [activeFilePath]);

  // Save all open files
  const handleSaveAll = useCallback(() => {
    setFiles(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(p => {
        updated[p] = {
          ...updated[p],
          initialContent: updated[p].content,
          isModified: false,
        };
      });
      return updated;
    });

    setSaveToast({ visible: true, fileName: 'All Files' });
    setTimeout(() => {
      setSaveToast(prev => (prev?.fileName === 'All Files' ? { ...prev, visible: false } : prev));
    }, 2200);
  }, []);

  // Download entire workspace as ZIP
  const handleDownloadWorkspaceZip = useCallback(async () => {
    await downloadWorkspaceZip(files);
  }, [files]);

  // Import files into workspace (from input or ZIP)
  const handleImportFiles = useCallback((imported: Record<string, ProjectFile>) => {
    setFiles(prev => ({
      ...prev,
      ...imported,
    }));

    const firstImportedPath = Object.keys(imported)[0];
    if (firstImportedPath) {
      setActiveFilePath(firstImportedPath);
      setOpenFilePaths(prev =>
        prev.includes(firstImportedPath) ? prev : [...prev, firstImportedPath]
      );
    }
    setActiveActivityTab('explorer');
    setIsMinimized(false);
  }, []);

  // Global file input change handler
  const handleGlobalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    const result = await importFilesOrZip(uploaded);
    if (result.success) {
      handleImportFiles(result.importedFiles);
    }
    if (globalFileInputRef.current) globalFileInputRef.current.value = '';
  };

  // Window Controls Handlers: —, □, ✕
  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleToggleMaximize = useCallback(() => {
    setIsMaximized(prev => {
      const next = !prev;
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      return next;
    });
  }, []);

  const handleCloseWorkspace = useCallback(() => {
    // Closing the workspace returns the user directly to the Landing Page!
    setActiveActivityTab('landing');
    setIsMinimized(false);
  }, []);

  // Global keyboard shortcuts (Ctrl+S, Ctrl+B, Ctrl+J, Ctrl+E)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          e.stopPropagation();
          handleSaveFile();
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setIsSidebarOpen(prev => !prev);
        } else if (e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          setIsPanelOpen(prev => !prev);
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setActiveActivityTab(prev => (prev === 'landing' ? 'explorer' : 'landing'));
          setIsMinimized(false);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, [handleSaveFile]);

  const activeFile = files[activeFilePath] || files['src/services/UserService.ts'];

  const handleSaveActiveFile = useCallback(() => {
    handleSaveFile(activeFilePath);
  }, [handleSaveFile, activeFilePath]);

  const handleOpenLandingPage = useCallback(() => {
    setActiveActivityTab('landing');
    setIsMinimized(false);
  }, []);

  const handleOpenEditor = useCallback((filePath?: string) => {
    if (filePath) {
      handleSelectFile(filePath);
    }
    setActiveActivityTab('explorer');
    setIsMinimized(false);
  }, [handleSelectFile]);

  return (
    <div
      id="vscode-root"
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#1e1e1e] text-[#cccccc] font-sans antialiased select-none"
    >
      {/* Hidden file input for file/zip imports */}
      <input
        ref={globalFileInputRef}
        type="file"
        multiple
        accept=".zip,.ts,.tsx,.js,.jsx,.json,.md,.css,.html"
        onChange={handleGlobalFileChange}
        className="hidden"
      />

      {/* 1. TOP WINDOW TITLE BAR WITH WORKING WINDOW CONTROLS (—, □, ✕) */}
      <TitleBar
        activeFileName={
          activeActivityTab === 'landing' ? '✨ GhostPilot Landing Page' : activeFile.name
        }
        isSidebarOpen={isSidebarOpen}
        isPanelOpen={isPanelOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
        isModified={activeFile.isModified}
        onSave={handleSaveActiveFile}
        onSaveAll={handleSaveAll}
        onOpenLandingPage={handleOpenLandingPage}
        onOpenAccount={() => setIsAuthModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onDownloadZip={handleDownloadWorkspaceZip}
        onTriggerImport={() => globalFileInputRef.current?.click()}
        onMinimize={handleMinimize}
        onToggleMaximize={handleToggleMaximize}
        onClose={handleCloseWorkspace}
        isMaximized={isMaximized}
        user={user}
      />

      {/* MINIMIZED STATE OVERLAY: When user clicks '—' */}
      {isMinimized ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#121212] p-6">
          <div className="bg-[#1e1e1e] border border-[#333333] shadow-2xl rounded-2xl p-6 max-w-md w-full text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#38bdf8] mx-auto flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="text-base font-bold text-white">GhostPilot Workspace Minimized</h2>
              </div>
              <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                Your editor session, active code, and background diagnostics are active and waiting.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                id="restore-minimized-btn"
                onClick={() => setIsMinimized(false)}
                className="flex-1 py-2.5 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Restore Workspace</span>
              </button>
              <button
                onClick={() => {
                  setIsMinimized(false);
                  setActiveActivityTab('landing');
                }}
                className="px-4 py-2.5 bg-[#252526] hover:bg-[#2d2d30] text-[#cccccc] hover:text-white text-xs rounded-xl transition cursor-pointer border border-[#3c3c3c]"
              >
                Landing Page
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. MAIN WORKSPACE OR LANDING PAGE */
        <div className="flex-1 flex overflow-hidden">
          {/* Dynamic View: Landing Page OR Code Editor */}
          {activeActivityTab === 'landing' ? (
            /* LANDING PAGE (Replaced Dashboard as requested) */
            <LandingPage
              user={user}
              files={files}
              onLaunchEditor={handleOpenEditor}
              onOpenAccount={() => setIsAuthModalOpen(true)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onImportFiles={() => globalFileInputRef.current?.click()}
            />
          ) : (
            /* CODE EDITOR WORKSPACE */
            <>
              {/* Activity Bar */}
              <ActivityBar
                activeTab={activeActivityTab}
                onSelectTab={tab => {
                  if (tab === 'landing') {
                    setActiveActivityTab('landing');
                  } else {
                    if (activeActivityTab === tab && isSidebarOpen) {
                      setIsSidebarOpen(false);
                    } else {
                      setActiveActivityTab(tab);
                      setIsSidebarOpen(true);
                    }
                  }
                }}
                onOpenAccount={() => setIsAuthModalOpen(true)}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                onDownloadZip={handleDownloadWorkspaceZip}
                user={user}
                hasFixReady={hasDiagnostic}
              />

              {/* LEFT — PROJECT / FILE EXPLORER */}
              {isSidebarOpen && (
                <FileExplorer
                  activeFilePath={activeFilePath}
                  files={files}
                  onSelectFile={handleSelectFile}
                  hasDiagnostic={hasDiagnostic}
                />
              )}

              {/* CENTER — CODE EDITOR + INTEGRATED TERMINAL BOTTOM PANEL */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
                {/* Editor Surface */}
                <div className="flex-1 overflow-hidden relative">
                  <CodeEditor
                    activeFile={activeFile}
                    openFilePaths={openFilePaths}
                    files={files}
                    onSelectTab={handleSelectFile}
                    onCloseTab={handleCloseTab}
                    onCodeChange={handleCodeChange}
                    hasDiagnostic={hasDiagnostic}
                    onCursorMove={handleCursorMove}
                    onFixError={handleQuickFix}
                    onSave={handleSaveActiveFile}
                    saveToast={saveToast}
                  />
                </div>

                {/* BOTTOM TERMINAL PANEL WITH ZIP DOWNLOAD & IMPORT */}
                {isPanelOpen && (
                  <BottomPanel
                    hasDiagnostic={hasDiagnostic}
                    isFixApplied={!hasDiagnostic}
                    onResetDemo={handleResetError}
                    onClosePanel={() => setIsPanelOpen(false)}
                    files={files}
                    onImportFiles={handleImportFiles}
                    onFixError={handleQuickFix}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. BOTTOM — GHOSTPILOT AGENT STATUS */}
      {!isMinimized && (
        <GhostPilotAgentStatus
          agentState={agentState}
          hasDiagnostic={hasDiagnostic}
          isFixApplied={!hasDiagnostic}
          onFixError={handleQuickFix}
          onResetError={handleResetError}
          isModified={activeFile.isModified}
          onSave={handleSaveActiveFile}
        />
      )}

      {/* 4. MODALS: LOGIN & SETTINGS */}
      <LoginPage
        currentUser={user}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onOpenLandingPage={() => {
          setIsSettingsModalOpen(false);
          handleOpenLandingPage();
        }}
        onOpenAccount={() => {
          setIsSettingsModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
