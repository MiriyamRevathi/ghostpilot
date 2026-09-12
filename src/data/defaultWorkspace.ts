import { ProjectFile, FileTreeNode } from '../types/ide';

export const INITIAL_USER_SERVICE_CODE = `export class UserService {
    private users = [
        { id: 'usr_1', name: 'Alice Chen', role: 'admin' },
        { id: 'usr_2', name: 'Bob Martinez', role: 'developer' }
    ];

    getUser(id: string) {
        const user = this.users.find(
            u => u.id === id
        );

        return user.name;
    }

    deleteUser(id: string) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.users.splice(index, 1);
        return true;
    }

}
`;

export const INITIAL_FILES: Record<string, ProjectFile> = {
  'src/services/UserService.ts': {
    path: 'src/services/UserService.ts',
    name: 'UserService.ts',
    extension: 'ts',
    content: INITIAL_USER_SERVICE_CODE,
    initialContent: INITIAL_USER_SERVICE_CODE,
    isModified: false,
    language: 'typescript',
  },
  'src/components/Header.tsx': {
    path: 'src/components/Header.tsx',
    name: 'Header.tsx',
    extension: 'tsx',
    content: `import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="px-6 py-4 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="font-semibold text-white tracking-wide">Workspace Console</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Live Session
                </span>
            </div>
            <div className="text-xs text-[#858585]">
                Node.js v20.12.0
            </div>
        </header>
    );
};
`,
    initialContent: `import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="px-6 py-4 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="font-semibold text-white tracking-wide">Workspace Console</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Live Session
                </span>
            </div>
            <div className="text-xs text-[#858585]">
                Node.js v20.12.0
            </div>
        </header>
    );
};
`,
    isModified: false,
    language: 'tsx',
  },
  'src/components/Login.tsx': {
    path: 'src/components/Login.tsx',
    name: 'Login.tsx',
    extension: 'tsx',
    content: `import React, { useState } from 'react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        console.log('Authenticating user:', email);
    };

    return (
        <div className="p-6 max-w-sm rounded bg-[#252526] border border-[#333333]">
            <h2 className="text-sm font-semibold text-white mb-4">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-white text-xs"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-medium"
                >
                    {status === 'submitting' ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};
`,
    initialContent: `import React, { useState } from 'react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        console.log('Authenticating user:', email);
    };

    return (
        <div className="p-6 max-w-sm rounded bg-[#252526] border border-[#333333]">
            <h2 className="text-sm font-semibold text-white mb-4">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-white text-xs"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-medium"
                >
                    {status === 'submitting' ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};
`,
    isModified: false,
    language: 'tsx',
  },
  'src/App.tsx': {
    path: 'src/App.tsx',
    name: 'App.tsx',
    extension: 'tsx',
    content: `import React from 'react';
import { Header } from './components/Header';
import { Login } from './components/Login';

export function App() {
    return (
        <div className="min-h-screen bg-[#181818] text-[#cccccc] font-sans">
            <Header />
            <main className="p-8 flex justify-center">
                <Login />
            </main>
        </div>
    );
}
`,
    initialContent: `import React from 'react';
import { Header } from './components/Header';
import { Login } from './components/Login';

export function App() {
    return (
        <div className="min-h-screen bg-[#181818] text-[#cccccc] font-sans">
            <Header />
            <main className="p-8 flex justify-center">
                <Login />
            </main>
        </div>
    );
}
`,
    isModified: false,
    language: 'tsx',
  },
  'tests/UserService.test.ts': {
    path: 'tests/UserService.test.ts',
    name: 'UserService.test.ts',
    extension: 'ts',
    content: `import { UserService } from '../src/services/UserService';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
    });

    it('returns user name for existing id', () => {
        expect(service.getUser('usr_1')).toBe('Alice Chen');
    });

    it('handles non-existent user safely without throwing', () => {
        // When user is not found, .name access causes TypeError
        expect(() => service.getUser('usr_999')).not.toThrow();
    });
});
`,
    initialContent: `import { UserService } from '../src/services/UserService';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
    });

    it('returns user name for existing id', () => {
        expect(service.getUser('usr_1')).toBe('Alice Chen');
    });

    it('handles non-existent user safely without throwing', () => {
        // When user is not found, .name access causes TypeError
        expect(() => service.getUser('usr_999')).not.toThrow();
    });
});
`,
    isModified: false,
    language: 'typescript',
  },
  'package.json': {
    path: 'package.json',
    name: 'package.json',
    extension: 'json',
    content: `{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "jest": "^29.7.0"
  }
}
`,
    initialContent: `{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "jest": "^29.7.0"
  }
}
`,
    isModified: false,
    language: 'json',
  },
  'README.md': {
    path: 'README.md',
    name: 'README.md',
    extension: 'md',
    content: `# my-project

Core application workspace.

### Running Tests
\`\`\`bash
npm test
\`\`\`

### GhostPilot Speculative Intent
GhostPilot monitors your active edits and local diagnostics. When debugging an unhandled null dereference or TypeError in \`UserService.ts\`, GhostPilot automatically pre-computes speculative patches without requiring prompt typing.
`,
    initialContent: `# my-project

Core application workspace.

### Running Tests
\`\`\`bash
npm test
\`\`\`

### GhostPilot Speculative Intent
GhostPilot monitors your active edits and local diagnostics. When debugging an unhandled null dereference or TypeError in \`UserService.ts\`, GhostPilot automatically pre-computes speculative patches without requiring prompt typing.
`,
    isModified: false,
    language: 'markdown',
  },
};

export const INITIAL_FILE_TREE: FileTreeNode = {
  name: 'my-project',
  path: '',
  type: 'directory',
  isExpanded: true,
  children: [
    {
      name: 'src',
      path: 'src',
      type: 'directory',
      isExpanded: true,
      children: [
        {
          name: 'components',
          path: 'src/components',
          type: 'directory',
          isExpanded: true,
          children: [
            { name: 'Header.tsx', path: 'src/components/Header.tsx', type: 'file' },
            { name: 'Login.tsx', path: 'src/components/Login.tsx', type: 'file' },
          ],
        },
        {
          name: 'services',
          path: 'src/services',
          type: 'directory',
          isExpanded: true,
          children: [
            { name: 'UserService.ts', path: 'src/services/UserService.ts', type: 'file' },
          ],
        },
        { name: 'App.tsx', path: 'src/App.tsx', type: 'file' },
      ],
    },
    {
      name: 'tests',
      path: 'tests',
      type: 'directory',
      isExpanded: true,
      children: [
        { name: 'UserService.test.ts', path: 'tests/UserService.test.ts', type: 'file' },
      ],
    },
    { name: 'package.json', path: 'package.json', type: 'file' },
    { name: 'README.md', path: 'README.md', type: 'file' },
  ],
};
