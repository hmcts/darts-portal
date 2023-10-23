import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { Transcript, TranscriptsRow } from '@darts-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { CaseService } from '@services/case/case.service';
import { combineLatest, map } from 'rxjs';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent, BreadcrumbComponent, BreadcrumbDirective],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  public caseId = this.route.snapshot.params.caseId;
  public caseFile$;
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
  public transcripts$ = this.caseService
    .getAllCaseTranscripts(this.caseId)
    .pipe(map((transcript) => this.mapTranscriptRequestToRows(transcript)));

  data$ = combineLatest({
    hearings: this.hearings$,
    transcripts: this.transcripts$,
  });

  mapTranscriptRequestToRows(transcripts: Transcript[]): TranscriptsRow[] {
    return transcripts.map((transcript) => {
      return {
        hearingDate: transcript.hearing_date,
        type: transcript.type,
        requestedOn: transcript.requested_on,
        requestedBy: transcript.requested_by_name,
        status: transcript.status,
      };
    });
  }

  constructor() {
    this.caseFile$ = this.caseService.getCase(this.caseId);
  }
}
