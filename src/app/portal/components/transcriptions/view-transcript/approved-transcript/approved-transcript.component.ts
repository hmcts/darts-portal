import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '@components/common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusTagColours } from '@constants/transcript-status-tag-colours';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionDetails } from '@portal-types/index';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-approved-transcript',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    BreadcrumbDirective,
    DetailsTableComponent,
    GovukHeadingComponent,
    ReportingRestrictionComponent,
    GovukTagComponent,
  ],
  templateUrl: './approved-transcript.component.html',
  styleUrl: './approved-transcript.component.scss',
})
export class ApprovedTranscriptComponent implements OnInit {
  datePipe = inject(DatePipe);
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  fileDownloadService = inject(FileDownloadService);

  @Input() transcript!: TranscriptionDetails;

  statusColours = transcriptStatusTagColours;
  caseDetails = {};
  requestDetails = {};

  transcriptId = this.route.snapshot.params.transcriptId;
  fileName?: string;

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getRequestDetailsFromTranscript(this.transcript);
    this.fileName = this.transcript.transcriptFileName;
  }

  onDownloadClicked() {
    if (this.fileName) {
      this.transcriptionService.downloadTranscriptDocument(this.transcriptId).subscribe((blob: Blob) => {
        this.fileDownloadService.saveAs(blob, this.fileName as string);
      });
    }
  }
}
