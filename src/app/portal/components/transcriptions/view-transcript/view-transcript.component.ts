import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { LoadingComponent } from '@components/common/loading/loading.component';
import { ReportingRestrictionComponent } from '@components/common/reporting-restriction/reporting-restriction.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { JoinPipe } from '@pipes/join';
import { TranscriptionService } from '@services/transcription/transcription.service';
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
  route = inject(ActivatedRoute);

  transcriptionService = inject(TranscriptionService);
  transcriptId = this.route.snapshot.params.transcriptId;
  transcript$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId);
}
