import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { CaseDataService } from 'src/app/services/case/data/case-data.service';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent implements OnInit {
  constructor(private caseDataService: CaseDataService) {}
  case!: CaseData;
  hearing!: HearingData;

  ngOnInit(): void {
    //Load single case data & hearing from shared service
    this.case = this.caseDataService.getCase();
    this.hearing = this.caseDataService.getHearing();
  }

  //Add logic to say if refreshed, fetch same data based off id in param
}
