import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseFileComponent } from './case-file/case-file.component';
import { HearingResultsComponent } from './hearing-results/hearing-results.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseService } from 'src/app/services/case/case.service';
import { HearingData } from 'src/app/types/hearing';
import { HttpErrorResponse } from '@angular/common/http';
import { CaseFile } from 'src/app/types/case-file';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [CommonModule, CaseFileComponent, HearingResultsComponent, RouterLink],
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent implements OnInit {
  public caseId!: string;
  public caseFile!: CaseFile;
  public hearings: HearingData[] = [];

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

  getCaseFile(): void {
    this.caseId = this.route.snapshot.params.caseId;
    this.caseService.getCaseFile(this.caseId).subscribe({
      next: (result: CaseFile) => {
        console.log(result);
        this.caseFile = result;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.type);
      },
    });
  }

  getCaseHearings(): void {
    const caseId = this.route.snapshot.params.caseId;
    this.caseService.getCaseHearings(caseId).subscribe({
      next: (result: HearingData[]) => {
        this.hearings = result;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.type);
      },
    });
  }

  ngOnInit(): void {
    this.getCaseFile();
    this.getCaseHearings();
  }
}
