import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private _isLoggedIn = signal<boolean>(this.hasToken());
  private _user = signal<any>(this.getUser());

  // readonly signals
  isLoggedIn = this._isLoggedIn.asReadonly();
  user = this._user.asReadonly();

  constructor(private router: Router) {}

  /* ===================== TOKEN HELPERS ===================== */

  private hasToken(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  private getUser() {
    const u =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  /* ===================== AUTH ACTIONS ===================== */

  login(token: string, userData: any, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
    }

    this._isLoggedIn.set(true);
    this._user.set(userData);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();

    this._isLoggedIn.set(false);
    this._user.set(null);

    this.router.navigate(['/login']);
  }
 getRoles(): string[] {
  const user = this.user();
  return user?.roles ?? [];
}
getEmail(): string {
  const user = this.user();
  return user?.email ?? '';
}

 


isAdmin(): boolean {
  return this.getRoles().includes('Admin');
}

  
}
