import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { CourthouseData } from '@core-types/index';
import { UserAdminService } from './../../../services/user-admin/user-admin.service';

import { User } from '@admin-types/index';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { TabDirective } from '@directives/tab.directive';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { GroupsService } from '@services/groups/groups.service';
import { BehaviorSubject, combineLatest, forkJoin, map, shareReplay, tap } from 'rxjs';
import { GroupCourthousesComponent } from '../group-courthouses/group-courthouses.component';
import { GroupUsersComponent } from '../group-users/group-users.component';

@Component({
  selector: 'app-group-record',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    AsyncPipe,
    TabsComponent,
    TabDirective,
    LoadingComponent,
    GroupCourthousesComponent,
    GroupUsersComponent,
    GovukBannerComponent,
  ],
  templateUrl: './group-record.component.html',
  styleUrl: './group-record.component.scss',
})
export class GroupRecordComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupsService = inject(GroupsService);
  userAdminService = inject(UserAdminService);
  courthouseService = inject(CourthouseService);

  groupId: number = +this.route.snapshot.params.id;
  tab = this.route.snapshot.queryParams.tab || 'Courthouses';
  hasRemovedUsers$ = this.route.queryParams.pipe(map((params) => params.removedUsers));

  selectedCourthouses: CourthouseData[] = [];

  loading$ = new BehaviorSubject<boolean>(true);
  group$ = this.groupsService.getGroupAndRole(this.groupId);
  users$ = this.userAdminService.getUsers().pipe(shareReplay(1));
  courthouses$ = this.courthouseService.getCourthouses().pipe(shareReplay(1));

  groupWithCourthousesAndUsers$ = forkJoin([this.group$, this.courthouses$, this.users$]).pipe(
    map(([group, courthouses, users]) => ({
      ...group,
      courthouses: courthouses.filter((courthouse) => group.courthouseIds.includes(courthouse.id)),
      users: users.filter((user) => group.userIds.includes(user.id)),
    })),
    tap((group) => (this.selectedCourthouses = group.courthouses))
  );

  vm$ = combineLatest({
    group: this.groupWithCourthousesAndUsers$,
    courthouses: this.courthouses$,
    users: this.users$,
  }).pipe(tap(() => this.loading$.next(false)));

  onUpdateCourthouses(courthouseIds: number[]) {
    this.groupsService.assignCourthousesToGroup(this.groupId, courthouseIds).subscribe();
  }

  onUpdateUsers(userIds: number[]) {
    this.groupsService.assignUsersToGroup(this.groupId, userIds).subscribe();
  }

  onRemoveUsers(event: { groupUsers: User[]; userIdsToRemove: number[] }) {
    this.router.navigate(['/admin/groups', this.groupId, 'remove-users'], {
      state: { groupUsers: event.groupUsers, userIdsToRemove: event.userIdsToRemove },
    });
  }
}
