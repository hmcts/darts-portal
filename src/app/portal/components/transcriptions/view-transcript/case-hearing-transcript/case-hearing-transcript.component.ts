import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { BreadcrumbComponent } from '../../../../../components/common/breadcrumb/breadcrumb.component'; //TO DO: update when core introduced
import { DetailsTableComponent } from '../../../../../components/common/details-table/details-table.component';
import { ReportingRestrictionComponent } from '../../../../../components/common/reporting-restriction/reporting-restriction.component';

@Component({
  selector: 'app-case-hearing-transcript',
  standalone: true,
  templateUrl: './case-hearing-transcript.component.html',
  styleUrl: './case-hearing-transcript.component.scss',
  imports: [ReportingRestrictionComponent, DetailsTableComponent, BreadcrumbComponent, BreadcrumbDirective],
})
export class CaseHearingTranscriptComponent implements OnInit {
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  fileDownloadService = inject(FileDownloadService);

  @Input() fileName!: string;
  @Input() transcript!: TranscriptionDetails;

  transcriptId = this.route.snapshot.params.transcriptId;

  caseDetails = {};
  requestDetails = {};

  ngOnInit(): void {
    this.caseDetails = this.transcriptionService.getCaseDetailsFromTranscript(this.transcript);
    this.requestDetails = this.transcriptionService.getHearingRequestDetailsFromTranscript(this.transcript);
  }

  onDownloadClicked() {
    this.transcriptionService.downloadTranscriptDocument(this.transcriptId).subscribe((blob: Blob) => {
      this.fileDownloadService.saveAs(blob, this.transcript.transcriptFileName);
    });
  }
}
