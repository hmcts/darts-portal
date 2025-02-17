import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { HeaderService } from '@services/header/header.service';
import { combineLatest } from 'rxjs';
import { CreateUpdateCourthouseConfirmationComponent } from '../create-courthouse/create-update-courthouse-confirmation/create-update-courthouse-confirmation.component';
import { CreateUpdateCourthouseFormComponent } from '../create-courthouse/create-update-courthouse-form/create-update-courthouse-form.component';

@Component({
  selector: 'app-edit-courthouse',
  standalone: true,
  imports: [
    CreateUpdateCourthouseFormComponent,
    CreateUpdateCourthouseConfirmationComponent,
    ValidationErrorSummaryComponent,
    GovukHeadingComponent,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './edit-courthouse.component.html',
  styleUrl: './edit-courthouse.component.scss',
})
export class EditCourthouseComponent implements OnInit {
  router = inject(Router);
  headerService = inject(HeaderService);
  courthouseService = inject(CourthouseService);

  courthouse: Courthouse = this.router.getCurrentNavigation()?.extras?.state?.courthouse ?? null;

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

  updateCourthouse!: CreateUpdateCourthouseFormValues;
  regions$ = this.courthouseService.getCourthouseRegions();
  companies$ = this.courthouseService.getCourthouseTranscriptionCompanies();

  vm$ = combineLatest({
    regions: this.regions$,
    companies: this.companies$,
  });

  ngOnInit(): void {
    if (!this.courthouse) {
      this.router.navigate(['/admin/courthouses']);
    }
  }

  onSubmit(formValues: CreateUpdateCourthouseFormValues) {
    this.updateCourthouse = formValues;
    this.isConfirmation = true;
  }

  onBack() {
    this.isConfirmation = false;
  }

  saveCourthouse() {
    const updateCourthouse = { ...this.updateCourthouse };
    if (this.courthouse.hasData) delete updateCourthouse.courthouseName;
    if (!updateCourthouse.regionId) delete updateCourthouse.regionId;
    this.courthouseService.updateCourthouse(this.courthouse.id, updateCourthouse).subscribe((courthouse) => {
      this.router.navigate(['/admin/courthouses', courthouse.id], { queryParams: { updated: true } });
    });
  }

  getSecurityGroupIds(securityGroups: SecurityGroup[] | undefined) {
    return securityGroups?.map((securityGroup) => securityGroup.id.toString()) ?? [];
  }

  onCancel() {
    this.router.navigate(['/admin/courthouses', this.courthouse.id]);
  }
}
