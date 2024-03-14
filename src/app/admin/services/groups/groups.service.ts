import { SecurityGroup, SecurityGroupData, SecurityRole, SecurityRoleData } from '@admin-types/index';
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

  getGroups(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityGroupData[]>(GET_SECURITY_GROUPS_PATH).pipe(
      map((groups) => {
        return groups.map((group) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          securityRoleId: group.security_role_id,
        }));
      })
    );
  }

  getRoles(): Observable<SecurityRole[]> {
    return this.http.get<SecurityRoleData[]>(GET_SECURITY_ROLES_PATH).pipe(
      map((roles) => {
        return roles.map((role) => ({
          id: role.id,
          name: role.display_name,
          displayState: role.display_state,
        }));
      })
    );
  }

  mapGroupsToRoles(groups: SecurityGroup[], roles: SecurityRole[]): SecurityGroup[] {
    return groups.map((group) => {
      const role = roles.find((r) => r.id === group.securityRoleId);
      return { ...group, role };
    });
  }
}
