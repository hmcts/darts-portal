import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { CourthouseData } from '@core-types/index';
import { UserAdminService } from '@services/user-admin/user-admin.service';

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
    RouterLink,
  ],
  templateUrl: './group-record.component.html',
  styleUrl: './group-record.component.scss',
})
export class GroupRecordComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  groupsService = inject(GroupsService);
  userAdminService = inject(UserAdminService);
  courthouseService = inject(CourthouseService);

  groupId: number = +this.route.snapshot.params.id;
  tab = this.route.snapshot.queryParams.tab || 'Courthouses';
  successBannerText = signal('');

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

  ngOnInit(): void {
    this.route.queryParams.pipe(map((params) => params.removedUsers)).subscribe((value) => {
      if (value) {
        this.successBannerText.set(value + ' ' + (+value === 1 ? 'user' : 'users') + ' removed');
      }
    });
    this.route.queryParams.pipe(map((params) => params.updated)).subscribe((value) => {
      if (value) {
        this.successBannerText.set('Group details updated');
      }
    });
    this.route.queryParams.pipe(map((params) => params.created)).subscribe((value) => {
      if (value) {
        this.successBannerText.set('Group created');
      }
    });
  }

  onUpdateCourthouses(courthouseData: {
    selectedCourthouses: CourthouseData[];
    addedCourtHouse?: CourthouseData;
    removedCourtHouse?: CourthouseData;
  }) {
    const courthouseIds = courthouseData.selectedCourthouses.map((courthouse) => courthouse.id);
    this.groupsService.assignCourthousesToGroup(this.groupId, courthouseIds).subscribe();

    if (courthouseData.addedCourtHouse) {
      this.successBannerText.set(courthouseData.addedCourtHouse.display_name + ' added');
    }
    if (courthouseData.removedCourtHouse) {
      this.successBannerText.set(courthouseData.removedCourtHouse.display_name + ' removed');
    }
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
