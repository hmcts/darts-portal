import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { FileUploadComponent } from '@common/file-upload/file-upload.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TranscriptionDetails } from '@darts-types/index';

import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-upload-transcript',
  standalone: true,
  imports: [
    DetailsTableComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
    GovukHeadingComponent,
    FileUploadComponent,
    ReportingRestrictionComponent,
    ValidationErrorSummaryComponent,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './upload-transcript.component.html',
  styleUrl: './upload-transcript.component.scss',
})
export class UploadTranscriptComponent {
  transcriptionService = inject(TranscriptionService);
  requestId = inject(ActivatedRoute).snapshot.params.requestId;
  router = inject(Router);
  datePipe = inject(DatePipe);

  isManualRequest = false;

  vm$ = this.transcriptionService.getTranscriptionDetails(this.requestId).pipe(
    tap((data: TranscriptionDetails) => (this.isManualRequest = data.is_manual)),
    map((data: TranscriptionDetails) => {
      const hearingDate = this.datePipe.transform(data.hearing_date, 'dd MMM yyyy');
      const startTime = this.datePipe.transform(data.transcription_start_ts, 'HH:mm:ss');
      const endTime = this.datePipe.transform(data.transcription_end_ts, 'HH:mm:ss');
      const received = this.datePipe.transform(data.received, 'dd MMM yyyy HH:mm:ss');

      const vm = {
        reportingRestriction: data.reporting_restriction || null,
        caseDetails: {
          'Case ID': data.case_number,
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        hearingDetails: {
          'Hearing Date': hearingDate,
          'Request Type': data.request_type,
          'Request ID': this.requestId,
          'Request method': data.is_manual ? 'Manual' : 'Automated',
          Urgency: data.urgency,
          'Audio for transcript': `Start time ${startTime} - End time ${endTime}`,
          From: data.from,
          Received: received,
          Instructions: data.requestor_comments,
          'Judge approval': 'Yes',
        },
        startTime,
        endTime,
        hearingId: data.hearing_id,
        caseId: data.case_id,
      };

      return vm;
    })
  );

  fileControl = new FormControl<File | null>(null, [Validators.required]);

  onComplete() {
    if (this.fileControl.invalid && this.isManualRequest) {
      return;
    }
    if (this.isManualRequest) {
      this.transcriptionService.uploadTranscript(this.requestId, this.fileControl.value!).subscribe(() => {
        this.goToCompletedScreen();
      });
    } else {
      this.transcriptionService.completeTranscriptionRequest(this.requestId).subscribe(() => {
        this.goToCompletedScreen();
      });
    }
  }

  private goToCompletedScreen() {
    this.router.navigate(['/work', this.requestId, 'complete']);
  }
}
