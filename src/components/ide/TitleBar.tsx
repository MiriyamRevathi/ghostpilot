import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  PanelLeft,
  PanelBottom,
  Minus,
  Square,
  Copy,
  X,
  Save,
  Check,
  Home,
  Settings,
  User,
  Download,
  Upload,
} from 'lucide-react';
import { UserProfile } from '../../types/auth';

interface Props {
  activeFileName: string;
  isSidebarOpen: boolean;
  isPanelOpen: boolean;
  onToggleSidebar: () => void;
  onTogglePanel: () => void;
  isModified?: boolean;
  onSave?: () => void;
  onSaveAll?: () => void;
  onOpenLandingPage?: () => void;
  onOpenAccount?: () => void;
  onOpenSettings?: () => void;
  onDownloadZip?: () => void;
  onTriggerImport?: () => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  user?: UserProfile | null;
}

export const TitleBar: React.FC<Props> = ({
  activeFileName,
  isSidebarOpen,
  isPanelOpen,
  onToggleSidebar,
  onTogglePanel,
  isModified = false,
  onSave,
  onSaveAll,
  onOpenLandingPage,
  onOpenAccount,
  onOpenSettings,
  onDownloadZip,
  onTriggerImport,
  onMinimize,
  onToggleMaximize,
  onClose,
  isMaximized = false,
  user,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      id="vscode-titlebar"
      className="h-8.5 bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between px-2.5 text-xs text-[#cccccc] select-none shrink-0 relative z-50"
    >
      {/* Left: Window controls & Menu Bar */}
      <div className="flex items-center gap-2" ref={menuRef}>
        {/* macOS style dots */}
        <div className="flex items-center gap-1.5 pr-2">
          <button
            id="mac-close-btn"
            onClick={onClose}
            title="Close Workspace (Return to Landing Page)"
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition"
          />
          <button
            id="mac-minimize-btn"
            onClick={onMinimize}
            title="Minimize Workspace"
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition"
          />
          <button
            id="mac-maximize-btn"
            onClick={onToggleMaximize}
            title={isMaximized ? 'Restore Down' : 'Maximize Window'}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition"
          />
        </div>

        {/* VS Code Menu Items */}
        <div className="flex items-center text-[12px] text-[#cccccc]">
          {/* File Menu */}
          <div className="relative">
            <button
              id="menu-file-btn"
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded hover:bg-[#333333] cursor-pointer transition ${
                activeMenu === 'file' ? 'bg-[#37373d] text-white' : ''
              }`}
            >
              File
            </button>

            {activeMenu === 'file' && (
              <div className="absolute left-0 top-full mt-0.5 w-60 bg-[#252526] border border-[#454545] rounded shadow-2xl py-1 text-[12px] text-[#cccccc] z-50">
                <button
                  id="menu-save-btn"
                  onClick={() => {
                    if (onSave) onSave();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </span>
                  <span className="text-[11px] text-[#858585] font-mono group-hover:text-white">Ctrl+S</span>
                </button>

                <button
                  id="menu-save-all-btn"
                  onClick={() => {
                    if (onSaveAll) onSaveAll();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All</span>
                  </span>
                  <span className="text-[11px] text-[#858585] font-mono">Ctrl+K S</span>
                </button>

                <div className="my-1 border-t border-[#3c3c3c]" />

                {/* Download Workspace ZIP in Menu */}
                {onDownloadZip && (
                  <button
                    id="menu-download-zip-btn"
                    onClick={() => {
                      onDownloadZip();
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Download Workspace (.ZIP)</span>
                    </span>
                  </button>
                )}

                {/* Import ZIP or Files in Menu */}
                {onTriggerImport && (
                  <button
                    id="menu-import-files-btn"
                    onClick={() => {
                      onTriggerImport();
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Import Files / ZIP...</span>
                    </span>
                  </button>
                )}

                <div className="my-1 border-t border-[#3c3c3c]" />

                <button
                  onClick={() => {
                    if (onOpenSettings) onOpenSettings();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Preferences (Settings)</span>
                  </span>
                  <span className="text-[11px] text-[#858585] font-mono">Ctrl+,</span>
                </button>

                <button
                  onClick={() => {
                    if (onClose) onClose();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#e81123] hover:text-white cursor-pointer transition text-left text-red-300"
                >
                  <span className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5" />
                    <span>Close Workspace (Return to Landing)</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              id="menu-view-btn"
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-1 rounded hover:bg-[#333333] cursor-pointer transition ${
                activeMenu === 'view' ? 'bg-[#37373d] text-white' : ''
              }`}
            >
              View
            </button>

            {activeMenu === 'view' && (
              <div className="absolute left-0 top-full mt-0.5 w-60 bg-[#252526] border border-[#454545] rounded shadow-2xl py-1 text-[12px] text-[#cccccc] z-50">
                <button
                  onClick={() => {
                    if (onOpenLandingPage) onOpenLandingPage();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-blue-400" />
                    <span>GhostPilot Landing Page</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    onToggleSidebar();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <PanelLeft className="w-3.5 h-3.5" />
                    <span>Primary Side Bar</span>
                  </span>
                  <span className="text-[11px] text-[#858585] font-mono">Ctrl+B</span>
                </button>

                <button
                  onClick={() => {
                    onTogglePanel();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <PanelBottom className="w-3.5 h-3.5" />
                    <span>Terminal / Bottom Panel</span>
                  </span>
                  <span className="text-[11px] text-[#858585] font-mono">Ctrl+J</span>
                </button>

                <div className="my-1 border-t border-[#3c3c3c]" />

                <button
                  onClick={() => {
                    if (onOpenAccount) onOpenAccount();
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white cursor-pointer transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Account Profile / Login</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Command Palette / File Breadcrumb */}
      <div className="flex-1 max-w-md mx-4">
        <div
          onClick={onOpenLandingPage}
          className="flex items-center justify-center gap-1.5 px-3 py-1 bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] rounded text-[#858585] hover:text-[#cccccc] transition cursor-pointer text-[11px] shadow-inner"
          title="Click to view GhostPilot Landing Page"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate font-sans font-medium text-[#cccccc]">
            {activeFileName}
            {isModified ? ' •' : ''}
          </span>
          <span className="text-[#6e6e6e] font-sans">— ghostpilot-workspace</span>
        </div>
      </div>

      {/* Right: Save Shortcut, User Chip, Layout actions, and Working Window Controls */}
      <div className="flex items-center gap-1.5">
        {onSave && (
          <button
            id="titlebar-save-btn"
            onClick={onSave}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
              isModified
                ? 'bg-[#007acc] hover:bg-[#0062a3] text-white font-medium shadow-sm'
                : 'bg-[#2a2d2e] hover:bg-[#37373d] text-[#858585] hover:text-[#cccccc]'
            }`}
            title="Save File (Ctrl+S)"
          >
            {isModified ? (
              <>
                <Save className="w-3 h-3 text-white" />
                <span>Save</span>
                <span className="text-[9.5px] bg-black/20 px-1 py-0.2 rounded font-mono">Ctrl+S</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Saved</span>
              </>
            )}
          </button>
        )}

        {/* User profile quick chip */}
        {onOpenAccount && (
          <button
            id="titlebar-user-chip"
            onClick={onOpenAccount}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-[#252526] hover:bg-[#2e2e30] border border-[#333333] text-[#cccccc] hover:text-white transition cursor-pointer"
            title="Account & Login"
          >
            <span className="w-4 h-4 rounded-full bg-[#007acc] text-white text-[9.5px] font-bold flex items-center justify-center">
              {user?.initials || 'U'}
            </span>
            <span className="hidden md:inline text-[11px] font-medium max-w-[90px] truncate">
              {user?.name?.split(' ')[0] || 'Login'}
            </span>
          </button>
        )}

        {/* Toggle Sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`p-1 rounded transition cursor-pointer ${
            isSidebarOpen ? 'text-white bg-[#37373d]' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'
          }`}
          title="Toggle Primary Side Bar (Ctrl+B)"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Bottom Panel */}
        <button
          onClick={onTogglePanel}
          className={`p-1 rounded transition cursor-pointer ${
            isPanelOpen ? 'text-white bg-[#37373d]' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'
          }`}
          title="Toggle Terminal & Panel (Ctrl+J)"
        >
          <PanelBottom className="w-3.5 h-3.5" />
        </button>

        {/* WORKING WINDOW CONTROLS REQUESTED IN SCREENSHOT: | — □ ✕ */}
        <div className="flex items-center gap-1 pl-2 ml-1 border-l border-[#2b2b2b] text-[#858585]">
          {/* Minimize Button (—) */}
          <button
            id="window-minimize-btn"
            onClick={onMinimize}
            className="p-1 hover:text-white cursor-pointer hover:bg-[#2a2d2e] rounded transition flex items-center justify-center w-6 h-6"
            title="Minimize Window"
            aria-label="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>

          {/* Maximize / Restore Button (□) */}
          <button
            id="window-maximize-btn"
            onClick={onToggleMaximize}
            className="p-1 hover:text-white cursor-pointer hover:bg-[#2a2d2e] rounded transition flex items-center justify-center w-6 h-6"
            title={isMaximized ? 'Restore Down' : 'Maximize Window'}
            aria-label={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-2.5 h-2.5 rotate-180" /> : <Square className="w-2.5 h-2.5" />}
          </button>

          {/* Close Button (✕) */}
          <button
            id="window-close-btn"
            onClick={onClose}
            className="p-1 hover:text-white cursor-pointer hover:bg-[#e81123] rounded transition flex items-center justify-center w-6 h-6"
            title="Close Workspace (Return to Landing Page)"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
