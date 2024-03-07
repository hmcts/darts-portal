import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { CreateUpdateCourthouseConfirmationComponent } from './create-update-courthouse-confirmation/create-update-courthouse-confirmation.component';
import { CreateUpdateCourthouseFormComponent } from './create-update-courthouse-form/create-update-courthouse-form.component';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { combineLatest } from 'rxjs';
import { LoadingComponent } from '@common/loading/loading.component';

@Component({
  selector: 'app-create-courthouse',
  standalone: true,
  imports: [
    GovukHeadingComponent,
    CreateUpdateCourthouseFormComponent,
    ValidationErrorSummaryComponent,
    CreateUpdateCourthouseConfirmationComponent,
    JsonPipe,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './create-courthouse.component.html',
  styleUrl: './create-courthouse.component.scss',
})
export class CreateCourthouseComponent {
  router = inject(Router);
  headerService = inject(HeaderService);
  courthouseService = inject(CourthouseService);
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

  formValues: CreateUpdateCourthouseFormValues = {
    courthouseName: null,
    displayName: null,
    regionId: null,
    securityGroupIds: [],
  };
  regions$ = this.courthouseService.getCourthouseRegions();
  companies$ = this.courthouseService.getCourthouseTranscriptionCompanies();

  vm$ = combineLatest({
    regions: this.regions$,
    companies: this.companies$,
  });

  onSubmit(formValues: CreateUpdateCourthouseFormValues) {
    this.formValues = formValues;
    this.isConfirmation = true;
  }

  onConfirmCourthouseDetails() {
    this.courthouseService.createCourthouse(this.formValues!).subscribe((courthouse) => {
      this.router.navigate(['/admin/courthouses', courthouse.id], { queryParams: { newCourthouse: true } });

      // TODO: Unhappy path
    });
  }

  onBack() {
    this.isConfirmation = false;
  }

  onCancel() {
    this.router.navigate(['/admin/courthouses']);
  }
}
