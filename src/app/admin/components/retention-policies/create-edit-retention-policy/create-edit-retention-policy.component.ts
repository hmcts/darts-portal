import { RetentionPolicyForm } from '@admin-types/index';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { RetentionPolicyErrorCode } from '@constants/retention-policy-error-codes';
import { ErrorSummaryEntry } from '@core-types/index';
import { HeaderService } from '@services/header/header.service';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { RetentionPolicyFormComponent } from '../retention-policy-form/retention-policy-form.component';

export type RetentionFormContext = 'create' | 'edit' | 'create-revision' | 'edit-revision';
@Component({
  selector: 'app-create-edit-retention-policy',
  standalone: true,
  imports: [
    LoadingComponent,
    GovukHeadingComponent,
    RetentionPolicyFormComponent,
    AsyncPipe,
    ValidationErrorSummaryComponent,
  ],
  templateUrl: './create-edit-retention-policy.component.html',
  styleUrl: './create-edit-retention-policy.component.scss',
})
export class CreateEditRetentionPolicyComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);
  retentionPoliciesService = inject(RetentionPoliciesService);

  context = this.getContextFromUrl(this.router.url);
  policyId = this.route.snapshot.params?.id;
  title = '';
  errors: ErrorSummaryEntry[] = [];
  error: RetentionPolicyErrorCode | null = null;
  isCreateRevision = this.context === 'create-revision';
  isCreate = this.context === 'create';
  retentionPoliciesPath = 'admin/system-configuration/retention-policies';

  policies$ = this.retentionPoliciesService.getRetentionPolicyTypes();

  ngOnInit(): void {
    this.headerService.hideNavigation();
    this.title = this.getTitle(this.context);
  }

  onSubmitPolicy(policy: RetentionPolicyForm) {
    this.error = null;
    if (this.isCreate || this.isCreateRevision) {
      this.createRetentionPolicyAndRedirect(policy);
    } else {
      this.editRetentionPolicyAndRedirect(policy);
    }
  }

  private handleError = (res: HttpErrorResponse) => (this.error = res.error.type);

  private createRetentionPolicyAndRedirect(policy: RetentionPolicyForm) {
    const queryParams = this.isCreateRevision ? { revised: true } : { created: true };

    this.retentionPoliciesService.createRetentionPolicy(policy, this.isCreateRevision).subscribe({
      next: () => void this.router.navigate([this.retentionPoliciesPath], { queryParams }),
      error: this.handleError,
    });
  }

  private editRetentionPolicyAndRedirect(policy: RetentionPolicyForm) {
    this.retentionPoliciesService.editRetentionPolicy(policy, this.policyId).subscribe({
      next: () => void this.router.navigate([this.retentionPoliciesPath], { queryParams: { updated: true } }),
      error: this.handleError,
    });
  }

  private getTitle(context: RetentionFormContext): string {
    switch (context) {
      case 'create':
        return 'Create new policy';
      case 'edit':
        return 'Edit policy';
      case 'create-revision':
        return 'Create new version';
      case 'edit-revision':
        return 'Edit policy';
    }
  }

  private getContextFromUrl(url: string): RetentionFormContext {
    // Context can be derived from the end of the url
    // .../create || .../id/edit || .../id/edit-revision || .../id/create-revision'
    return url.split('/').pop()?.split('?')[0] as RetentionFormContext;
  }
}
