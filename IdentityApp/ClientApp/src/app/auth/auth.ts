import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private _isLoggedIn = signal<boolean>(this.hasToken());
  private _user = signal<any>(this.getUser());

  // Expose to components
  isLoggedIn = this._isLoggedIn.asReadonly();
  user = this._user.asReadonly();

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  login(token: string, userData: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    this._isLoggedIn.set(true);
    this._user.set(userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this._isLoggedIn.set(false);
    this._user.set(null);
  }
}
