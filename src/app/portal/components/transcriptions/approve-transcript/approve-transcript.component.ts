import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { ValidationErrorSummaryComponent } from '@common/validation-error-summary/validation-error-summary.component';
import { ConflictComponent } from '@components/error/conflict/conflict.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionDetails } from '@portal-types/index';
import { ErrorMessageService } from '@services/error/error-message.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { UserService } from '@services/user/user.service';
import { map, tap } from 'rxjs';
import { ApproveTranscriptButtonsComponent } from './approve-transcript-buttons/approve-transcript-buttons.component';

@Component({
  selector: 'app-approve-transcript',
  standalone: true,
  imports: [
    CommonModule,
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
  userService = inject(UserService);
  router = inject(Router);

  transcriptId = this.route.snapshot.params.transcriptId;
  approvalErrors: { fieldId: string; message: string }[] = [];
  error$ = this.errorMsgService.errorMessage$;

  vm$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId).pipe(
    tap((data: TranscriptionDetails) => {
      // Users can't approve their own transcript requests
      if (this.isRequesterCurrentUser(data)) {
        this.router.navigate(['/forbidden']);
      }
      if (this.isNotAwaitingAuthorisation(data)) {
        this.router.navigate(['/not-found']);
      }
    }),
    map((data: TranscriptionDetails) => {
      return {
        hearingId: data.hearingId,
        reportingRestrictions: data.caseReportingRestrictions ?? [],
        caseDetails: this.transcriptionService.getCaseDetailsFromTranscript(data),
        requestDetails: this.transcriptionService.getRequestDetailsFromTranscript(data),
      };
    })
  );

  private isRequesterCurrentUser(transcript: TranscriptionDetails) {
    return transcript.requestor?.userId === this.userService.userState()?.userId;
  }

  private isNotAwaitingAuthorisation(transcript: TranscriptionDetails) {
    return !(transcript.status === 'Awaiting Authorisation');
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  ngOnDestroy(): void {
    this.errorMsgService.clearErrorMessage();
  }

  handleRejectError(errors: { fieldId: string; message: string }[] = []) {
    this.approvalErrors = errors;
  }
}
