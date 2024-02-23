import { CreateUpdateUserFormValues } from '@admin-types/index';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { UserAdminService } from '@services/user-admin.service';
import { CreateUpdateUserConfirmationComponent } from './create-update-user-confirmation/create-update-user-confirmation.component';
import { CreateUpdateUserFormComponent } from './create-update-user-form/create-update-user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    CreateUpdateUserFormComponent,
    ValidationErrorSummaryComponent,
    CreateUpdateUserConfirmationComponent,
    JsonPipe,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  router = inject(Router);
  headerService = inject(HeaderService);
  userAdminService = inject(UserAdminService);
  errors: ErrorSummaryEntry[] = [];

  private _isConfirmation = false;
  public get isConfirmation() {
    return this._isConfirmation;
  }
  public set isConfirmation(value) {
    this._isConfirmation = value;
    if (value) {
      this.headerService.hideNavigation();
    } else {
      this.headerService.showNavigation();
    }
  }

  formValues: CreateUpdateUserFormValues = { fullName: null, email: null, description: null };

  onSubmit(formValues: CreateUpdateUserFormValues) {
    this.formValues = formValues;
    this.isConfirmation = true;
  }

  onConfirmUserDetails() {
    this.userAdminService.createUser(this.formValues!).subscribe((user) => {
      this.router.navigate(['/admin/users', user.id], { queryParams: { newUser: true } });

      //TO DO: Unhappy path
    });
  }

  onBack() {
    this.isConfirmation = false;
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
