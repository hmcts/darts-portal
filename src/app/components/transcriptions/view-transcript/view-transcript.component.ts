import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { tap } from 'rxjs/internal/operators/tap';
import { ApprovedTranscriptComponent } from './approved-transcript/approved-transcript.component';
import { RejectedTranscriptComponent } from './rejected-transcript/rejected-transcript.component';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  imports: [
    CommonModule,
    JoinPipe,
    BreadcrumbComponent,
    BreadcrumbDirective,
    ReportingRestrictionComponent,
    LoadingComponent,
    ApprovedTranscriptComponent,
    RejectedTranscriptComponent,
    LuxonDatePipe,
  ],
  templateUrl: './view-transcript.component.html',
  styleUrls: ['./view-transcript.component.scss'],
})
export class ViewTranscriptComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  transcriptionService = inject(TranscriptionService);
  fileDownloadService = inject(FileDownloadService);
  transcriptStatusClassMap = transcriptStatusClassMap;
  transcriptId = this.route.snapshot.params.transcriptId;
  fileName = '';

  transcript$ = this.transcriptionService
    .getTranscriptionDetails(this.transcriptId)
    .pipe(tap((details) => (this.fileName = details.transcriptFileName)));

  onDownloadClicked() {
    this.transcriptionService.downloadTranscriptDocument(this.transcriptId).subscribe((blob: Blob) => {
      this.fileDownloadService.saveAs(blob, this.fileName);
    });
  }
}
