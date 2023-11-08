import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '@services/case/case.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { JoinPipe } from '@pipes/join';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { TranscriptionService } from '@services/transcription/transcription.service';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  imports: [CommonModule, JoinPipe, BreadcrumbComponent, BreadcrumbDirective, ReportingRestrictionComponent],
  templateUrl: './view-transcript.component.html',
  styleUrls: ['./view-transcript.component.scss'],
})
export class ViewTranscriptComponent {
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  transcriptionService = inject(TranscriptionService);

  caseId = this.route.snapshot.params.caseId;
  transcriptId = this.route.snapshot.params.transcriptId;

  case$ = this.caseService.getCase(this.caseId);
  transcript$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId);

  data$ = combineLatest({
    case: this.case$,
    transcript: this.transcript$,
  });
}
