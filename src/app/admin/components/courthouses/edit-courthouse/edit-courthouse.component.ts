import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { CreateUpdateCourthouseFormComponent } from '../create-courthouse/create-update-courthouse-form/create-update-courthouse-form.component';
import { CourthouseService } from '@services/courthouses/courthouses.service';

@Component({
  selector: 'app-edit-courthouse',
  standalone: true,
  imports: [
    CreateUpdateCourthouseFormComponent,
    ValidationErrorSummaryComponent,
    GovukHeadingComponent,
    GovukBannerComponent,
  ],
  templateUrl: './edit-courthouse.component.html',
  styleUrl: './edit-courthouse.component.scss',
})
export class EditCourthouseComponent implements OnInit {
  router = inject(Router);
  courthouseService = inject(CourthouseService);

  courthouse: Courthouse = this.router.getCurrentNavigation()?.extras?.state?.courthouse ?? null;

  errors: ErrorSummaryEntry[] = [];

  showEmailChangeConfirmation = false;

  updateCourthouse!: CreateUpdateCourthouseFormValues;

  ngOnInit(): void {
    if (!this.courthouse) {
      this.router.navigate(['/admin/courthouses']);
    }
  }

  onSubmit(formValues: CreateUpdateCourthouseFormValues) {
    this.updateCourthouse = formValues;

    this.saveCourthouse();
  }

  saveCourthouse() {
    this.courthouseService.updateCourthouse(this.courthouse.id, this.updateCourthouse).subscribe((courthouse) => {
      this.router.navigate(['/admin/courthouses', courthouse.id], { queryParams: { updated: true } });
    });
  }

  onCancel() {
    this.router.navigate(['/admin/courthouses', this.courthouse.id]);
  }
}
