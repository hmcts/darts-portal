import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { JoinPipe } from '@pipes/join';
import { TranscriptionService } from 'src/app/portal/services/transcription/transcription.service';
import { DetailsTableComponent } from '../../../../components/common/details-table/details-table.component';
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
  transcriptStatusClassMap = transcriptStatusClassMap;
  transcriptId = this.route.snapshot.params.transcriptId;
  transcript$ = this.transcriptionService.getTranscriptionDetails(this.transcriptId);
}
