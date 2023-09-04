import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent implements OnInit {
  constructor(private caseDataService: CaseDataService) {}

  c = {
    case_id: 1,
    case_number: '12342',
    reporting_restriction: 'Section 39, Children and Young Persons Act 1933',
    courthouse: 'Reading',
  };
  h = {
    id: 1,
    date: '2023-09-01',
    judges: ['judge judy', 'judge jeffrey', 'judge jose'],
    courtroom: '99',
    transcript_count: 100,
  };

  ngOnInit() {
    this.caseDataService.setCase(this.c);
    this.caseDataService.setHearing(this.h);
  }
}
