import { User } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { Observable, combineLatest, shareReplay } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { SecurityGroupSelectorComponent, UserGroup } from './security-group-selector/security-group-selector.component';

@Component({
  selector: 'app-assign-groups',
  standalone: true,
  imports: [SecurityGroupSelectorComponent, GovukHeadingComponent, AsyncPipe, LoadingComponent],
  templateUrl: './assign-groups.component.html',
  styleUrl: './assign-groups.component.scss',
})
export class AssignGroupsComponent implements OnInit, OnDestroy {
  router = inject(Router);
  userAdminService = inject(UserAdminService);
  headerService = inject(HeaderService);

  user = this.router.getCurrentNavigation()?.extras.state?.user as User;

  groups$: Observable<UserGroup[]> = this.userAdminService
    .getSecurityGroupsWithRoles()
    .pipe(
      map((groups) =>
        groups.map((group) => ({
          id: group.id,
          name: group.name,
          role: group.role?.name as string,
          displayState: group.role?.displayState as boolean,
        }))
      )
    )
    .pipe(shareReplay(1));

  visibleGroups$ = this.groups$.pipe(map((groups) => groups.filter((group) => group.displayState)));
  hiddenGroups$ = this.groups$.pipe(map((groups) => groups.filter((group) => !group.displayState)));

  data$ = combineLatest({
    groups: this.visibleGroups$,
    hiddenGroups: this.hiddenGroups$,
  });

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['admin', 'users']);
      return;
    }
    this.headerService.hideNavigation();
  }

  onAssign(groups: UserGroup[], hiddenGroups: UserGroup[]) {
    const groupIds = groups.concat(hiddenGroups).map((group) => group.id);
    const assignedCount = groupIds.length - hiddenGroups.length;

    this.userAdminService.assignGroups(this.user.id, groupIds).subscribe(() =>
      this.router.navigate(['admin', 'users', this.user.id], {
        queryParams: { assigned: assignedCount, tab: 'Groups' },
      })
    );
  }

  onCancel() {
    this.router.navigate(['/admin/users', this.user.id], { queryParams: { tab: 'Groups' } });
  }

  ngOnDestroy() {
    this.headerService.showNavigation();
  }
}
