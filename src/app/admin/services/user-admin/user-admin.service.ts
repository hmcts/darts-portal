import { CreateUpdateUserFormValues, SecurityGroup } from '@admin-types/index';
import { CreateUserRequest } from '@admin-types/users/create-user-request.type';
import { UserData } from '@admin-types/users/user-data.interface';
import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { UserSearchRequest } from '@admin-types/users/user-search-request.interface';
import { User } from '@admin-types/users/user.type';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GroupsService } from '@services/groups/groups.service';
import { DateTime } from 'luxon';
import { Observable, forkJoin, map } from 'rxjs';

export const USER_ADMIN_SEARCH_PATH = 'api/admin/users/search';
export const USER_ADMIN_PATH = 'api/admin/users';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  http = inject(HttpClient);
  groupsService = inject(GroupsService);

  searchUsers(query: UserSearchFormValues): Observable<User[]> {
    const body: UserSearchRequest = this.mapToUserSearchRequest(query);
    return this.http.post<UserData[]>(USER_ADMIN_SEARCH_PATH, body).pipe(map((users) => this.mapUsers(users)));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .post<UserData[]>(USER_ADMIN_SEARCH_PATH, { full_name: null, email_address: null, active: null })
      .pipe(map((users) => this.mapUsers(users)));
  }

  getUsersById(userIds: number[]): Observable<User[]> {
    return this.http
      .post<
        UserData[]
      >(USER_ADMIN_SEARCH_PATH, { user_ids: userIds, full_name: null, email_address: null, active: null })
      .pipe(map((users) => this.mapUsers(users)));
  }

  getUser(userId: number): Observable<User> {
    return forkJoin({
      userData: this.http.get<UserData>(`${USER_ADMIN_PATH}/${userId}`),
      security: this.groupsService.getGroupsAndRoles(),
    }).pipe(map(({ userData, security }) => this.mapUserWithSecurityGroups(userData, security.groups)));
  }

  createUser(user: CreateUpdateUserFormValues): Observable<User> {
    return this.http.post<UserData>(USER_ADMIN_PATH, this.mapToCreateUserRequest(user)).pipe(map(this.mapUser));
  }

  updateUser(id: number, updatedUser: CreateUpdateUserFormValues) {
    return this.http
      .patch<UserData>(`${USER_ADMIN_PATH}/${id}`, {
        full_name: updatedUser.fullName,
        email_address: updatedUser.email,
        description: updatedUser.description,
      })
      .pipe(map((user) => this.mapUser(user)));
  }

  assignGroups(id: number, securityGroupIds: number[]) {
    return this.http
      .patch<UserData>(`${USER_ADMIN_PATH}/${id}`, {
        security_group_ids: securityGroupIds,
      })
      .pipe(map((user) => this.mapUser(user)));
  }

  doesEmailExist(email: string): Observable<boolean> {
    return this.http
      .get<UserData[]>(`${USER_ADMIN_PATH}`, { headers: { 'Email-Address': email } })
      .pipe(map((users) => users.length > 0));
  }

  activateUser(id: number) {
    return this.http
      .patch<UserData>(`${USER_ADMIN_PATH}/${id}`, { active: true })
      .pipe(map((user) => this.mapUser(user)));
  }

  private mapToCreateUserRequest(user: CreateUpdateUserFormValues): CreateUserRequest {
    return {
      full_name: user.fullName!,
      email_address: user.email!,
      description: user.description ? user.description : null,
      active: true,
      security_group_ids: [],
    };
  }

  private mapToUserSearchRequest(query: UserSearchFormValues): UserSearchRequest {
    return {
      full_name: query.fullName ? query.fullName : null,
      email_address: query.email ? query.email : null,
      active: query.userStatus === 'active' ? true : query.userStatus === 'inactive' ? false : null,
    };
  }

  mapUser(user: UserData): User {
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

  private mapUsers(users: UserData[]): User[] {
    return users.map((user) => this.mapUser(user));
  }

  private mapUserWithSecurityGroups(user: UserData, securityGroups: SecurityGroup[]): User {
    return {
      ...this.mapUser(user),
      securityGroups: user.security_group_ids.map((id) => securityGroups.find((group) => group.id === id)!),
    };
  }
}
