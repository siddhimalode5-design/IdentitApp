import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class AdminUsers {

  private baseUrl = 'https://localhost:7008/api/admin/users';

  constructor(
    private http: HttpClient,
    private auth: Auth            // ✅ ADD THIS
  ) {}

  getConfirmedUsers() {
    return this.http.get<any>(
      this.baseUrl,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    );
  }

  lockUser(userId: string) {
    return this.http.put(
      `${this.baseUrl}/lock/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    );
  }

  unlockUser(userId: string) {
    return this.http.put(
      `${this.baseUrl}/unlock/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    );
  }

  deleteUser(userId: string) {
    return this.http.delete(
      `${this.baseUrl}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    );
  }
}
