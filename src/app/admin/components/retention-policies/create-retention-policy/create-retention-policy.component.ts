import { RetentionPolicyForm } from '@admin-types/index';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { RetentionPolicyFormComponent } from '../retention-policy-form/retention-policy-form.component';

export type CreatePolicyError =
  | 'NON_UNIQUE_POLICY_NAME'
  | 'NON_UNIQUE_POLICY_DISPLAY_NAME'
  | 'NON_UNIQUE_FIXED_POLICY_KEY';

@Component({
  selector: 'app-create-retention-policy',
  standalone: true,
  imports: [
    LoadingComponent,
    GovukHeadingComponent,
    RetentionPolicyFormComponent,
    AsyncPipe,
    ValidationErrorSummaryComponent,
    JsonPipe,
  ],
  templateUrl: './create-retention-policy.component.html',
  styleUrl: './create-retention-policy.component.scss',
})
export class CreateRetentionPolicyComponent implements OnInit {
  router = inject(Router);
  retentionPoliciesService = inject(RetentionPoliciesService);
  errors: ErrorSummaryEntry[] = [];
  error: CreatePolicyError | null = null;
  headerService = inject(HeaderService);

  policies$ = this.retentionPoliciesService.getRetentionPolicyTypes();

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onSubmitPolicy(policy: RetentionPolicyForm) {
    this.retentionPoliciesService.createRetentionPolicy(policy).subscribe({
      next: () => void this.router.navigate(['/admin/retention-policies'], { queryParams: { created: true } }),
      error: (res: HttpErrorResponse) => (this.error = res.error.type),
    });
  }
}
