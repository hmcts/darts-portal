import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { combineLatest } from 'rxjs';
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
  public transcripts$ = this.caseService.getAllCaseTranscripts(this.caseId);

  data$ = combineLatest({
    hearings: this.hearings$,
    transcripts: this.transcripts$,
  });

  constructor() {
    this.caseFile$ = this.caseService.getCase(this.caseId);
  }
}
