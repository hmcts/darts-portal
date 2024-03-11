import { CreateUpdateUserFormValues, SecurityGroup, SecurityRole } from '@admin-types/index';
import { CreateUserRequest } from '@admin-types/users/create-user-request.type';
import { SecurityGroupData } from '@admin-types/users/security-group.interface';
import { SecurityRoleData } from '@admin-types/users/security-role.interface';
import { UserData } from '@admin-types/users/user-data.interface';
import { UserSearchFormValues } from '@admin-types/users/user-search-form-values.type';
import { UserSearchRequest } from '@admin-types/users/user-search-request.interface';
import { User } from '@admin-types/users/user.type';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GET_SECURITY_GROUPS_PATH } from '@services/courthouses/courthouses.service';
import { DateTime } from 'luxon';
import { Observable, forkJoin, map } from 'rxjs';

export const USER_ADMIN_SEARCH_PATH = 'api/admin/users/search';
export const USER_ADMIN_PATH = 'api/admin/users';
export const GET_SECURITY_ROLES_PATH = 'api/admin/security-roles';

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
    return forkJoin({
      userData: this.http.get<UserData>(`${USER_ADMIN_PATH}/${userId}`),
      securityGroups: this.getSecurityGroupsWithRoles(),
    }).pipe(map(({ userData, securityGroups }) => this.mapUserWithSecurityGroups(userData, securityGroups)));
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
      .pipe(map(this.mapUser));
  }

  assignGroups(id: number, securityGroupIds: number[]) {
    return this.http
      .patch<UserData>(`${USER_ADMIN_PATH}/${id}`, {
        security_group_ids: securityGroupIds,
      })
      .pipe(map(this.mapUser));
  }

  doesEmailExist(email: string): Observable<boolean> {
    return this.http
      .get<UserData[]>(`${USER_ADMIN_PATH}`, { headers: { 'Email-Address': email } })
      .pipe(map((users) => users.length > 0));
  }

  getSecurityGroups(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityGroupData[]>(`${GET_SECURITY_GROUPS_PATH}`).pipe(
      map((groups) => {
        return groups.map((group) => ({
          id: group.id,
          name: group.name,
          securityRoleId: group.security_role_id,
        }));
      })
    );
  }

  getSecurityRoles(): Observable<SecurityRole[]> {
    return this.http.get<SecurityRoleData[]>(`${GET_SECURITY_ROLES_PATH}`).pipe(
      map((roles) => {
        return roles.map((role) => ({
          id: role.id,
          name: role.display_name,
          displayState: role.display_state,
        }));
      })
    );
  }

  getSecurityGroupsWithRoles(): Observable<SecurityGroup[]> {
    return forkJoin({
      groups: this.getSecurityGroups(),
      roles: this.getSecurityRoles(),
    }).pipe(
      map(({ groups, roles }) =>
        groups.map((group) => {
          const role = roles.find((r) => r.id === group.securityRoleId);
          return { ...group, role };
        })
      )
    );
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

  private mapUserWithSecurityGroups(user: UserData, securityGroups: SecurityGroup[]): User {
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
      securityGroups: user.security_group_ids.map((id) => securityGroups.find((group) => group.id === id)!),
    };
  }
}
