import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';

@Component({
  selector: 'app-rejected-transcript',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    BreadcrumbDirective,
    DetailsTableComponent,
    GovukHeadingComponent,
    ReportingRestrictionComponent,
    RouterLink,
  ],
  templateUrl: './rejected-transcript.component.html',
  styleUrl: './rejected-transcript.component.scss',
})
export class RejectedTranscriptComponent implements OnInit {
  datePipe = inject(DatePipe);

  @Input() transcript!: TranscriptionDetails;

  transcriptStatusClassMap = transcriptStatusClassMap;
  caseDetails = {};
  requestDetails = {};

  ngOnInit(): void {
    this.caseDetails = {
      'Case ID': this.transcript.case_number,
      Courthouse: this.transcript.courthouse,
      'Judge(s)': this.transcript.judges,
      'Defendant(s)': this.transcript.defendants,
    };

    this.requestDetails = {
      'Hearing Date': this.datePipe.transform(this.transcript.hearing_date, 'dd MMM yyyy'),
      'Request Type': this.transcript.request_type,
      'Request ID': this.transcript.transcription_id,
      Urgency: this.transcript.urgency,
      'Audio for transcript':
        'Start time ' +
        this.datePipe.transform(this.transcript.transcription_start_ts, 'HH:mm:ss') +
        ' - End time ' +
        this.datePipe.transform(this.transcript.transcription_end_ts, 'HH:mm:ss'),
      From: this.transcript.from,
      Received: this.datePipe.transform(this.transcript.received, 'dd MMM yyyy HH:mm:ss'),
      Instructions: this.transcript.requestor_comments,
      'Judge approval': 'Yes',
    };
  }
}
