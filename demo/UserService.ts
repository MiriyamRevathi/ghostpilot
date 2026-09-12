export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
}

export class UserService {
  private users: User[] = [
    { id: 'usr_1', name: 'Alice Chen', email: 'alice@company.internal', role: 'admin' },
    { id: 'usr_2', name: 'Bob Martinez', email: 'bob@company.internal', role: 'developer' }
  ];

  public getUserDisplayName(id: string): string {
    // BUG DETECTED: users.find() may return undefined if user id doesn't match,
    // throwing "TypeError: Cannot read properties of undefined (reading 'name')"
    return this.users.find(u => u.id === id).name;
  }

  public findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUserRole(id: string, newRole: User['role']): boolean {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return false;
    }
    user.role = newRole;
    return true;
  }
}
