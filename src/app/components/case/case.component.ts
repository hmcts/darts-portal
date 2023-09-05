import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseService } from 'src/app/services/case/case.service';
import { HearingData } from 'src/app/types/hearing';
import { CaseFile } from 'src/app/types/case-file';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent, RouterLink],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent implements OnInit {
  public caseId!: string;
  public caseFile$!: Observable<CaseFile>;
  public hearings$!: Observable<HearingData[]>;

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

  getCaseFile(): void {
    this.caseId = this.route.snapshot.params.caseId;
    this.caseFile$ = this.caseService.getCaseFile(this.caseId);
  }

  getCaseHearings(): void {
    const caseId = this.route.snapshot.params.caseId;
    this.hearings$ = this.caseService.getCaseHearings(caseId);
  }

  ngOnInit(): void {
    this.getCaseFile();
    this.getCaseHearings();
  }
}
