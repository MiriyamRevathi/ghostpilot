import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
  MoreHorizontal,
  FilePlus2,
  FolderPlus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ProjectFile } from '../../types/ide';

interface Props {
  activeFilePath: string;
  files: Record<string, ProjectFile>;
  onSelectFile: (path: string) => void;
  hasDiagnostic: boolean;
}

export const FileExplorer: React.FC<Props> = ({
  activeFilePath,
  files,
  onSelectFile,
  hasDiagnostic,
}) => {
  const [isRootOpen, setIsRootOpen] = useState(true);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    'src/components': true,
    'src/services': true,
    tests: true,
  });

  const toggleFolder = (folderKey: string) => {
    setOpenFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
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

  const renderFileItem = (path: string, fileName: string, depthClass: string) => {
    const file = files[path];
    const isSelected = activeFilePath === path;
    const isErrorTarget = hasDiagnostic && (path === 'src/services/UserService.ts' || path === 'tests/UserService.test.ts');
    const isModified = file?.isModified;

    return (
      <div
        key={path}
        id={`file-${path.replace(/[/.]/g, '-')}`}
        onClick={() => onSelectFile(path)}
        className={`flex items-center justify-between ${depthClass} pr-3 py-1 cursor-pointer transition select-none group text-[12px] ${
          isSelected
            ? 'bg-[#37373d] text-white font-medium'
            : 'hover:bg-[#2a2d2e] text-[#cccccc]'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {renderFileIcon(fileName)}
          <span className="truncate">{fileName}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isModified && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#e2c08d]"
              title="Unsaved changes"
            />
          )}
          {isErrorTarget && (
            <span
              className="w-2 h-2 rounded-full bg-[#f14c4c]"
              title="1 Error Diagnostic"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="vscode-file-explorer"
      className="w-60 bg-[#181818] border-r border-[#2b2b2b] flex flex-col shrink-0 select-none text-[13px] text-[#cccccc] h-full overflow-hidden"
    >
      {/* Explorer Top Header */}
      <div className="h-9 px-3 flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase border-b border-transparent">
        <span>EXPLORER</span>
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => onSelectFile('src/services/UserService.ts')}
            className="p-1 hover:text-white rounded hover:bg-[#2a2d2e]"
            title="Focus UserService.ts"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded hover:bg-[#2a2d2e]" title="More Actions...">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Workspace Project Tree */}
      <div className="flex-1 overflow-y-auto font-mono text-[12px]">
        {/* Root Directory: my-project */}
        <div
          onClick={() => setIsRootOpen(!isRootOpen)}
          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-[#bbbbbb] tracking-wide uppercase hover:bg-[#2a2d2e] cursor-pointer"
        >
          {isRootOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />
          )}
          <span>MY-PROJECT</span>
        </div>

        {isRootOpen && (
          <div className="flex flex-col">
            {/* src/ folder */}
            <div>
              <div
                onClick={() => toggleFolder('src')}
                className="flex items-center gap-1.5 px-3 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
              >
                {openFolders['src'] ? (
                  <ChevronDown className="w-3 h-3 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#858585]" />
                )}
                {openFolders['src'] ? (
                  <FolderOpen className="w-3.5 h-3.5 text-[#dcb67a]" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-[#dcb67a]" />
                )}
                <span>src</span>
              </div>

              {openFolders['src'] && (
                <div className="flex flex-col">
                  {/* src/components/ folder */}
                  <div>
                    <div
                      onClick={() => toggleFolder('src/components')}
                      className="flex items-center gap-1.5 pl-6 pr-3 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
                    >
                      {openFolders['src/components'] ? (
                        <ChevronDown className="w-3 h-3 text-[#858585]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-[#858585]" />
                      )}
                      {openFolders['src/components'] ? (
                        <FolderOpen className="w-3.5 h-3.5 text-[#dcb67a]" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-[#dcb67a]" />
                      )}
                      <span>components</span>
                    </div>

                    {openFolders['src/components'] && (
                      <div className="flex flex-col">
                        {renderFileItem('src/components/Header.tsx', 'Header.tsx', 'pl-10')}
                        {renderFileItem('src/components/Login.tsx', 'Login.tsx', 'pl-10')}
                      </div>
                    )}
                  </div>

                  {/* src/services/ folder */}
                  <div>
                    <div
                      onClick={() => toggleFolder('src/services')}
                      className="flex items-center gap-1.5 pl-6 pr-3 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
                    >
                      {openFolders['src/services'] ? (
                        <ChevronDown className="w-3 h-3 text-[#858585]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-[#858585]" />
                      )}
                      {openFolders['src/services'] ? (
                        <FolderOpen className="w-3.5 h-3.5 text-[#dcb67a]" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-[#dcb67a]" />
                      )}
                      <span>services</span>
                    </div>

                    {openFolders['src/services'] && (
                      <div className="flex flex-col">
                        {renderFileItem('src/services/UserService.ts', 'UserService.ts', 'pl-10')}
                      </div>
                    )}
                  </div>

                  {/* src/App.tsx */}
                  {renderFileItem('src/App.tsx', 'App.tsx', 'pl-6')}
                </div>
              )}
            </div>

            {/* tests/ folder */}
            <div>
              <div
                onClick={() => toggleFolder('tests')}
                className="flex items-center gap-1.5 px-3 py-1 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
              >
                {openFolders['tests'] ? (
                  <ChevronDown className="w-3 h-3 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#858585]" />
                )}
                {openFolders['tests'] ? (
                  <FolderOpen className="w-3.5 h-3.5 text-[#dcb67a]" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-[#dcb67a]" />
                )}
                <span>tests</span>
              </div>

              {openFolders['tests'] && (
                <div className="flex flex-col">
                  {renderFileItem('tests/UserService.test.ts', 'UserService.test.ts', 'pl-8')}
                </div>
              )}
            </div>

            {/* Root files */}
            {renderFileItem('package.json', 'package.json', 'pl-5')}
            {renderFileItem('README.md', 'README.md', 'pl-5')}
          </div>
        )}
      </div>

      {/* Explorer Bottom GhostPilot Watcher Indicator */}
      <div className="p-2 border-t border-[#2b2b2b] bg-[#181818] flex items-center justify-between text-[11px] text-[#858585]">
        <div className="flex items-center gap-1.5 text-[#38bdf8]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold text-xs">GhostPilot</span>
        </div>
        <span className="text-[10px] text-[#858585] font-mono">
          {hasDiagnostic ? 'Fix Ready' : 'Watching'}
        </span>
      </div>
    </div>
  );
};
