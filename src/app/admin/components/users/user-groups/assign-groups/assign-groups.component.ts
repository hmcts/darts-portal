import { SecurityGroup, User } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { GroupsService } from '@services/groups/groups.service';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { Observable, map } from 'rxjs';
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
  groupsService = inject(GroupsService);

  user = this.router.getCurrentNavigation()?.extras.state?.user as User;

  // store the hidden groups so we can put them back in when assigning
  usersHiddenGroups = this.user?.securityGroups?.filter((group) => !group.role?.displayState) ?? [];

  groups$: Observable<UserGroup[]> = this.groupsService
    .getGroupsAndRoles()
    .pipe(map((data) => this.mapSecurityGroupsToUserGroups(data.groups))) //flatten view model
    .pipe(map((groups) => groups.filter((group) => group.displayState))); // filter out hidden groups for the UI

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['admin', 'users']);
      return;
    }
    this.headerService.hideNavigation();
  }

  onAssign(selectedGroups: UserGroup[]) {
    const selectedGroupIds = selectedGroups.map((group) => group.id);
    const usersHiddenGroupIds = this.usersHiddenGroups.map((group) => group.id);

    // put the hidden groups back in
    const groupsToAssign = selectedGroupIds.concat(usersHiddenGroupIds);

    this.userAdminService.assignGroups(this.user.id, groupsToAssign).subscribe(() =>
      this.router.navigate(['admin', 'users', this.user.id], {
        queryParams: { assigned: selectedGroupIds.length, tab: 'Groups' },
      })
    );
  }

  onCancel() {
    this.router.navigate(['/admin/users', this.user.id], { queryParams: { tab: 'Groups' } });
  }

  ngOnDestroy() {
    this.headerService.showNavigation();
  }

  mapSecurityGroupsToUserGroups(groups: SecurityGroup[]): UserGroup[] {
    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      role: group.role?.displayName as string,
      displayState: group.role?.displayState as boolean,
    }));
  }
}
