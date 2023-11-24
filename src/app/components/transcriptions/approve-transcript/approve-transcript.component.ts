import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { ViewTranscriptComponent } from '../view-transcript/view-transcript.component';
import { ApproveTranscriptButtonsComponent } from './approve-transcript-buttons/approve-transcript-buttons.component';

@Component({
  selector: 'app-approve-transcript',
  standalone: true,
  imports: [
    CommonModule,
    ViewTranscriptComponent,
    ApproveTranscriptButtonsComponent,
    DetailsTableComponent,
    GovukHeadingComponent,
    ReportingRestrictionComponent,
  ],
  templateUrl: './approve-transcript.component.html',
  styleUrl: './approve-transcript.component.scss',
})
export class ApproveTranscriptComponent implements OnInit {
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  datePipe = inject(DatePipe);

  caseDetails = {};
  hearingDetails = {};
  reportingRestriction: string | null = null;

  transcriptId = this.route.snapshot.params.transcriptId;
  transcript$ = this.transcriptionService
    .getTranscriptionDetails(this.transcriptId)
    .subscribe((data: TranscriptionDetails) => {
      this.reportingRestriction = data.reporting_restriction || null;

      this.caseDetails = {
        'Case ID': data.case_number,
        Courthouse: data.courthouse,
        'Judge(s)': data.judges,
        'Defendant(s)': data.defendants,
      };
      this.hearingDetails = {
        'Hearing Date': this.datePipe.transform(data.hearing_date, 'dd MMM yyyy'),
        'Request Type': data.request_type,
        'Request ID': data.request_id,
        Urgency: data.urgency,
        'Audio for transcript':
          'Start time ' +
          this.datePipe.transform(data.transcription_start_ts, 'HH:mm:ss') +
          ' - End time ' +
          this.datePipe.transform(data.transcription_end_ts, 'HH:mm:ss'),
        From: data.from,
        Received: this.datePipe.transform(data.received, 'dd MMM yyyy HH:mm:ss'),
        Instructions: data.requestor_comments,
        'Judge approval': 'Yes',
      };
    });

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }
}
