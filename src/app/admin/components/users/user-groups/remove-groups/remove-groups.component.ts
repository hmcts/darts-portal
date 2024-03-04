import { SecurityGroup, User } from '@admin-types/index';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';

@Component({
  selector: 'app-remove-groups',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './remove-groups.component.html',
  styleUrl: './remove-groups.component.scss',
})
export class RemoveGroupsComponent {
  router = inject(Router);
  userAdminService = inject(UserAdminService);
  HeaderService = inject(HeaderService);

  user = this.router.getCurrentNavigation()?.extras?.state?.user as User;
  selectedGroups = this.router.getCurrentNavigation()?.extras?.state?.selectedGroups as SecurityGroup[];

  constructor() {
    if (!this.user?.securityGroups || !this.selectedGroups) {
      this.router.navigate(['/admin/users']);
    }
  }

  getUpdatedSecurityGroupIds(): number[] {
    const idsToRemove = this.selectedGroups.map((group) => group.id);
    const usersCurrentGroupsIds = this.user.securityGroups!.map((group) => group.id);
    const updatedSecurityGroupIds = usersCurrentGroupsIds.filter((id) => !idsToRemove.includes(id));

    return updatedSecurityGroupIds;
  }

  removeGroups() {
    this.userAdminService.assignGroups(this.user.id, this.getUpdatedSecurityGroupIds()).subscribe(() =>
      this.router.navigate(['/admin/users', this.user.id], {
        queryParams: { groupsRemoved: this.selectedGroups.length, tab: 'Groups' },
      })
    );
  }

  onCancel() {
    this.router.navigate(['/admin/users', this.user.id], { queryParams: { tab: 'Groups' } });
  }
}
