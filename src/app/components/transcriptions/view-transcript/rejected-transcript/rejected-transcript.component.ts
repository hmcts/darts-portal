import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionService } from '@services/transcription/transcription.service';

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
  luxonDatePipe = inject(LuxonDatePipe);
  transcriptionService = inject(TranscriptionService);

  @Input() transcript!: TranscriptionDetails;

  transcriptStatusClassMap = transcriptStatusClassMap;
  caseDetails = {};
  requestDetails = {};

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getRequestDetailsFromTranscript(this.transcript);
  }
}
