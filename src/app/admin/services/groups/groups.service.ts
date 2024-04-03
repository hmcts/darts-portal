import { GroupFormValue, SecurityGroup, SecurityGroupData, SecurityRole, SecurityRoleData } from '@admin-types/index';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

export const GET_SECURITY_ROLES_PATH = 'api/admin/security-roles';
export const GET_SECURITY_GROUPS_PATH = 'api/admin/security-groups';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  http = inject(HttpClient);

  getGroup(id: number): Observable<SecurityGroup> {
    return this.http.get<SecurityGroupData>(`${GET_SECURITY_GROUPS_PATH}/${id}`).pipe(map(this.mapGroupDataToGroup));
  }

  getGroups(): Observable<SecurityGroup[]> {
    return this.http
      .get<SecurityGroupData[]>(GET_SECURITY_GROUPS_PATH)
      .pipe(map((groups) => groups.map(this.mapGroupDataToGroup)));
  }

  getRoles(): Observable<SecurityRole[]> {
    return this.http.get<SecurityRoleData[]>(GET_SECURITY_ROLES_PATH).pipe(
      map((roles) => {
        return roles.map((role) => ({
          id: role.id,
          name: role.role_name,
          displayState: role.display_state,
          displayName: role.display_name,
        }));
      })
    );
  }

  getGroupAndRole(id: number): Observable<SecurityGroup> {
    return this.getGroup(id).pipe(
      switchMap((group) => {
        return this.getRoles().pipe(
          map((roles) => ({
            ...group,
            role: roles.find((role) => role.id === group.securityRoleId),
          }))
        );
      })
    );
  }

  getGroupsAndRoles(): Observable<{ groups: SecurityGroup[]; roles: SecurityRole[] }> {
    return this.getGroups().pipe(
      switchMap((groups) => {
        return this.getRoles().pipe(
          map((roles) => ({
            groups: this.mapGroupsToRoles(groups, roles),
            roles,
          }))
        );
      })
    );
  }

  assignCourthousesToGroup(groupId: number, courthouseIds: number[]) {
    return this.http.patch(`${GET_SECURITY_GROUPS_PATH}/${groupId}`, {
      courthouse_ids: courthouseIds,
    });
  }

  assignUsersToGroup(groupId: number, userIds: number[]) {
    return this.http.patch(`${GET_SECURITY_GROUPS_PATH}/${groupId}`, {
      user_ids: userIds,
    });
  }

  updateGroup(groupId: number, formValues: GroupFormValue) {
    return this.http.patch(`${GET_SECURITY_GROUPS_PATH}/${groupId}`, {
      name: formValues.name,
      display_name: formValues.name,
      description: formValues.description,
    });
  }

  createGroup(formValues: GroupFormValue): Observable<SecurityGroup> {
    return this.http
      .post<SecurityGroupData>(`${GET_SECURITY_GROUPS_PATH}`, {
        name: formValues.name,
        display_name: formValues.name,
        description: formValues.description,
        security_role_id: formValues.role?.id,
      })
      .pipe(map(this.mapGroupDataToGroup));
  }

  mapGroupDataToGroup(mapGroupDataToGroup: SecurityGroupData): SecurityGroup {
    return {
      id: mapGroupDataToGroup.id,
      name: mapGroupDataToGroup.name,
      displayName: mapGroupDataToGroup.display_name,
      description: mapGroupDataToGroup.description,
      displayState: mapGroupDataToGroup.display_state,
      globalAccess: mapGroupDataToGroup.global_access,
      securityRoleId: mapGroupDataToGroup.security_role_id,
      courthouseIds: mapGroupDataToGroup.courthouse_ids,
      userIds: mapGroupDataToGroup.user_ids,
    };
  }

  mapGroupsToRoles(groups: SecurityGroup[], roles: SecurityRole[]): SecurityGroup[] {
    return groups.map((group) => {
      const role = roles.find((r) => r.id === group.securityRoleId);
      return { ...group, role };
    });
  }
}
