import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'usersList';
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor() {
    console.log('UserService instance created:', this);

    // Load from localStorage
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const parsed: User[] = JSON.parse(stored);
        this.usersSubject.next(parsed);
        console.log('[UserService] Loaded users from localStorage:', parsed);
      } catch (e) {
        console.error('[UserService] Failed to parse saved users:', e);
      }
    }

    // Listen for changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const updated: User[] = JSON.parse(event.newValue);
          console.log('[UserService] Synced from other tab:', updated);
          this.usersSubject.next(updated);
        } catch (e) {
          console.error('[UserService] Storage sync error:', e);
        }
      }
    });
  }

  private saveToStorage(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  getUsers(): User[] {
    return [...this.usersSubject.value];
  }

  getTotalUsers(): number {
    return this.usersSubject.value.length;
  }

  getRecentUsers(count: number): User[] {
    return this.usersSubject.value.slice().reverse().slice(0, count);
  }

  getUserByUsername(username: string): User | undefined {
    return this.usersSubject.value.find(u => u.username === username);
  }

  addUser(user: User): void {
    const current = this.usersSubject.value;
    if (!current.some(u => u.username === user.username)) {
      const updated = [...current, user];
      this.usersSubject.next(updated);
      this.saveToStorage(updated);
      console.log('[UserService] Added new user:', user);
    }
  }

  updateUser(user: User): void {
    const users = [...this.usersSubject.value];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) {
      users[idx] = { ...user };
      this.usersSubject.next(users);
      this.saveToStorage(users);
      console.log('[UserService] Updated user:', user);
    }
  }

  deleteUser(userId: number): void {
    const updated = this.usersSubject.value.filter(u => u.id !== userId);
    this.usersSubject.next(updated);
    this.saveToStorage(updated);
    console.log('[UserService] Deleted user with id:', userId);
  }
}
