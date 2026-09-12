import React, { useState } from 'react';
import {
  UserCircle2,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  LogOut,
  X,
  Code2,
  Sparkles,
  ArrowRight,
  User,
  Eye,
  EyeOff,
  Terminal,
} from 'lucide-react';
import { UserProfile } from '../../types/auth';

interface Props {
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

const DEMO_PRESETS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Revathi Miriyam',
    email: 'revathi@ghostpilot.dev',
    username: 'revathi_dev',
    role: 'Lead Full-Stack Engineer',
    initials: 'RM',
    joinedDate: 'Joined Sep 2024',
    isAuthenticated: true,
  },
  {
    id: 'usr-2',
    name: 'Alex Chen',
    email: 'alex.chen@ai-systems.io',
    username: 'alex_architect',
    role: 'Staff Systems Architect',
    initials: 'AC',
    joinedDate: 'Joined Jan 2024',
    isAuthenticated: true,
  },
  {
    id: 'usr-3',
    name: 'Guest Developer',
    email: 'guest@developer.local',
    username: 'guest_coder',
    role: 'TypeScript Developer',
    initials: 'GD',
    joinedDate: 'Joined Today',
    isAuthenticated: true,
  },
];

export const LoginPage: React.FC<Props> = ({
  currentUser,
  isOpen,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(currentUser?.isAuthenticated ? 'signin' : 'signin');
  const [emailOrUsername, setEmailOrUsername] = useState('revathi@ghostpilot.dev');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrUsername.trim()) {
      setErrorMsg('Please enter your email or username');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate instant local authentication (no external API keys required!)
    setTimeout(() => {
      setIsLoading(false);
      // Check if matches preset
      const matched = DEMO_PRESETS.find(
        p =>
          p.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          p.username.toLowerCase() === emailOrUsername.toLowerCase()
      );

      const userToSave: UserProfile = matched || {
        id: `usr-${Date.now().toString(36)}`,
        name: emailOrUsername.split('@')[0].replace('.', ' ').toUpperCase(),
        email: emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@workspace.local`,
        username: emailOrUsername.split('@')[0],
        role: 'Software Engineer',
        initials: (emailOrUsername[0] + (emailOrUsername[1] || '')).toUpperCase(),
        joinedDate: 'Joined Today',
        isAuthenticated: true,
      };

      onLogin(userToSave);
      setSuccessToast(`Welcome back, ${userToSave.name}!`);
      setTimeout(() => {
        setSuccessToast('');
        onClose();
      }, 900);
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!emailOrUsername.trim()) {
      setErrorMsg('Please enter an email address');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const nameParts = fullName.trim().split(' ');
      const initials = (nameParts[0][0] + (nameParts[1]?.[0] || nameParts[0][1] || '')).toUpperCase();

      const newUser: UserProfile = {
        id: `usr-${Date.now().toString(36)}`,
        name: fullName.trim(),
        email: emailOrUsername.trim(),
        username: fullName.toLowerCase().replace(/\s+/g, '_'),
        role: role || 'Software Engineer',
        initials,
        joinedDate: 'Joined Today',
        isAuthenticated: true,
      };

      onLogin(newUser);
      setSuccessToast(`Account created for ${newUser.name}!`);
      setTimeout(() => {
        setSuccessToast('');
        onClose();
      }, 900);
    }, 450);
  };

  const handleQuickPresetLogin = (preset: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(preset);
      setSuccessToast(`Signed in as ${preset.name}`);
      setTimeout(() => {
        setSuccessToast('');
        onClose();
      }, 700);
    }, 300);
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="login-modal-card"
        className="w-full max-w-md bg-[#1e1e1e] border border-[#3c3c3c] rounded-xl shadow-2xl overflow-hidden text-[#cccccc] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#252526] border-b border-[#333333]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#007acc]/20 border border-[#007acc]/40 flex items-center justify-center text-[#007acc]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                <span>GhostPilot Developer Identity</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  Local-First
                </span>
              </h2>
              <p className="text-[11px] text-[#858585]">100% On-Device Auth • No External API Keys Needed</p>
            </div>
          </div>
          <button
            id="close-login-btn"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#333333] text-[#858585] hover:text-white transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast Banner */}
        {successToast && (
          <div className="bg-emerald-600/90 text-white text-xs px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {currentUser?.isAuthenticated ? (
            /* Logged-In Profile View */
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-[#252526] rounded-lg border border-[#333333]">
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#007acc] to-[#38bdf8] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                  {currentUser.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white truncate">{currentUser.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#a0a0a0] truncate font-mono mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-[#007acc] mt-1 font-medium">{currentUser.role}</p>
                </div>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#181818] rounded border border-[#2b2b2b]">
                  <span className="text-[10.5px] text-[#858585] block">Workspace Session</span>
                  <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Synchronized
                  </span>
                </div>
                <div className="p-2.5 bg-[#181818] rounded border border-[#2b2b2b]">
                  <span className="text-[10.5px] text-[#858585] block">Privacy & Keys</span>
                  <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Zero-Cloud / Local
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="continue-to-editor-btn"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-[#007acc] hover:bg-[#0062a3] text-white rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow"
                >
                  <span>Return to Code Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="sign-out-btn"
                  onClick={() => {
                    onLogout();
                    setAuthMode('signin');
                  }}
                  className="w-full py-2 px-4 bg-[#2b2b2b] hover:bg-[#383838] text-[#cccccc] hover:text-white rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition border border-[#3c3c3c]"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Sign Out of IDE</span>
                </button>
              </div>

              {/* Switch Account Quick Presets */}
              <div className="pt-2 border-t border-[#333333]">
                <p className="text-[11px] text-[#858585] mb-2 font-medium">Switch to another local profile:</p>
                <div className="flex gap-2">
                  {DEMO_PRESETS.filter(p => p.id !== currentUser.id).map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleQuickPresetLogin(preset)}
                      className="flex-1 p-2 bg-[#252526] hover:bg-[#2e2e30] border border-[#333333] hover:border-[#007acc] rounded text-left transition cursor-pointer"
                    >
                      <div className="text-xs text-white font-medium truncate">{preset.name}</div>
                      <div className="text-[10px] text-[#858585] truncate">{preset.role.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Auth Form (Sign In / Sign Up) */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex bg-[#252526] p-0.5 rounded-lg border border-[#333333]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-[#007acc] text-white shadow'
                      : 'text-[#858585] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded transition cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-[#007acc] text-white shadow'
                      : 'text-[#858585] hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 bg-red-500/15 border border-red-500/40 rounded text-red-300 text-xs flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#a0a0a0] mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Revathi Miriyam"
                        className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 pl-8.5 text-xs text-white placeholder-[#606060] outline-none transition"
                      />
                      <User className="w-3.5 h-3.5 text-[#858585] absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-[#a0a0a0] mb-1">
                    {authMode === 'signin' ? 'Email or Username' : 'Work Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={e => setEmailOrUsername(e.target.value)}
                      placeholder={authMode === 'signin' ? 'revathi@ghostpilot.dev' : 'you@company.com'}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 pl-8.5 text-xs text-white placeholder-[#606060] outline-none transition"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#858585] absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#a0a0a0] mb-1">Engineering Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 text-xs text-white outline-none transition"
                    >
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                      <option value="AI / ML Engineer">AI / ML Engineer</option>
                      <option value="DevOps / Architect">DevOps / Architect</option>
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-[#a0a0a0]">Password</label>
                    {authMode === 'signin' && (
                      <span className="text-[10px] text-[#007acc] hover:underline cursor-pointer">
                        Local Demo Password
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#181818] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 pl-8.5 pr-8.5 text-xs text-white placeholder-[#606060] outline-none transition font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-[#858585] absolute left-2.5 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#858585] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-[#3c3c3c] bg-[#181818] text-[#007acc] focus:ring-0"
                    />
                    <span className="text-[11px] text-[#858585]">Remember in this browser</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="submit-auth-btn"
                  className="w-full py-2.5 bg-[#007acc] hover:bg-[#0062a3] disabled:bg-[#007acc]/50 text-white rounded font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create Local Developer Account'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Fast 1-Click Demo Logins */}
              <div className="pt-3 border-t border-[#333333]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-medium text-[#858585] uppercase tracking-wider">
                    Or One-Click Demo Profiles
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">No API Keys</span>
                </div>
                <div className="space-y-1.5">
                  {DEMO_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleQuickPresetLogin(preset)}
                      className="w-full flex items-center justify-between p-2 rounded bg-[#252526] hover:bg-[#2c2c2e] hover:border-[#007acc] border border-[#333333] transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#007acc]/20 text-[#38bdf8] flex items-center justify-center text-[10.5px] font-bold">
                          {preset.initials}
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium group-hover:text-[#38bdf8] transition">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-[#858585]">{preset.role}</div>
                        </div>
                      </div>
                      <span className="text-[10.5px] text-[#007acc] font-medium group-hover:translate-x-0.5 transition">
                        Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-5 py-2.5 bg-[#181818] border-t border-[#2b2b2b] text-[10.5px] text-[#858585] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            Zero external servers or telemetry
          </span>
          <span className="font-mono text-[10px]">v2.4 Local Auth</span>
        </div>
      </div>
    </div>
  );
};
