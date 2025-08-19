import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService, User } from './user';

export interface AuthUser {
  username: string;
  role: 'admin' | 'user' | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser>({ username: '', role: null });
  currentUser$: Observable<AuthUser> = this.currentUserSubject.asObservable();

  private readonly ADMIN_USER = 'ranjana';
  private readonly ADMIN_PASS = '123';

  constructor(private userService: UserService) {
    this.loadUserFromStorage();
    console.log('AuthService got UserService instance:', this.userService);
  }

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
      this.currentUserSubject.next({ username, role: 'admin' });
      localStorage.setItem('currentUser', JSON.stringify({ username, role: 'admin' }));
      return true;
    }

    if (username !== '') {
      const user = this.userService.getUserByUsername(username);

      // Block login if suspended
      if (user && user.active === false) {
        alert('This user is suspended. Please contact admin.');
        return false;
      }

      this.currentUserSubject.next({ username, role: 'user' });
      localStorage.setItem('currentUser', JSON.stringify({ username, role: 'user' }));

      if (!user) {
        const newUser: User = {
          id: Date.now(),
          username,
          name: username,
          email: '',
          role: 'user',
          active: true
        };
        this.userService.addUser(newUser);
      }
      return true;
    }

    return false;
  }

  logout() {
    this.currentUserSubject.next({ username: '', role: null });
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.value;
    return !!(user && user.role && user.username);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'admin';
  }

  getCurrentUser(): AuthUser {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<AuthUser> {
    return this.currentUser$;
  }

  loadUserFromStorage() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && 'username' in user && 'role' in user) {
          this.currentUserSubject.next(user);
          return;
        }
      } catch {}
    }
    this.currentUserSubject.next({ username: '', role: null });
  }
}
