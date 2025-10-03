import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTextareaComponent } from '@common/govuk-textarea/govuk-textarea.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { UploadTranscriptErrorMessages } from '@constants/upload-transcript-error-messages';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { maxFileSizeValidator } from '@validators/max-file-size.validator';
import { map } from 'rxjs/internal/operators/map';

type Outcome = 'complete' | 'unfulfilled';
type UnfulfilledReason = 'inaudible' | 'no_audio' | 'one_second' | 'other';

@Component({
  selector: 'app-upload-transcript',
  standalone: true,
  imports: [
    DetailsTableComponent,
    GovukTextareaComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    GovukHeadingComponent,
    FileUploadComponent,
    ReportingRestrictionComponent,
    ValidationErrorSummaryComponent,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    LoadingComponent,
  ],
  templateUrl: './upload-transcript.component.html',
  styleUrl: './upload-transcript.component.scss',
})
export class UploadTranscriptComponent implements OnDestroy {
  private transcriptionService = inject(TranscriptionService);
  private headerService = inject(HeaderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  requestId = inject(ActivatedRoute).snapshot.params.requestId;
  datePipe = inject(DatePipe);
  luxonPipe = inject(LuxonDatePipe);
  errors: { fieldId: string; message: string }[] = [];

  UploadTranscriptErrorMessages = UploadTranscriptErrorMessages;

  isManualRequest = false;
  isSubmitted = false;
  isUploading = false;
  requestStatus: 'TO_DO' | 'COMPLETED' = this.router.getCurrentNavigation()?.extras?.state?.requestStatus;

  REASON_DISPLAY: Record<UnfulfilledReason, string> = {
    inaudible: 'Inaudible / unintelligible',
    no_audio: 'No audio / white noise',
    one_second: 'Audio is 1 second',
    other: 'Other',
  } as const;

  readonly REASONS = Object.keys(this.REASON_DISPLAY) as UnfulfilledReason[];

  vm$ = this.transcriptionService.getTranscriptionDetails(this.requestId).pipe(
    map((data: TranscriptionDetails) => {
      this.isManualRequest = data.isManual;
      return {
        status: data.status,
        ...this.transcriptionService.getAssignDetailsFromTranscript(data),
        getAudioQueryParams:
          data.transcriptionStartTs && data.transcriptionEndTs
            ? {
                startTime: this.luxonPipe.transform(data.transcriptionStartTs, 'HH:mm:ss'),
                endTime: this.luxonPipe.transform(data.transcriptionEndTs, 'HH:mm:ss'),
              }
            : null,
      };
    })
  );

  fileControl = new FormControl<File | null>(null);
  outcomeControl = new FormControl<Outcome>('complete', { nonNullable: true });
  reasonControl = new FormControl<UnfulfilledReason | ''>('');
  detailsControl = new FormControl<string>('', [Validators.maxLength(200)]);

  form: FormGroup = this.fb.group({
    outcome: this.outcomeControl,
    file: this.fileControl,
    reason: this.reasonControl,
    details: this.detailsControl,
  });

  get isUnfulfilled(): boolean {
    return this.outcomeControl.value === 'unfulfilled';
  }

  get submitLabel(): string {
    return this.isUnfulfilled
      ? 'Mark as unfulfilled'
      : this.isManualRequest
        ? 'Attach file and complete'
        : 'Complete transcript request';
  }

  valueChangeSub = this.fileControl.valueChanges.subscribe(() => {
    if (this.isSubmitted) {
      if (this.fileControl.errors?.required) {
        this.errors = [{ fieldId: 'file-upload-1', message: this.UploadTranscriptErrorMessages.file.required }];
        return;
      }
      if (this.fileControl.errors?.maxFileSize) {
        this.errors = [{ fieldId: 'file-upload-1', message: this.UploadTranscriptErrorMessages.file.maxFileSize }];
        return;
      }
      this.errors = [];
    }
  });

  private syncFileValidators(): void {
    // Required only when completing a MANUAL request
    const shouldRequire = this.outcomeControl.value === 'complete' && this.isManualRequest;
    const validators = shouldRequire ? [Validators.required, maxFileSizeValidator(10)] : [maxFileSizeValidator(10)];
    this.fileControl.setValidators(validators);
    this.fileControl.updateValueAndValidity({ emitEvent: false });
  }

  private buildErrors(): { fieldId: string; message: string }[] {
    const errs: { fieldId: string; message: string }[] = [];

    if (!this.isUnfulfilled && this.isManualRequest) {
      const fileMsg = this.getErrorMessage('file', this.fileControl.errors);
      if (fileMsg) errs.push({ fieldId: 'file-upload-1', message: fileMsg });
    }

    if (this.isUnfulfilled) {
      const reasonMsg = this.getErrorMessage('reason', this.reasonControl.errors);
      if (reasonMsg) errs.push({ fieldId: 'reason', message: reasonMsg });

      const detailsMsg = this.getErrorMessage('details', this.detailsControl.errors);
      if (detailsMsg) errs.push({ fieldId: 'details', message: detailsMsg });
    }

    return errs;
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

  onOutcomeChanged(): void {
    this.syncFileValidators();
    if (this.isUnfulfilled) {
      // avoid accidental upload; also clears any file errors
      this.fileControl.setValue(null, { emitEvent: false });
    }
    if (this.isSubmitted) this.errors = this.buildErrors();
  }

  onComplete() {
    this.isSubmitted = true;

    // ensure file validators reflect current outcome/manual state
    this.syncFileValidators();
    this.fileControl.updateValueAndValidity({ emitEvent: false });

    // validate unfulfilled fields on submit
    this.applySubmitOnlyValidators();

    this.fileControl.updateValueAndValidity();

    if (this.fileControl.invalid && this.isManualRequest) {
      return;
    }

    this.errors = this.buildErrors();

    if (this.errors.length) return;

    this.isUploading = true;

    if (this.isUnfulfilled) return this.unfulfillTranscript();

    return this.isManualRequest ? this.uploadTranscript() : this.completeTranscript();
  }

  private buildUnfulfilledReason(): string {
    const reason = this.reasonControl.value as UnfulfilledReason;
    const details = this.detailsControl.value?.trim();

    const workflow_comment =
      reason === 'other'
        ? 'Other - ' + (details ?? '') // Details is required if 'other'
        : this.REASON_DISPLAY[reason];

    return workflow_comment;
  }

  private unfulfillTranscript() {
    this.transcriptionService
      .unfulfillTranscriptionRequest(this.requestId, this.buildUnfulfilledReason())
      .subscribe(() => {
        this.goToScreen('unfulfilled');
        this.isUploading = false;
      });
  }

  private completeTranscript() {
    this.transcriptionService.completeTranscriptionRequest(this.requestId).subscribe(() => {
      this.goToScreen('complete');
      this.isUploading = false;
    });
  }

  private uploadTranscript() {
    this.transcriptionService.uploadTranscript(this.requestId, this.fileControl.value!).subscribe({
      next: () => {
        this.goToScreen('complete');
      },
      error: () => {
        this.router.navigate(['/internal-error']);
        setTimeout(() => this.headerService.hideNavigation(), 0);
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  private goToScreen(outcome: Outcome) {
    this.router.navigate(['/work', this.requestId, outcome]);
  }

  ngOnDestroy() {
    this.valueChangeSub.unsubscribe();
  }

  getErrorMessage<K extends keyof typeof UploadTranscriptErrorMessages>(
    field: K,
    errors: ValidationErrors | null | undefined
  ): string | null {
    if (!errors) return null;
    const map = UploadTranscriptErrorMessages[field];
    // Show the first defined message for any present error key
    for (const key of Object.keys(errors)) {
      const msg = (map as Record<string, string | undefined>)[key];
      if (msg) return msg;
    }
    return null;
  }
}
