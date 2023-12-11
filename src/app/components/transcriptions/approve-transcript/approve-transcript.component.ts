import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs';
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
    ValidationErrorSummaryComponent,
    RouterLink,
  ],
  templateUrl: './approve-transcript.component.html',
  styleUrl: './approve-transcript.component.scss',
})
export class ApproveTranscriptComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  datePipe = inject(DatePipe);
  errorMsgService = inject(ErrorMessageService);

  transcriptId = this.route.snapshot.params.transcriptId;
  approvalErrors: { fieldId: string; message: string }[] = [];
  error$ = this.errorMsgService.errorMessage$;

  vm$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId).pipe(
    map((data: TranscriptionDetails) => {
      return {
        reportingRestriction: data.reporting_restriction || null,
        caseDetails: {
          'Case ID': data.case_number,
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        requestDetails: {
          'Hearing Date': this.datePipe.transform(data.hearing_date, 'dd MMM yyyy'),
          'Request Type': data.request_type,
          'Request ID': data.transcription_id,
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
        },
      };
    })
  );

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }

  handleRejectError(errors: { fieldId: string; message: string }[] = []) {
    this.approvalErrors = errors;
  }
}
