import { CourthouseUser, SecurityGroup, SecurityRole, User } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FiltersComponent } from '@common/filters/filters.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { BehaviorSubject, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CourthouseUsersComponent } from '../courthouse-users/courthouse-users.component';

@Component({
  selector: 'app-courthouse',
  standalone: true,
  templateUrl: './courthouse-record.component.html',
  styleUrl: './courthouse-record.component.scss',
  imports: [
    CommonModule,
    LuxonDatePipe,
    TabsComponent,
    TabDirective,
    DetailsTableComponent,
    NotFoundComponent,
    LoadingComponent,
    GovukBannerComponent,
    FiltersComponent,
    DataTableComponent,
    CourthouseUsersComponent,
    DeleteComponent,
    TableRowTemplateDirective,
  ],
})
export class CourthouseRecordComponent {
  courthouseService = inject(CourthouseService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupsService = inject(GroupsService);
  usersService = inject(UserAdminService);
  isDeleting = false;
  tab = 'Details';

  courthouseId = this.route.snapshot.params.courthouseId;

  courthouse$ = this.courthouseService.getCourthouseWithRegionsAndSecurityGroups(this.courthouseId);
  isNewCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.newCourthouse));
  isUpdatedCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.updated));
  isDeletedUserRoles$ = this.route.queryParams?.pipe(map((params) => !!params.userRoleDeleteSuccess));

  private refresh$ = new BehaviorSubject<void>(undefined);

  selectedUsers: CourthouseUser[] = [];
  deleteColumns: DatatableColumn[] = [
    { name: 'User name', prop: 'userName', sortable: false },
    { name: 'Email', prop: 'email', sortable: false },
    { name: 'Role type', prop: 'roleType', sortable: false },
  ];
  approverRequesterGroups: SecurityGroup[] = [];

  roles$ = this.groupsService.getRoles().pipe(
    map((roles) => ({
      roles,
      requesterId: roles.find((role) => role.name === 'REQUESTER')!.id,
      approverId: roles.find((role) => role.name === 'APPROVER')!.id,
    }))
  );

  onDeleteClicked(selectedUsers: CourthouseUser[]) {
    this.isDeleting = true;
    this.selectedUsers = selectedUsers;
  }

  courthouseRequesterApproverGroups$ = this.roles$.pipe(
    switchMap(({ roles, requesterId, approverId }) => {
      return this.groupsService
        .getGroupsByRoleIdsAndCourthouseId([requesterId, approverId], this.courthouseId)
        .pipe(
          switchMap((groups) => {
            const approverUserIds: number[] = [];
            const requesterUserIds: number[] = [];

            // Split userIds into approvers and requesters
            groups.forEach((group) => {
              group.securityRoleId === approverId
                ? approverUserIds.push(...group.userIds)
                : requesterUserIds.push(...group.userIds);
            });

            return of({
              roles,
              requesterId,
              approverId,
              groups,
              approverUserIds,
              requesterUserIds,
            });
          })
        )
        .pipe(
          tap(({ groups }) => {
            this.approverRequesterGroups = groups;
          })
        );
    })
  );

  fetchUsers$ = this.courthouseRequesterApproverGroups$.pipe(
    switchMap(({ roles, requesterId, approverId, groups, approverUserIds, requesterUserIds }) => {
      return this.usersService.getUsersById([...approverUserIds, ...requesterUserIds]).pipe(
        map((users) => {
          // split users into approvers and requesters and add role display name
          const approvers = this.getUsersWithRoleByGroup(users, approverUserIds, groups, approverId, roles);
          const requesters = this.getUsersWithRoleByGroup(users, requesterUserIds, groups, requesterId, roles);

          return [...approvers, ...requesters].map((user) => {
            return {
              userName: user.fullName,
              email: user.emailAddress,
              roleType: user.role,
              userId: user.id,
              groupId: user.groupId,
            };
          });
        })
      );
    })
  );

  users$ = this.refresh$.pipe(switchMap(() => this.fetchUsers$));

  getUsersWithRoleByGroup(
    users: User[],
    groupUserIds: number[],
    groups: SecurityGroup[],
    roleId: number,
    roles: SecurityRole[]
  ): (User & { role: string; groupId: number })[] {
    return users
      .filter((u) => groupUserIds.includes(u.id))
      .map((u) => {
        const group = groups.filter((g) => g.userIds.includes(u.id)).filter((g) => g.securityRoleId === roleId)[0];
        const role = roles.find((role) => role.id === group.securityRoleId)?.displayName ?? '';
        return { ...u, role, groupId: group.id };
      });
  }

  formatSecurityGroupLinks(securityGroups: SecurityGroup[] | undefined) {
    if (securityGroups?.length)
      return securityGroups?.map((securityGroup) => {
        return { value: securityGroup.name, href: `/admin/groups/${securityGroup.id}` };
      });
    // Otherwise return "None"
    return 'None';
  }

  onDeleteConfirmed() {
    const uniqueUserIdsToRemove = new Set(
      this.selectedUsers.map((user) => {
        return user.userId;
      })
    );

    const deleteRequests = Array.from(
      new Set(
        this.selectedUsers.map((user) => {
          return this.approverRequesterGroups.find((group) => group.id === user.groupId);
        })
      )
    )
      .map((group) => ({
        groupId: group!.id,
        userIds: group!.userIds.filter((u) => !uniqueUserIdsToRemove.has(u)),
      }))
      .map((s) => this.groupsService.assignUsersToGroup(s.groupId, s.userIds));

    forkJoin(deleteRequests).subscribe({
      next: () => (this.isDeleting = false),
      error: () => (this.isDeleting = false),
      complete: () => {
        this.refresh$.next();
        this.router.navigate([`/admin/courthouses/${this.courthouseId}`], {
          queryParams: { userRoleDeleteSuccess: true },
        });
        this.tab = 'Users';
      },
    });
  }

  deleteScreenTitle(courthouseName: string): string {
    return this.selectedUsers.length === 1
      ? `You are removing 1 user role from ${courthouseName}`
      : `You are removing ${this.selectedUsers.length} user roles from ${courthouseName}`;
  }

  onDeleteCancelled() {
    this.isDeleting = false;
    this.tab = 'Users';
  }
}
