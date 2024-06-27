import { User } from '@admin-types/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { UserAdminService } from '@services/user-admin/user-admin.service';

@Component({
  selector: 'app-activate-user',
  standalone: true,
  imports: [GovukHeadingComponent],
  templateUrl: './activate-user.component.html',
  styleUrl: './activate-user.component.scss',
})
export class ActivateUserComponent {
  router = inject(Router);
  userAdminService = inject(UserAdminService);

  user = this.router.getCurrentNavigation()?.extras?.state?.user as User;

  activateUser() {
    this.userAdminService.activateUser(this.user.id).subscribe({
      next: () => {
        this.router.navigate(['/admin/users', this.user.id], { queryParams: { activated: true } });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.router.navigate(['/admin/users', this.user.id], { queryParams: { error: 409 } });
        }
      },
    });
  }
}
