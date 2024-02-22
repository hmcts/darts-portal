import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';
import { UserData } from '../models/users/user-data.interface';
import { UserSearchFormValues } from '../models/users/user-search-form-values.type';
import { UserSearchRequest } from '../models/users/user-search-request.interface';
import { User } from '../models/users/user.type';

export const USER_ADMIN_SEARCH_PATH = 'api/admin/users/search';
export const ADMIN_GET_USER = 'api/admin/users';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  http = inject(HttpClient);

  searchUsers(query: UserSearchFormValues): Observable<User[]> {
    const body: UserSearchRequest = this.mapToUserSearchRequest(query);
    return this.http.post<UserData[]>(USER_ADMIN_SEARCH_PATH, body).pipe(map(this.mapUsers));
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<UserData>(`${ADMIN_GET_USER}/${userId}`).pipe(map(this.mapUser));
  }

  doesEmailExist(email: string): Observable<boolean> {
    return this.http
      .get<UserData[]>(`${ADMIN_GET_USER}`, { headers: { 'Email-Address': email } })
      .pipe(map((users) => users.length > 0));
  }

  private mapToUserSearchRequest(query: UserSearchFormValues): UserSearchRequest {
    return {
      full_name: query.fullName ? query.fullName : null,
      email_address: query.email ? query.email : null,
      active: query.userStatus === 'active' ? true : query.userStatus === 'inactive' ? false : null,
    };
  }

  private mapUsers(users: UserData[]): User[] {
    return users.map((user) => ({
      id: user.id,
      lastLoginAt: DateTime.fromISO(user.last_login_at),
      lastModifiedAt: DateTime.fromISO(user.last_modified_at),
      createdAt: DateTime.fromISO(user.created_at),
      fullName: user.full_name,
      emailAddress: user.email_address,
      description: user.description,
      active: user.active,
      securityGroupIds: user.security_group_ids,
    }));
  }

  private mapUser(user: UserData): User {
    return {
      id: user.id,
      lastLoginAt: DateTime.fromISO(user.last_login_at),
      lastModifiedAt: DateTime.fromISO(user.last_modified_at),
      createdAt: DateTime.fromISO(user.created_at),
      fullName: user.full_name,
      emailAddress: user.email_address,
      description: user.description,
      active: user.active,
      securityGroupIds: user.security_group_ids,
    };
  }
}
