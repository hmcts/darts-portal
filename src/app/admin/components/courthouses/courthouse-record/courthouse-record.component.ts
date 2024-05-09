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
import { TabDirective } from '@directives/tab.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, of, switchMap } from 'rxjs';
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
  ],
})
export class CourthouseRecordComponent {
  courthouseService = inject(CourthouseService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupsService = inject(GroupsService);
  usersService = inject(UserAdminService);
  isDeleting = false;

  courthouseId = this.route.snapshot.params.courthouseId;

  courthouse$ = this.courthouseService.getCourthouseWithRegionsAndSecurityGroups(this.courthouseId);
  isNewCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.newCourthouse));
  isUpdatedCourthouse$ = this.route.queryParams?.pipe(map((params) => !!params.updated));

  selectedRows = [] as CourthouseUser[];

  outputEvent(value: CourthouseUser[]) {
    this.isDeleting = true;
    console.log(value);
  }

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
    roleId: number,
    roles: SecurityRole[]
  ): (User & { role: string })[] {
    return users
      .filter((u) => groupUserIds.includes(u.id))
      .map((u) => {
        const group = groups.filter((g) => g.userIds.includes(u.id)).filter((g) => g.securityRoleId === roleId)[0];
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

  // onDeleteConfirmed() {
  //   const idsToDelete = this.users.map((u) => u.transcriptionId);

  //   this.transcriptService.deleteRequest(idsToDelete).subscribe({
  //     next: () => {
  //       this.isDeleting = false;
  //       this.refresh$.next();
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.isDeleting = false;
  //       if (error.status === 400) {
  //         this.router.navigate(['transcriptions/delete-error']);
  //       }
  //     },
  //   });
  // }

  // get deleteScreenTitle(): string {
  //   return this.users.length === 1
  //     ? `You are removing 1 user from Cardiff Crown Court`
  //     : `You are removing ${this.users.length} users from Cardiff Crown Court`;
  // }

  // get deleteScreenText(): string {
  //   return this.selectedRequests.length === 1
  //     ? 'This action will remove this transcript request from your transcripts. You can still access it by searching at the hearing and case levels.'
  //     : 'This action will remove these transcript requests from your transcripts. You can still access them by searching at the hearing and case levels.';
  // }

  // onDeleteClicked() {
  //   if (this.users.length) {
  //     this.isDeleting = true;
  //   }
  // }
  onDeleteCancelled() {
    this.isDeleting = false;
  }
}
