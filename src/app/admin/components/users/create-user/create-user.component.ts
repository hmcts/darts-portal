import { CreateUpdateUserFormValues } from '@admin-types/index';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { CreateUpdateUserFormComponent } from './create-update-user-form/create-update-user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [GovukHeadingComponent, CreateUpdateUserFormComponent, ValidationErrorSummaryComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  router = inject(Router);

  onFormSubmit(formValues: CreateUpdateUserFormValues) {
    console.log('formValues', formValues);
  }
}
