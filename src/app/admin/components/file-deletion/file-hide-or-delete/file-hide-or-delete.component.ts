import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { HiddenReason } from '@admin-types/hidden-reasons/hidden-reason';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { FileHideOrDeleteFormErrorMessages } from '@constants/file-hide-or-delete-error-messages';
import { FormService } from '@services/form/form.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { map } from 'rxjs';
import { FileHideOrDeleteSuccessComponent } from '../file-hide-or-delete-success/file-hide-or-delete-success.component';

@Component({
  selector: 'app-file-hide-or-delete',
  standalone: true,
  templateUrl: './file-hide-or-delete.component.html',
  styleUrl: './file-hide-or-delete.component.scss',
  imports: [
    GovukHeadingComponent,
    GovukTextareaComponent,
    ReactiveFormsModule,
    CommonModule,
    ValidationErrorSummaryComponent,
    FileHideOrDeleteSuccessComponent,
  ],
})
export class FileHideOrDeleteComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  formService = inject(FormService);

  fileType = this.router.getCurrentNavigation()?.extras?.state?.fileType ?? null;
  id = +this.route.snapshot.params.id;

  isSubmitted = false;
  continueLink = this.getContinueLink();

  reasons$ = this.transcriptionAdminService
    .getHiddenReasons()
    .pipe(map((reasons) => this.sortAndFilterReasons(reasons)));

  form = this.fb.group({
    ticketReference: ['', [Validators.required, Validators.maxLength(256)]],
    comments: ['', [Validators.required, Validators.maxLength(256)]],
    reason: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.transcriptionAdminService
        .hideTranscriptionDocument(this.id, {
          ...this.form.value,
          reason: Number(this.form.value.reason),
        } as FileHideOrDeleteFormValues)
        .subscribe(() => {
          this.isSubmitted = true;
        });
    }
  }

  private getContinueLink() {
    if (this.fileType === 'transcription_document') {
      return `/admin/transcripts/document/${this.id}`;
    } else if (this.fileType === 'audio_file') {
      // TODO: Add back link for Audio file when it exists
      return '';
    } else {
      return '/admin';
    }
  }

  goBack() {
    this.router.navigate([this.continueLink]);
  }

  getErrorMessages(controlKey: string): string[] {
    return this.formService.getFormControlErrorMessages(this.form, controlKey, FileHideOrDeleteFormErrorMessages);
  }

  isControlInvalid(control: string) {
    return this.form.get(control)?.invalid && this.form.get(control)?.touched;
  }

  getErrorSummary() {
    return this.formService.getUniqueErrorSummary(this.form, FileHideOrDeleteFormErrorMessages);
  }

  // Only return reasons that are marked for display, and sort based on display order
  private sortAndFilterReasons(reasons: HiddenReason[]): HiddenReason[] {
    return reasons.filter((reason) => reason.displayState).sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
