import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseService } from 'src/app/services/case/case.service';

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
  public caseFile$ = this.caseService.getCaseFile(this.caseId);
  public hearings$ = this.caseService.getCaseHearings(this.caseId);
}
