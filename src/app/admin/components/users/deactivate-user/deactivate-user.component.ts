import { SecurityGroup, User } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { GroupsService } from '@services/groups/groups.service';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-deactivate-user',
  standalone: true,
  imports: [GovukHeadingComponent, AsyncPipe, LoadingComponent],
  templateUrl: './deactivate-user.component.html',
  styleUrl: './deactivate-user.component.scss',
})
export class DeactivateUserComponent {
  router = inject(Router);
  userAdminService = inject(UserAdminService);
  groupsService = inject(GroupsService);
  headerService = inject(HeaderService);

  user = this.router.getCurrentNavigation()?.extras?.state?.user as User;

  isSuperAdminError = signal(false);

  groups$ = this.groupsService.getGroupsWhereUserIsTheOnlyMember(this.user.id).pipe(
    tap((groups) => {
      if (this.doesGroupsContainSuperAdmin(groups)) {
        this.isSuperAdminError.set(true);
      }
    })
  );

  constructor() {
    effect(() => {
      if (this.isSuperAdminError()) {
        this.headerService.hideNavigation();
      }
    });
  }

  deactivateUser() {
    this.userAdminService.deactivateUser(this.user.id).subscribe((rolledBackTranscriptRequestIds) => {
      this.router.navigate(['/admin/users', this.user.id], {
        queryParams: { deactivated: true, rolledBackTranscriptRequestIds },
      });
    });
  }

  doesGroupsContainSuperAdmin(groups: SecurityGroup[]) {
    return groups.some((group) => group.name === 'SUPER_ADMIN');
  }
}
