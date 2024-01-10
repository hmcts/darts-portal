import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { map } from 'rxjs';
import { ViewTranscriptComponent } from '../view-transcript/view-transcript.component';
import { ConflictComponent } from './../../error/conflict/conflict.component';
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
        reportingRestrictions: data.reporting_restrictions ?? [],
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
