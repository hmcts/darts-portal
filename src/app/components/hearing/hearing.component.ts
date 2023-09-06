import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from 'src/app/services/case/case.service';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent implements OnInit {
  case!: CaseData;
  hearing!: HearingData;
  caseId: number;
  hearingId: number;

  constructor(
    private route: ActivatedRoute,
    private caseDataService: CaseDataService,
    private caseService: CaseService
  ) {
    this.hearingId = this.route.snapshot.params.hearing_id;
    this.caseId = this.route.snapshot.params.caseId;
  }

  ngOnInit(): void {
    this.loadData();
  }

  //Loads single case and hearing from either shared service or API
  loadData(): void {
    const c = this.caseDataService.getCase();
    const hearing = this.caseDataService.getHearingById(this.hearingId);
    
    if (c) {
      this.case = c;
    }
    if (hearing) {
      this.hearing = hearing;
    }

    console.log('loading case', c); //remove me
    console.log('loading data hearing',hearing); //remove me
    if (!this.case || !this.hearing) {
      this.loadFromApi();
    }
  }

  //Loads case and hearing data from API to persist data, e.g. after refresh
  loadFromApi(): void {
    console.log('loading case and hearing data directly from api due to events such as refresh');
    this.getCaseFileApi();
    this.getHearingsApi();
  }

  //Executes API request for getting hearings and assigns to hearings variable
  getHearingsApi(): void {
    console.log('in hearings api')//remove me
    this.caseService.getCaseHearings(this.caseId).subscribe({
      next: (hearings: HearingData[]) => {
        const hearing = this.caseDataService.getHearingById(this.hearingId, hearings);
        if (hearing) {
          this.hearing = hearing;
          console.log('setting hearings ', hearing)
        }
      },
    });
  }

  //Executes API request for specific case file and assigns to case variable
  getCaseFileApi(): void {
    this.caseService.getCaseFile(this.caseId).subscribe({
      next: (result: CaseData) => {
        this.case = result;
      },
    });
  }
}
