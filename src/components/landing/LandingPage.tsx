import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Download,
  Upload,
  Terminal as TerminalIcon,
  ShieldCheck,
  Zap,
  Cpu,
  FileCode2,
  CheckCircle2,
  ArrowRight,
  User,
  Settings,
  AlertCircle,
  Play,
  Layers,
  Flame,
  Check,
} from 'lucide-react';
import { UserProfile } from '../../types/auth';
import { ProjectFile } from '../../types/ide';
import { downloadWorkspaceZip } from '../../services/zipService';

interface Props {
  user: UserProfile | null;
  files: Record<string, ProjectFile>;
  onLaunchEditor: (filePath?: string) => void;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
  onImportFiles?: () => void;
}

export const LandingPage: React.FC<Props> = ({
  user,
  files,
  onLaunchEditor,
  onOpenAccount,
  onOpenSettings,
  onImportFiles,
}) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleQuickDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadWorkspaceZip(files, 'ghostpilot-starter-workspace.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div
      id="ghostpilot-landing-page"
      className="flex-1 overflow-y-auto bg-[#121212] text-[#e0e0e0] font-sans selection:bg-[#007acc] selection:text-white"
    >
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[#181818]/90 backdrop-blur-md border-b border-[#2b2b2b] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#007acc] to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-[#007acc]/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base">GhostPilot</span>
              <span className="text-[10.5px] font-mono uppercase bg-[#007acc]/20 text-[#38bdf8] border border-[#007acc]/40 px-1.5 py-0.2 rounded font-semibold">
                v2.4 Local IDE
              </span>
            </div>
            <p className="text-[11px] text-[#888888] hidden sm:block">
              Zero-Cloud Speculative Coding Assistant
            </p>
          </div>
        </div>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-[#aaaaaa]">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#terminal-sync" className="hover:text-white transition">
            Terminal & ZIP Sync
          </a>
          <a href="#privacy" className="hover:text-white transition">
            Zero-Cloud Privacy
          </a>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Developer Profile / Login Button */}
          <button
            id="landing-auth-btn"
            onClick={onOpenAccount}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#252526] hover:bg-[#2f2f32] text-xs text-[#cccccc] hover:text-white border border-[#3c3c3c] transition cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#007acc] text-white flex items-center justify-center text-[10px] font-bold">
              {user?.initials || 'U'}
            </div>
            <span className="hidden sm:inline font-medium">
              {user?.isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Direct Launch IDE Button */}
          <button
            id="landing-launch-editor-btn"
            onClick={() => onLaunchEditor()}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-semibold shadow-md shadow-[#007acc]/30 transition cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Editor</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 text-center">
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero API Keys • 100% In-Browser AST Speculative Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          The Zero-Cloud AI IDE That <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Thinks Before You Type
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#999999] max-w-2xl mx-auto leading-relaxed">
          GhostPilot tracks cognitive intent, detects runtime null hazards, and speculatively prepares
          validated AST fixes in real time. Works offline, keeps your code 100% private, and exports
          directly to standard ZIP archives.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            id="hero-launch-ide-btn"
            onClick={() => onLaunchEditor()}
            className="px-6 py-3 rounded-xl bg-[#007acc] hover:bg-[#0062a3] text-white text-sm font-bold flex items-center gap-2.5 shadow-lg shadow-[#007acc]/30 transition cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Code Workspace</span>
            <span className="text-[11px] bg-black/25 px-1.5 py-0.5 rounded font-mono font-normal">
              Ctrl+E
            </span>
          </button>

          <button
            id="hero-download-zip-btn"
            onClick={handleQuickDownload}
            disabled={downloadingZip}
            className="px-5 py-3 rounded-xl bg-[#252526] hover:bg-[#2d2d30] text-white text-sm font-semibold border border-[#404040] flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Downloaded ZIP!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#38bdf8]" />
                <span>Download Workspace (.ZIP)</span>
              </>
            )}
          </button>

          {onImportFiles && (
            <button
              id="hero-import-files-btn"
              onClick={onImportFiles}
              className="px-5 py-3 rounded-xl bg-[#1e1e1e] hover:bg-[#27272a] text-[#cccccc] hover:text-white text-sm font-medium border border-[#333333] flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import Files / ZIP</span>
            </button>
          )}
        </div>

        {/* Quick Highlights Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#888888] font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No OpenAI / Gemini API Key Needed
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Client-Side TypeScript AST
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> In-Terminal ZIP Export & Import
          </span>
        </div>
      </section>

      {/* 3. Interactive Live IDE Preview Showcase */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-xl border border-[#333333] bg-[#1e1e1e] shadow-2xl overflow-hidden">
          {/* Mock Title Bar */}
          <div className="bg-[#181818] border-b border-[#2b2b2b] px-4 py-2 flex items-center justify-between text-xs text-[#888888]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[#cccccc] text-[11px]">
                UserService.ts — ghostpilot-workspace
              </span>
            </div>
            <button
              onClick={() => onLaunchEditor('src/services/UserService.ts')}
              className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 font-sans cursor-pointer"
            >
              <span>Click to open in Editor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* IDE Preview Code Block */}
          <div className="p-5 font-mono text-[12.5px] leading-relaxed text-[#d4d4d4] bg-[#1e1e1e] border-b border-[#2b2b2b]">
            <div className="text-[#6a9955]">// Live Workspace: src/services/UserService.ts</div>
            <div>
              <span className="text-[#569cd6]">export class</span>{' '}
              <span className="text-[#4ec9b0]">UserService</span> &#123;
            </div>
            <div className="pl-4 text-[#858585]">
              <span className="text-[#569cd6]">private</span> users: User[] = [...];
            </div>
            <div className="pl-4 pt-1">
              <span className="text-[#dcdcaa]">getUserDisplayName</span>(id:{' '}
              <span className="text-[#4ec9b0]">string</span>):{' '}
              <span className="text-[#4ec9b0]">string</span> &#123;
            </div>
            <div className="pl-8 text-[#858585]">
              <span className="text-[#569cd6]">const</span> user ={' '}
              <span className="text-[#569cd6]">this</span>.users.find(u =&gt; u.id === id);
            </div>
            {/* Error Line Highlight */}
            <div className="pl-8 bg-red-950/40 -mx-5 px-13 py-1 border-l-4 border-[#f14c4c] flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[#c586c0]">return</span> user
                <span className="text-[#f14c4c] underline decoration-wavy font-bold">.name</span>;
                <span className="text-[#f14c4c] text-[11px] ml-3 font-sans">
                  ts(2532): Object is possibly 'undefined'
                </span>
              </div>
              <button
                onClick={() => onLaunchEditor('src/services/UserService.ts')}
                className="bg-[#007acc] hover:bg-[#0062a3] text-white px-2.5 py-0.5 rounded text-xs font-sans font-medium flex items-center gap-1 cursor-pointer shadow"
              >
                <Sparkles className="w-3 h-3 text-sky-200" />
                <span>Fix with user?.name</span>
              </button>
            </div>
            <div className="pl-4">&#125;</div>
            <div>&#125;</div>
          </div>

          {/* Integrated Terminal Preview Card */}
          <div className="bg-[#181818] p-4 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-[#2b2b2b] text-[#888888] mb-2.5">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-sans font-semibold text-[#cccccc] uppercase text-[11px] tracking-wider">
                  Terminal & ZIP Workspace Manager
                </span>
              </div>
              <button
                onClick={handleQuickDownload}
                disabled={downloadingZip}
                className="bg-[#007acc] hover:bg-[#0062a3] text-white px-2.5 py-1 rounded text-[11px] font-sans font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Workspace (.ZIP)</span>
              </button>
            </div>
            <div className="space-y-1 text-[#cccccc]">
              <div>
                <span className="text-[#38bdf8]">ghostpilot-workspace %</span>{' '}
                <span className="text-white">zip -r ghostpilot-workspace.zip .</span>
              </div>
              <div className="text-emerald-400 pl-2">
                ✔ Compressed 6 files (UserService.ts, UserService.test.ts, package.json, tsconfig.json...)
              </div>
              <div className="text-[#888888] pl-2">
                ✔ Created ghostpilot-workspace.zip (12.8 KB). Ready for download & offline development.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#222222]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built For Serious Developers
          </h2>
          <p className="mt-3 text-sm text-[#888888]">
            Traditional cloud coding assistants leak your source code and lag on every keystroke.
            GhostPilot operates directly inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl bg-[#181818] border border-[#2b2b2b] hover:border-[#007acc]/50 transition space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#38bdf8] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Speculative Intent Pre-computation</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              When your cursor dwells on a TypeScript error or unhandled promise, GhostPilot synthesizes
              clean AST diffs in the background, making fixes instant.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl bg-[#181818] border border-[#2b2b2b] hover:border-[#007acc]/50 transition space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Zero-Cloud / Zero API Keys</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              No subscription tiers, no billing surprises, and no credentials needed. All diagnostics,
              state caching, and file operations execute locally.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl bg-[#181818] border border-[#2b2b2b] hover:border-[#007acc]/50 transition space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TerminalIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">In-Terminal ZIP Export & Import</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              Type <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300">download</code> or{' '}
              <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300">zip</code> in the
              integrated terminal, or click the toolbar button to instantly download or upload project archives.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Terminal & ZIP Sync Detailed Section */}
      <section id="terminal-sync" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#222222]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#38bdf8] mb-2">
              <Download className="w-4 h-4" />
              <span>Full Workspace Portability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Export and Import Entire Project ZIPs
            </h2>
            <p className="mt-4 text-sm text-[#999999] leading-relaxed">
              Never get locked into an in-browser sandbox. GhostPilot packages all files—including
              services, tests, configuration manifests, and documentation—into standard compressed
              ZIP files that you can clone to your local machine and run with <code className="text-cyan-300">npm test</code>.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleQuickDownload}
                disabled={downloadingZip}
                className="px-4 py-2.5 rounded-lg bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold flex items-center gap-2 shadow cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample ZIP Now</span>
              </button>

              <button
                onClick={() => onLaunchEditor()}
                className="px-4 py-2.5 rounded-lg bg-[#252526] hover:bg-[#2a2a2d] text-[#cccccc] hover:text-white text-xs font-semibold border border-[#3c3c3c] flex items-center gap-2 cursor-pointer"
              >
                <TerminalIcon className="w-4 h-4 text-cyan-400" />
                <span>Open in Terminal</span>
              </button>
            </div>
          </div>

          {/* Terminal Command Guide Card */}
          <div className="rounded-xl bg-[#161616] border border-[#2f2f2f] p-5 font-mono text-xs">
            <div className="text-[#888888] pb-3 border-b border-[#292929] flex items-center justify-between">
              <span>Terminal Command Reference</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="pt-3 space-y-3">
              <div>
                <span className="text-cyan-400 font-bold">$ download / zip</span>
                <p className="text-[#888888] text-[11.5px] mt-0.5">
                  Compresses all active workspace files and triggers automatic browser download.
                </p>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">$ import / upload</span>
                <p className="text-[#888888] text-[11.5px] mt-0.5">
                  Opens the local file selector to import individual code files or extract full ZIP archives.
                </p>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">$ npm test</span>
                <p className="text-[#888888] text-[11.5px] mt-0.5">
                  Executes Vitest suite in browser memory and verifies strict null checks.
                </p>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">$ fix</span>
                <p className="text-[#888888] text-[11.5px] mt-0.5">
                  Directly applies the speculative candidate fix to the active cursor line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Privacy & Security Callout */}
      <section id="privacy" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#222222]">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#181818] to-[#121212] border border-[#2b2b2b] text-center max-w-3xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Your Code Stays in Your Browser</h2>
          <p className="text-sm text-[#999999] leading-relaxed max-w-xl mx-auto">
            Zero network requests containing your source code are sent to any remote server.
            GhostPilot's AST analysis, intent classification, and ZIP compression run 100% locally
            via web workers and memory buffers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onLaunchEditor()}
              className="px-6 py-2.5 rounded-xl bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-[#007acc]/20 cursor-pointer transition"
            >
              <span>Launch GhostPilot Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#222222] bg-[#0d0d0d] px-6 py-8 text-center text-xs text-[#666666]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 rounded bg-[#007acc] flex items-center justify-center text-white text-[10px] font-bold">
            G
          </div>
          <span className="font-semibold text-[#888888]">GhostPilot IDE</span>
          <span>— Version 2.4.0 (Zero-Cloud Edition)</span>
        </div>
        <p>Crafted for privacy-conscious developers. All rights reserved.</p>
      </footer>
    </div>
  );
};
