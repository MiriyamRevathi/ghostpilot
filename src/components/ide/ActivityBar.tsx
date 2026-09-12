import React from 'react';
import {
  Files,
  Home,
  UserCircle2,
  Settings,
  Download,
} from 'lucide-react';
import { UserProfile } from '../../types/auth';

export type ActivityTab = 'explorer' | 'landing';

interface Props {
  activeTab: ActivityTab;
  onSelectTab: (tab: ActivityTab) => void;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
  onDownloadZip?: () => void;
  user?: UserProfile | null;
  hasFixReady?: boolean;
}

export const ActivityBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenAccount,
  onOpenSettings,
  onDownloadZip,
  user,
  hasFixReady,
}) => {
  return (
    <div
      id="vscode-activity-bar"
      className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 shrink-0 select-none z-10"
    >
      {/* Top Activity Icons */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          id="activity-bar-explorer-btn"
          onClick={() => onSelectTab('explorer')}
          title="Explorer (Ctrl+Shift+E)"
          className={`relative w-full py-2.5 flex items-center justify-center transition cursor-pointer ${
            activeTab === 'explorer'
              ? 'text-white border-l-2 border-[#007acc] bg-[#252526]/40'
              : 'text-[#858585] hover:text-white'
          }`}
        >
          <Files className="w-5 h-5" />
          {hasFixReady && (
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#181818]" />
          )}
        </button>

        {/* Landing Page Navigation */}
        <button
          id="activity-bar-landing-btn"
          onClick={() => onSelectTab('landing')}
          title="GhostPilot Landing Page & Overview"
          className={`relative w-full py-2.5 flex items-center justify-center transition cursor-pointer ${
            activeTab === 'landing'
              ? 'text-white border-l-2 border-[#007acc] bg-[#252526]/40'
              : 'text-[#858585] hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="sr-only">Landing Page</span>
        </button>

        {/* Quick ZIP Download action from activity bar */}
        {onDownloadZip && (
          <button
            id="activity-bar-zip-btn"
            onClick={onDownloadZip}
            title="Download Workspace (.ZIP)"
            className="w-full py-2.5 flex items-center justify-center text-[#858585] hover:text-[#38bdf8] transition cursor-pointer"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Icons (Requested in user screenshot) */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {/* Accounts / Login Button */}
        <button
          id="activity-bar-accounts-btn"
          onClick={onOpenAccount}
          title={user?.isAuthenticated ? `Account (${user.name})` : 'Accounts (Sign In)'}
          className="relative w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition cursor-pointer group"
        >
          {user?.isAuthenticated ? (
            <div className="w-6 h-6 rounded-full bg-[#007acc] text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-white/20 group-hover:ring-[#007acc] transition">
              {user.initials}
            </div>
          ) : (
            <UserCircle2 className="w-5 h-5" />
          )}
          {user?.isAuthenticated && (
            <span className="absolute bottom-1.5 right-2.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#181818]" />
          )}
        </button>

        {/* Manage / Settings Button */}
        <button
          id="activity-bar-settings-btn"
          onClick={onOpenSettings}
          title="Manage (Settings & Preferences)"
          className="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition cursor-pointer"
        >
          <Settings className="w-5 h-5 hover:rotate-45 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};
