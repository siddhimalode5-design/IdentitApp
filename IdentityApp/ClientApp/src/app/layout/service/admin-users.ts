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

  getConfirmedUsers(search: string = '', page: number = 1, pageSize: number = 10) {
  return this.http.get<any>(this.baseUrl, {
    headers: {
      Authorization: `Bearer ${this.auth.getToken()}`
    },
    params: {
      search,
      page,
      pageSize
    }
  });
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

  suspendUser(userId: string) {
  return this.http.put(
    `${this.baseUrl}/suspend/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    }
  );
}

unsuspendUser(userId: string) {
  return this.http.put(
    `${this.baseUrl}/unsuspend/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    }
  );
}

updateUserBasicInfo(userId: string, firstName: string, lastName: string) {
  return this.http.put(
    `${this.baseUrl}/${userId}/update-basic`,
    { firstName, lastName },
    {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    }
  );
}
changeUserEmail(userId: string, dto: { newEmail: string }) {
    return this.http.put(`${this.baseUrl}/${userId}/change-email`, dto);
  }


}
