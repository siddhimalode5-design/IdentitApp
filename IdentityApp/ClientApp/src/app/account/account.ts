import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Account {

  // private baseUrl = "http://localhost:5170/api/Account";
  // private userSource = new ReplaySubject<User | null>(1);

  constructor(private http: HttpClient) {}

  register(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Account/register`, payload);
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Account/confirm-email`, {
      params: { userId, token }
    });
  }
  verifyEmail(userId: string, code: string) {
  return this.http.get(`${environment.apiUrl}/Account/verifyEmail`, {
    params: { userId, code }
  });
}



  login(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Account/login`, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Account/forgot-password`, { email });
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Account/reset-password`, payload);
  }

  // private setUser(User){
  //   localStorage.setItem(environment.userKey,JSON.stringify(user));
  //   this.userSource.next(user);
  // }
}
