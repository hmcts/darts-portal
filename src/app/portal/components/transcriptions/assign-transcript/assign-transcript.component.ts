import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { ConflictComponent } from '@components/error/conflict/conflict.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { ErrorMessageService } from '@services/error/error-message.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';

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
  luxonDatePipe = inject(LuxonDatePipe);
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
      this.caseNumber = data.caseNumber;
      this.hearingId = data.hearingId;
      this.caseId = data.caseId;
      this.startTime = this.luxonDatePipe.transform(data.transcriptionStartTs, 'HH:mm:ss');
      this.endTime = this.luxonDatePipe.transform(data.transcriptionEndTs, 'HH:mm:ss');
      this.getAudioQueryParams =
        this.startTime && this.endTime ? { startTime: this.startTime, endTime: this.endTime } : null;
    }),
    map((data: TranscriptionDetails) => {
      const hearingDate = this.luxonDatePipe.transform(data.hearingDate, 'dd MMM yyyy');
      const received = this.luxonDatePipe.transform(data.received, 'dd MMM yyyy HH:mm:ss');

      const vm = {
        reportingRestrictions: data.caseReportingRestrictions ?? [],
        caseDetails: {
          'Case ID': data.caseNumber,
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        hearingDetails: {
          'Hearing Date': hearingDate,
          'Request Type': data.requestType,
          'Request method': data.isManual ? 'Manual' : 'Automated',
          'Request ID': this.transcriptId,
          Urgency: data.urgency,
          'Audio for transcript':
            this.startTime && this.endTime ? `Start time ${this.startTime} - End time ${this.endTime}` : '',
          From: data.from,
          Received: received,
          Instructions: data.requestorComments,
          'Judge approval': 'Yes',
        },
        hearingId: data.hearingId,
        caseId: data.caseId,
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
