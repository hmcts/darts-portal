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
import { UnfullfillTranscriptComponent } from 'src/app/portal/components/transcriptions/unfulfill-transcript/unfulfill-transcript.component';
import {
  applyUnfulfilledValidators,
  buildUnfulfilledErrors,
  ErrorMessages,
  firstError,
} from 'src/app/admin/utils/unfulfilled-form.util';
import {
  getUnfulfilledReason,
  REASON_DISPLAY,
  UNFULFILLED_STATUS_ID,
  UnfulfilledReason,
} from 'src/app/admin/utils/unfulfilled-transcript.utils';

@Component({
  selector: 'app-change-transcript-status',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GovukHeadingComponent,
    GovukTextareaComponent,
    AsyncPipe,
    RouterLink,
    UnfullfillTranscriptComponent,
  ],
  templateUrl: './change-transcript-status.component.html',
  styleUrl: './change-transcript-status.component.scss',
})
export class ChangeTranscriptStatusComponent implements OnInit {
  transcriptionService = inject(TranscriptionService);
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

  reasonControl = new FormControl<UnfulfilledReason | ''>('', { nonNullable: true });
  detailsControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(200)] });
  statusControl = this.form.controls.status;

  get isUnfulfilled(): boolean {
    return Number(this.statusControl.value) === UNFULFILLED_STATUS_ID;
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
    applyUnfulfilledValidators(this.isUnfulfilled, this.reasonControl, this.detailsControl, 200);
  }

  private buildErrors(): { fieldId: string; message: string }[] {
    return buildUnfulfilledErrors(
      ChangeTranscriptErrorMessages as ErrorMessages,
      this.isUnfulfilled,
      this.reasonControl.errors,
      this.detailsControl.errors
    );
  }

  getErrorMessage(field: 'reason' | 'details', errors: ValidationErrors | null | undefined): string | null {
    return firstError(ChangeTranscriptErrorMessages as ErrorMessages, field, errors);
  }

  onStatusChanged(): void {
    const statusId = Number(this.statusControl.value);
    if (statusId !== UNFULFILLED_STATUS_ID) {
      // clear unfulfilled controls when switching away from unfulfilled
      this.reasonControl.setValue('', { emitEvent: false });
      this.detailsControl.setValue('', { emitEvent: false });
    }
  }
}
