import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { JoinPipe } from '@pipes/join';
import { TranscriptionDetails } from '@portal-types/index';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { switchMap } from 'rxjs';
import { ApprovedTranscriptComponent } from './approved-transcript/approved-transcript.component';
import { CaseHearingTranscriptComponent } from './case-hearing-transcript/case-hearing-transcript.component';
import { RejectedTranscriptComponent } from './rejected-transcript/rejected-transcript.component';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  templateUrl: './view-transcript.component.html',
  styleUrls: ['./view-transcript.component.scss'],
  imports: [
    CommonModule,
    JoinPipe,
    BreadcrumbComponent,
    BreadcrumbDirective,
    ReportingRestrictionComponent,
    LoadingComponent,
    ApprovedTranscriptComponent,
    RejectedTranscriptComponent,
    DetailsTableComponent,
    CaseHearingTranscriptComponent,
  ],
})
export class ViewTranscriptComponent {
  router = inject(Router);

  transcriptionService = inject(TranscriptionService);

  // url from Case: /case/{caseId}/transcripts/{transcriptId}
  // url from Hearing: /case/{caseId}/hearings/{hearingId}/transcripts/{transcriptId}
  // url from Your Work: /transcriptions/transcripts/{transcriptId}
  transcriptId = input(0, { transform: numberAttribute });
  caseId = input(0, { transform: numberAttribute });
  hearingId = input(0, { transform: numberAttribute });

  transcript = toSignal(
    toObservable(this.transcriptId).pipe(
      switchMap((transcriptId) => this.transcriptionService.getTranscriptionDetails(transcriptId))
    )
  );

  isTranscriptRejected = computed(() => this.transcript()?.status?.toUpperCase() === 'REJECTED');

  constructor() {
    effect(() => {
      if (this.transcript()) {
        this.verifyTranscript(this.transcript()!, this.caseId(), this.hearingId());
      }
    });
  }

  verifyTranscript(transcript: TranscriptionDetails, caseId: number, hearingId: number) {
    if (caseId && caseId !== transcript.caseId) {
      this.goToPageNotFound();
      return;
    }

    if (hearingId && hearingId !== transcript.hearingId) {
      this.goToPageNotFound();
      return;
    }
  }

  goToPageNotFound() {
    this.router.navigate(['/page-not-found']);
  }
}
