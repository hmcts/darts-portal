import { CreateUpdateUserFormValues, User } from '@admin-types/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { EMPTY, catchError } from 'rxjs';
import { CreateUpdateUserFormComponent } from '../create-user/create-update-user-form/create-update-user-form.component';
import { EditEmailConfirmationComponent } from './edit-email-confirmation/edit-email-confirmation.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CreateUpdateUserFormComponent,
    ValidationErrorSummaryComponent,
    GovukHeadingComponent,
    EditEmailConfirmationComponent,
    GovukBannerComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  router = inject(Router);
  userAdminService = inject(UserAdminService);

  user: User = this.router.getCurrentNavigation()?.extras?.state?.user ?? null;

  errors: ErrorSummaryEntry[] = [];

  showEmailChangeConfirmation = false;

  updatedUser!: CreateUpdateUserFormValues;

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/admin/users']);
    }
  }

  isEmailChanged() {
    return this.updatedUser && this.user.emailAddress !== this.updatedUser.email;
  }

  onSubmit(formValues: CreateUpdateUserFormValues) {
    this.updatedUser = formValues;

    if (this.isEmailChanged()) {
      this.showEmailChangeConfirmation = true;
    } else {
      this.saveUser();
    }
  }

  saveUser() {
    this.userAdminService
      .updateUser(this.user.id, this.updatedUser)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.showEmailChangeConfirmation = false;
          }
          return EMPTY;
        })
      )
      .subscribe((user) => {
        this.router.navigate(['/admin/users', user.id], { queryParams: { updated: true } });
      });
  }

  onCancel() {
    this.router.navigate(['/admin/users', this.user.id]);
  }
}
