import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '@services/case/case.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, shareReplay, switchMap } from 'rxjs';
import { JoinPipe } from '@pipes/join';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { LoadingComponent } from '@common/loading/loading.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';

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
  ],
  templateUrl: './view-transcript.component.html',
  styleUrls: ['./view-transcript.component.scss'],
})
export class ViewTranscriptComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  transcriptionService = inject(TranscriptionService);
  transcriptStatusClassMap = transcriptStatusClassMap;

  transcriptId = this.route.snapshot.params.transcriptId;

  transcript$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId).pipe(shareReplay(1));
  case$ = this.transcript$.pipe(switchMap((transcript) => this.caseService.getCase(transcript.case_id)));

  data$ = combineLatest({
    case: this.case$,
    transcript: this.transcript$,
  });
}
