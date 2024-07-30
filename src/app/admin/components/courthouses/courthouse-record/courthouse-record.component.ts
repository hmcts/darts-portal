import { CourthouseUser, SecurityGroup, SecurityRole, User } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FiltersComponent } from '@common/filters/filters.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
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
    GovukTagComponent,
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
      requesterRole: roles.find((role) => role.name === 'REQUESTER')!,
      approverRole: roles.find((role) => role.name === 'APPROVER')!,
    }))
  );

  courthouseRequesterApproverGroups$ = this.roles$.pipe(
    switchMap(({ requesterRole, approverRole }) => {
      return this.groupsService
        .getGroupsByRoleIdsAndCourthouseId([requesterRole.id, approverRole.id], this.courthouseId)
        .pipe(switchMap((groups) => of({ groups, approverRole, requesterRole })))
        .pipe(tap(({ groups }) => (this.approverRequesterGroups = groups)));
    })
  );

  fetchUsers$ = this.courthouseRequesterApproverGroups$.pipe(
    switchMap(({ groups, approverRole, requesterRole }) => {
      return this.usersService.getUsersById(groups.flatMap((g) => g.userIds)).pipe(
        map((users) => {
          const requesterGroups = groups.filter((group) => group.securityRoleId === requesterRole.id);
          const approverGroups = groups.filter((group) => group.securityRoleId === approverRole.id);

          const requesterUserIds = requesterGroups.flatMap((group) => group.userIds);
          const approverUserIds = approverGroups.flatMap((group) => group.userIds);

          const requesterUsers = this.getUsersWithRoleByGroup(users, requesterUserIds, requesterGroups, requesterRole);
          const approverUsers = this.getUsersWithRoleByGroup(users, approverUserIds, approverGroups, approverRole);

          return [...requesterUsers, ...approverUsers];
        })
      );
    }),
    map((users) => users.map((user) => ({ ...user, checkboxLabel: `Select ${user.userName} for deletion` })))
  );

  users$ = this.refresh$.pipe(switchMap(() => this.fetchUsers$));

  getUsersWithRoleByGroup(
    users: User[],
    groupUserIds: number[],
    groups: SecurityGroup[],
    role: SecurityRole
  ): CourthouseUser[] {
    return users
      .filter((u) => groupUserIds.includes(u.id))
      .map((u) => {
        const usersGroups = groups.filter((g) => g.userIds.includes(u.id)).filter((g) => g.securityRoleId === role.id);
        return {
          id: u.id,
          userName: u.fullName,
          email: u.emailAddress,
          roleType: role.displayName,
          role,
          groups: usersGroups,
        };
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

  onDeleteClicked(selectedUsers: CourthouseUser[]) {
    this.router.navigate([], {
      queryParams: {
        userRoleDeleteSuccess: null,
      },
    });
    this.isDeleting = true;
    this.selectedUsers = selectedUsers;
  }

  onDeleteConfirmed() {
    const selectedGroupIds = this.selectedUsers.flatMap((user) => user.groups.map((group) => group.id));

    const groupIdUserIdsMap = new Map<number, number[]>(
      this.approverRequesterGroups.map((group) => [group.id, group.userIds])
    );

    this.selectedUsers.forEach((user) => {
      user.groups.forEach((group) => {
        if (groupIdUserIdsMap.has(group.id)) {
          groupIdUserIdsMap.set(
            group.id,
            groupIdUserIdsMap.get(group.id)!.filter((userId) => userId !== user.id)
          );
        }
      });
    });

    const deleteRequests = Array.from(groupIdUserIdsMap.entries())
      .filter(([groupid]) => selectedGroupIds.includes(groupid))
      .map(([groupId, userIds]) => this.groupsService.assignUsersToGroup(groupId, userIds));

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
