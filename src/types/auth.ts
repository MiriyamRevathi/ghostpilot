export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  joinedDate: string;
  isAuthenticated: boolean;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: 'dark-modern' | 'vscode-dark' | 'github-dark' | 'dracula';
  wordWrap: 'on' | 'off';
  minimap: boolean;
  autoSave: 'off' | 'afterDelay' | 'onFocusChange';
  ghostPilotEnabled: boolean;
  ghostPilotConfidenceThreshold: number;
  soundEffects: boolean;
}
