import { Component, Input, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-rejected-transcript',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbDirective,
    DetailsTableComponent,
    GovukHeadingComponent,
    ReportingRestrictionComponent,
    RouterLink,
    GovukTagComponent,
  ],
  templateUrl: './rejected-transcript.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './rejected-transcript.component.scss',
})
export class RejectedTranscriptComponent implements OnInit {
  luxonDatePipe = inject(LuxonDatePipe);
  transcriptionService = inject(TranscriptionService);

  @Input() transcript!: TranscriptionDetails;

  statusColours = transcriptStatusTagColours;
  caseDetails = {};
  requestDetails = {};

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getRequestDetailsFromTranscript(this.transcript);
  }
}
