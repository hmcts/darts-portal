import { NodeRegistrationData } from '@admin-types/node-registration/node-registration-data.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NodeRegistrationService {
  http = inject(HttpClient);
  userService = inject(UserAdminService);

  getNodeRegistrations() {
    return this.http.get<NodeRegistrationData[]>(`api/admin/node-register-management`).pipe(
      switchMap((registrations) => {
        const uniqueUserIds = Array.from(new Set(registrations.map((r) => r.created_by)));
        return this.getUserNamesByIds(uniqueUserIds).pipe(
          map((userMap) => this.mapNodeRegistrations(registrations, userMap))
        );
      })
    );
  }

  private mapNodeRegistrations(registrations: NodeRegistrationData[], userMap: Record<number, string>) {
    return registrations.map((registration) => ({
      id: registration.id,
      courthouse: registration.courthouse.display_name,
      courtroom: registration.courtroom.name,
      ipAddress: registration.ip_address,
      hostname: registration.hostname ?? '',
      macAddress: registration.mac_address,
      nodeType: registration.node_type,
      createdAt: DateTime.fromISO(registration.created_at),
      createdBy: registration.created_by,
      createdByName: userMap[registration.created_by] || 'System',
    }));
  }

  private getUserNamesByIds(userIds: number[]) {
    const returnSystemUsers = true;
    return this.userService.getUsersById(userIds, returnSystemUsers).pipe(
      map((users) => {
        const userMap: Record<number, string> = {};
        users.forEach((user) => {
          userMap[user.id] = user.fullName;
        });
        return userMap;
      })
    );
  }
}
