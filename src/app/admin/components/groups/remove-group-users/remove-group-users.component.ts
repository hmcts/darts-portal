import { User } from '@admin-types/index';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GroupsService } from '@services/groups/groups.service';

@Component({
  selector: 'app-remove-group-users',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './remove-group-users.component.html',
  styleUrl: './remove-group-users.component.scss',
})
export class RemoveGroupUsersComponent implements OnInit {
  router = inject(Router);
  groupService = inject(GroupsService);
  route = inject(ActivatedRoute);

  groupId = +this.route.snapshot.params.id;

  groupUsers: User[] = this.router.getCurrentNavigation()?.extras?.state?.groupUsers;
  userIdsToRemove: number[] = this.router.getCurrentNavigation()?.extras?.state?.userIdsToRemove;

  ngOnInit(): void {
    if (!this.groupUsers || !this.userIdsToRemove) {
      this.cancel();
    }
  }

  removeUsers() {
    const userIds = this.groupUsers.map((user) => user.id).filter((id) => !this.userIdsToRemove.includes(id));

    // remove users from group and navigate back
    this.groupService.assignUsersToGroup(this.groupId, userIds).subscribe(() => {
      this.router.navigate(['/admin/groups', this.groupId], {
        queryParams: { tab: 'Users', removedUsers: this.userIdsToRemove.length },
      });
    });
  }

  cancel() {
    this.router.navigate(['/admin/groups', this.groupId], { queryParams: { tab: 'Users' } });
  }
}
