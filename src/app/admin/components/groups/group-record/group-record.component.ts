import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { CourthouseData } from '@core-types/index';

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
  ],
  templateUrl: './group-record.component.html',
  styleUrl: './group-record.component.scss',
})
export class GroupRecordComponent {
  route = inject(ActivatedRoute);
  groupsService = inject(GroupsService);
  courthouseService = inject(CourthouseService);

  groupId: number = +this.route.snapshot.params.id;
  selectedCourthouses: CourthouseData[] = [];

  loading$ = new BehaviorSubject<boolean>(true);
  group$ = this.groupsService.getGroupAndRole(this.groupId);
  courthouses$ = this.courthouseService.getCourthouses().pipe(shareReplay(1));

  groupWithCourthouses$ = forkJoin([this.group$, this.courthouses$]).pipe(
    map(([group, courthouses]) => ({
      ...group,
      courthouses: courthouses.filter((courthouse) => group.courthouseIds.includes(courthouse.id)),
    })),
    tap((group) => (this.selectedCourthouses = group.courthouses))
  );

  vm$ = combineLatest({ group: this.groupWithCourthouses$, courthouses: this.courthouses$ }).pipe(
    tap(() => this.loading$.next(false))
  );

  onUpdateCourthouses(courthouseIds: number[]) {
    this.groupsService.assignCourthousesToGroup(this.groupId, courthouseIds).subscribe();
  }
}
