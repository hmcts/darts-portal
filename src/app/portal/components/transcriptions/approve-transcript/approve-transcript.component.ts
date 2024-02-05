import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@components/common/validation-error-summary/validation-error-summary.component';
import { ConflictComponent } from '@components/error/conflict/conflict.component';
import { ViewTranscriptComponent } from '@components/transcriptions/view-transcript/view-transcript.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionDetails } from '@portal-types/index';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs';
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
    ConflictComponent,
    BreadcrumbComponent,
    BreadcrumbDirective,
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
        reportingRestrictions: data.caseReportingRestrictions ?? [],
        caseDetails: this.transcriptionService.getCaseDetailsFromTranscript(data),
        requestDetails: this.transcriptionService.getRequestDetailsFromTranscript(data),
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
