import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { map, tap } from 'rxjs';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';

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
  ],
  templateUrl: './assign-transcript.component.html',
  styleUrl: './assign-transcript.component.scss',
})
export class AssignTranscriptComponent {
  transcriptId = inject(ActivatedRoute).snapshot.params.transcriptId;
  transcriptionService = inject(TranscriptionService);
  datePipe = inject(DatePipe);
  caseNumber!: string;

  vm$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId).pipe(
    tap((data: TranscriptionDetails) => (this.caseNumber = data.case_number)),
    map((data: TranscriptionDetails) => {
      const hearingDate = this.datePipe.transform(data.hearing_date, 'dd MMM yyyy');
      const startTime = this.datePipe.transform(data.transcription_start_ts, 'HH:mm:ss');
      const endTime = this.datePipe.transform(data.transcription_end_ts, 'HH:mm:ss');
      const received = this.datePipe.transform(data.received, 'dd MMM yyyy HH:mm:ss');

      const vm = {
        reportingRestriction: data.reporting_restriction ?? null,
        caseDetails: {
          'Case ID': data.case_number,
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        hearingDetails: {
          'Hearing Date': hearingDate,
          'Request Type': data.request_type,
          'Request ID': this.transcriptId,
          'Request method': data.is_manual ? 'Manual' : 'Automated',
          Urgency: data.urgency,
          'Audio for transcript': startTime && endTime ? `Start time ${startTime} - End time ${endTime}` : '',
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
}
