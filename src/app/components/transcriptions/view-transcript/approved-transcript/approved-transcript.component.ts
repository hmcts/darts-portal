import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { TranscriptionDetails } from '@darts-types/transcription-details.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
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
    RouterLink,
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

  transcriptStatusClassMap = transcriptStatusClassMap;
  caseDetails = {};
  requestDetails = {};

  transcriptId = this.route.snapshot.params.transcriptId;
  fileName = '';

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getRequestDetailsFromTranscript(this.transcript);
    this.fileName = this.transcript.transcriptFileName;
  }

  onDownloadClicked() {
    this.transcriptionService.downloadTranscriptDocument(this.transcriptId).subscribe((blob: Blob) => {
      this.fileDownloadService.saveAs(blob, this.fileName);
    });
  }
}
