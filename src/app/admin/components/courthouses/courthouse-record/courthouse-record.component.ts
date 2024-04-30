import { SecurityGroup } from '@admin-types/groups/security-group.type';
import { SecurityRole, User } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { Filter } from '@common/filters/filter.interface';
import { FiltersComponent } from '@common/filters/filters.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { NotFoundComponent } from '@components/error/not-found/not-found.component';
import { DatatableColumn } from '@core-types/data-table/data-table-column.interface';
import { TabDirective } from '@directives/tab.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, of, switchMap } from 'rxjs';

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
  ],
})
export class CourthouseRecordComponent {
  courthouseService = inject(CourthouseService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupsService = inject(GroupsService);
  usersService = inject(UserAdminService);

  courthouseId = this.route.snapshot.params.courthouseId;
  selectedFilters: Filter[] | null = null;

  filters: Filter[] = [
    {
      displayName: 'User Name',
      name: 'userName',
      values: [],
      search: true,
    },
    {
      displayName: 'Role Type',
      name: 'roleType',
      values: ['Requester', 'Approver'],
      multiselect: true,
    },
  ];

  rows = [
    {
      userName: 'Barry Turton',
      email: 'Barry.Turton@justice.gov.uk',
      roleType: 'Requester',
    },
    {
      userName: 'Bob Turton',
      email: 'Bob.Turton@justice.gov.uk',
      roleType: 'Approver',
    },
    {
      userName: 'Norton Jackson',
      email: 'Norton.Jackson@justice.gov.uk',
      roleType: 'Requester',
    },
  ];

  columns: DatatableColumn[] = [
    { name: 'User name', prop: 'userName', sortable: true },
    { name: 'Email', prop: 'email', sortable: true },
    { name: 'Role type', prop: 'roleType', sortable: true },
  ];

  courthouse$ = this.courthouseService.getCourthouseWithRegionsAndSecurityGroups(this.courthouseId);
  isNewCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.newCourthouse));
  isUpdatedCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.updated));

  roles$ = this.groupsService.getRoles().pipe(
    map((roles) => ({
      roles,
      requesterId: roles.find((role) => role.name === 'REQUESTER')!.id,
      approverId: roles.find((role) => role.name === 'APPROVER')!.id,
    }))
  );

  courthouseRequesterApproverGroups$ = this.roles$.pipe(
    switchMap(({ roles, requesterId, approverId }) => {
      return this.groupsService.getGroupsByRoleIdsAndCourthouseId([requesterId, approverId], this.courthouseId).pipe(
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
      );
    })
  );

  users$ = this.courthouseRequesterApproverGroups$.pipe(
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
            };
          });
        })
      );
    })
  );

  getUsersWithRoleByGroup(
    users: User[],
    groupUserIds: number[],
    groups: SecurityGroup[],
    approverId: number,
    roles: SecurityRole[]
  ): (User & { role: string })[] {
    return users
      .filter((u) => groupUserIds.includes(u.id))
      .map((u) => {
        const group = groups.filter((g) => g.userIds.includes(u.id)).filter((g) => g.securityRoleId === approverId)[0];
        const role = roles.find((role) => role.id === group.securityRoleId)?.displayName ?? '';
        return { ...u, role };
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

  getFilters(filters: Filter[]) {
    this.selectedFilters = filters;
  }
}
