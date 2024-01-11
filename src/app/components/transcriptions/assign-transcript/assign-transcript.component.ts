import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { ErrorMessageService } from '@services/error/error-message.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { ConflictComponent } from './../../error/conflict/conflict.component';

@Component({
  selector: 'app-assign-transcript',
  standalone: true,
  imports: [
    CommonModule,
    GovukHeadingComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    RouterLink,
    DetailsTableComponent,
    ReportingRestrictionComponent,
    ReactiveFormsModule,
    ValidationErrorSummaryComponent,
    ConflictComponent,
  ],
  templateUrl: './assign-transcript.component.html',
  styleUrl: './assign-transcript.component.scss',
})
export class AssignTranscriptComponent implements OnDestroy {
  readonly ASSIGN_TO_ME = 'assignToMe';
  readonly ASSIGN_GET_AUDIO = 'assignToMeAndGetAudio';
  readonly ASSIGN_UPLOAD = 'assignToMeAndUploadATranscript';

  transcriptId = inject(ActivatedRoute).snapshot.params.transcriptId;
  transcriptionService = inject(TranscriptionService);
  datePipe = inject(DatePipe);
  router = inject(Router);
  errorMsgService = inject(ErrorMessageService);
  hearingId: number | null = null;
  caseId: number | null = null;
  startTime: string | null = null;
  endTime: string | null = null;
  caseNumber: string | null = null;
  getAudioQueryParams: { startTime: string; endTime: string } | null = null;
  isSubmitted = false;
  errors: { fieldId: string; message: string }[] = [];
  error$ = this.errorMsgService.errorMessage$;

  selectedOption = new FormControl<string | null>(null, [Validators.required]);

  vm$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId).pipe(
    tap((data: TranscriptionDetails) => {
      this.caseNumber = data.case_number;
      this.hearingId = data.hearing_id;
      this.caseId = data.case_id;
      this.startTime = this.datePipe.transform(data.transcription_start_ts, 'HH:mm:ss');
      this.endTime = this.datePipe.transform(data.transcription_end_ts, 'HH:mm:ss');
      this.getAudioQueryParams =
        this.startTime && this.endTime ? { startTime: this.startTime, endTime: this.endTime } : null;
    }),
    map((data: TranscriptionDetails) => {
      const hearingDate = this.datePipe.transform(data.hearing_date, 'dd MMM yyyy');
      const received = this.datePipe.transform(data.received, 'dd MMM yyyy HH:mm:ss');

      const vm = {
        reportingRestrictions: data.reporting_restrictions ?? [],
        caseDetails: {
          'Case ID': data.case_number,
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        hearingDetails: {
          'Hearing Date': hearingDate,
          'Request Type': data.request_type,
          'Request method': data.is_manual ? 'Manual' : 'Automated',
          'Request ID': this.transcriptId,
          Urgency: data.urgency,
          'Audio for transcript':
            this.startTime && this.endTime ? `Start time ${this.startTime} - End time ${this.endTime}` : '',
          From: data.from,
          Received: received,
          Instructions: data.requestor_comments,
          'Judge approval': 'Yes',
        },
        hearingId: data.hearing_id,
        caseId: data.case_id,
      };

      return vm;
    })
  );

  onAssignTranscript() {
    this.isSubmitted = true;

    if (this.selectedOption.invalid) {
      this.errors = [{ fieldId: 'transcriptionOptions', message: 'Select an action to progress this request.' }];
      return;
    }

    this.transcriptionService.assignTranscript(this.transcriptId).subscribe(() => {
      if (this.selectedOption.value === this.ASSIGN_TO_ME) {
        this.router.navigate(['/work']);
        return;
      }

      if (this.selectedOption.value === this.ASSIGN_GET_AUDIO) {
        this.router.navigate(['/case', this.caseId, 'hearing', this.hearingId], {
          queryParams: this.getAudioQueryParams,
        });
        return;
      }

      if (this.selectedOption.value === this.ASSIGN_UPLOAD) {
        this.router.navigate(['/work', this.transcriptId]);
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }
}
