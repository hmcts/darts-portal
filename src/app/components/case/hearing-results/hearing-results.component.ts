import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from 'src/app/services/case/case.service';
import { ActivatedRoute } from '@angular/router';
import { HearingData } from 'src/app/types/hearing';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
})
export class HearingResultsComponent implements OnInit {
  hearings: HearingData[] = [];

  constructor(private route: ActivatedRoute, private caseService: CaseService) {}

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
    this.getCaseHearings();
  }
}
