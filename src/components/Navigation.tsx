import React from 'react';
import {
  LayoutDashboard,
  Code,
  BrainCircuit,
  Lightbulb,
  FileCode2,
  AlertTriangle,
  Eye,
  Gauge,
  Activity,
  Settings,
  X
} from 'lucide-react';

export type NavTabId =
  | 'overview'
  | 'live_context'
  | 'intent_prediction'
  | 'suggestions'
  | 'code_analyzer'
  | 'diagnostics'
  | 'behavioral_signals'
  | 'gaze_tracking'
  | 'performance'
  | 'settings';

interface Props {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  diagnosticCount?: number;
  suggestionsCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  diagnosticCount = 0,
  suggestionsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const sections = [
    {
      category: 'Intelligence',
      items: [
        { id: 'overview' as NavTabId, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, symbol: '⬡' },
        { id: 'live_context' as NavTabId, label: 'Live Context', icon: <Code className="w-4 h-4" />, symbol: '⌇' },
        { id: 'intent_prediction' as NavTabId, label: 'Intent Engine', icon: <BrainCircuit className="w-4 h-4" />, symbol: '◈' },
        {
          id: 'suggestions' as NavTabId,
          label: 'Suggestions',
          icon: <Lightbulb className="w-4 h-4" />,
          symbol: '✧',
          badge: suggestionsCount > 0 ? suggestionsCount : undefined,
        },
      ],
    },
    {
      category: 'Analysis',
      items: [
        { id: 'code_analyzer' as NavTabId, label: 'Code Analyzer', icon: <FileCode2 className="w-4 h-4" />, symbol: '⊞' },
        {
          id: 'diagnostics' as NavTabId,
          label: 'Diagnostics',
          icon: <AlertTriangle className="w-4 h-4" />,
          symbol: '⚠',
          badge: diagnosticCount > 0 ? diagnosticCount : undefined,
        },
        { id: 'gaze_tracking' as NavTabId, label: 'Gaze Tracking', icon: <Eye className="w-4 h-4" />, symbol: '👁' },
        { id: 'performance' as NavTabId, label: 'Performance', icon: <Gauge className="w-4 h-4" />, symbol: '⚡' },
      ],
    },
    {
      category: 'Telemetry & Settings',
      items: [
        { id: 'behavioral_signals' as NavTabId, label: 'Behavioral Signals', icon: <Activity className="w-4 h-4" />, symbol: '≈' },
        { id: 'settings' as NavTabId, label: 'Settings & Privacy', icon: <Settings className="w-4 h-4" />, symbol: '⚙' },
      ],
    },
  ];

  const navContent = (
    <div className="flex flex-col h-full bg-[#111114]">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#1F1F23]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <span className="font-bold tracking-tight text-lg text-[#E0E0E6]">GhostPilot</span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-[#8E8E93] hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 overflow-y-auto space-y-5">
        {sections.map(sec => (
          <div key={sec.category}>
            <div className="px-6 text-[10px] uppercase tracking-widest text-[#66666E] font-semibold mb-2">
              {sec.category}
            </div>
            <div className="px-4 space-y-1">
              {sec.items.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full px-4 py-2 rounded-md flex items-center justify-between transition-colors text-xs font-medium ${
                      isActive
                        ? 'bg-[#1F1F23] text-white border border-[#1F1F23]'
                        : 'text-[#8E8E93] hover:text-[#E0E0E6] hover:bg-[#1A1A1E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={isActive ? 'text-blue-400 font-bold' : 'text-[#66666E]'}>
                        {item.symbol}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                          item.id === 'diagnostics'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-6 border-t border-[#1F1F23] bg-[#0D0D10]">
        <div className="flex items-center justify-between text-[11px] text-[#66666E] font-mono">
          <span>System v1.0.0</span>
          <span className="text-green-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <nav
        id="ghostpilot-sidebar-nav"
        className="hidden md:flex w-60 lg:w-64 bg-[#111114] border-r border-[#1F1F23] flex-col shrink-0 min-h-screen sticky top-0 h-screen overflow-hidden"
      >
        {navContent}
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-xs flex-1 flex flex-col bg-[#111114] border-r border-[#1F1F23]">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

