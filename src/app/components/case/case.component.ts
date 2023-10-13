import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { transcript, TranscriptsRow } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import { combineLatest, map } from 'rxjs';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent, RouterLink],
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

  mapTranscriptRequestToRows(transcript: transcript[]): TranscriptsRow[] {
    return transcript.map((ar) => {
      return {
        hearingDate: ar.hearing_date,
        type: ar.type,
        requestedOn: ar.requested_on,
        requestedBy: ar.requested_by_name,
        status: ar.status.toUpperCase(),
      };
    });
  }

  constructor() {
    this.caseFile$ = this.caseService.getCase(this.caseId);
  }
}
