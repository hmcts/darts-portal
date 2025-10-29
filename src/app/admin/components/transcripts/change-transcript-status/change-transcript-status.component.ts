import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { ChangeTranscriptErrorMessages } from '@constants/change-transcript-error-messages';
import { TranscriptStatus } from '@portal-types/index';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import {
  getUnfulfilledReason,
  REASON_DISPLAY,
  UnfulfilledReason,
} from 'src/app/admin/utils/unfulfilled-transcript.utils';

const UNFULFILLED_TRANSCRIPTION_STATUS_ID = 8;
@Component({
  selector: 'app-change-transcript-status',
  standalone: true,
  imports: [ReactiveFormsModule, GovukHeadingComponent, GovukTextareaComponent, AsyncPipe, RouterLink],
  templateUrl: './change-transcript-status.component.html',
  styleUrl: './change-transcript-status.component.scss',
})
export class ChangeTranscriptStatusComponent implements OnInit {
  private transcriptionService = inject(TranscriptionService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  errors: { fieldId: string; message: string }[] = [];

  transcriptId = Number(this.route.snapshot.params.transcriptionId);
  transcriptStatus: TranscriptStatus = this.route.snapshot.queryParams.status;
  isManual = this.route.snapshot.queryParams.manual === 'true';
  isSubmitted = false;

  statuses$ = this.transcriptionAdminService.getAllowableTranscriptionStatuses(this.transcriptStatus, this.isManual);

  REASON_DISPLAY = REASON_DISPLAY;

  readonly REASONS = Object.keys(this.REASON_DISPLAY) as UnfulfilledReason[];

  form = this.fb.group({
    status: ['', [Validators.required]],
    comments: [''],
  });

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  reasonControl = new FormControl<UnfulfilledReason | ''>('');
  detailsControl = new FormControl<string>('', [Validators.maxLength(200)]);
  statusControl = this.form.controls.status;

  get isUnfulfilled(): boolean {
    return Number(this.statusControl.value) === UNFULFILLED_TRANSCRIPTION_STATUS_ID;
  }

  get showOtherComment(): boolean {
    return this.isUnfulfilled && this.reasonControl.value === 'other';
  }

  private unfulfilledPayload(): string {
    const reason = this.reasonControl.value as UnfulfilledReason;
    const details = this.detailsControl.value?.trim();

    return getUnfulfilledReason(reason, details);
  }

  private unfulfillTranscript() {
    this.transcriptionService
      .unfulfillTranscriptionRequest(this.transcriptId, this.unfulfilledPayload())
      .subscribe(() => {
        this.transcriptionAdminService.fetchNewTranscriptions.set(true);
        this.router.navigate(['/admin/transcripts', this.transcriptId], { queryParams: { updatedStatus: true } });
      });
  }

  onSubmit() {
    this.isSubmitted = true;

    const statusId = Number(this.form.controls.status.value);
    const comments = String(this.form.controls.comments.value);

    // validate unfulfilled fields on submit
    this.applySubmitOnlyValidators();
    this.errors = this.buildErrors();

    if (this.form.invalid) return;

    if (this.isUnfulfilled) {
      if (this.reasonControl.invalid || this.detailsControl.invalid) {
        // Don't submit if reason or details are invalid
        return;
      }

      this.unfulfillTranscript();
      return;
    }

    if (this.errors.length) return;

    this.transcriptionAdminService.updateTranscriptionStatus(this.transcriptId, statusId, comments).subscribe(() => {
      this.transcriptionAdminService.fetchNewTranscriptions.set(true);
      this.router.navigate(['/admin/transcripts', this.transcriptId], { queryParams: { updatedStatus: true } });
    });
  }

  private applySubmitOnlyValidators(): void {
    // reason required when unfulfilled
    if (this.isUnfulfilled) {
      this.reasonControl.setValidators([Validators.required]);
    } else {
      this.reasonControl.clearValidators();
      this.reasonControl.setValue('', { emitEvent: false });
    }
    this.reasonControl.updateValueAndValidity({ emitEvent: false });

    // details required only when 'other'; maxlength already present
    const base = [Validators.maxLength(200)];
    if (this.isUnfulfilled && this.reasonControl.value === 'other') {
      this.detailsControl.setValidators([Validators.required, ...base]);
    } else {
      this.detailsControl.setValidators(base);
    }
    this.detailsControl.updateValueAndValidity({ emitEvent: false });
  }

  private buildErrors(): { fieldId: string; message: string }[] {
    const errs: { fieldId: string; message: string }[] = [];

    if (this.isUnfulfilled) {
      const reasonMsg = this.getErrorMessage('reason', this.reasonControl.errors);
      if (reasonMsg) errs.push({ fieldId: 'reason', message: reasonMsg });

      const detailsMsg = this.getErrorMessage('details', this.detailsControl.errors);
      if (detailsMsg) errs.push({ fieldId: 'details', message: detailsMsg });
    }

    return errs;
  }

  getErrorMessage<K extends keyof typeof ChangeTranscriptErrorMessages>(
    field: K,
    errors: ValidationErrors | null | undefined
  ): string | null {
    if (!errors) return null;
    const map = ChangeTranscriptErrorMessages[field];
    // Show the first defined message for any present error key
    for (const key of Object.keys(errors)) {
      const msg = (map as Record<string, string | undefined>)[key];
      if (msg) return msg;
    }
    return null;
  }
}
