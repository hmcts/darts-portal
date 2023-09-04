import { Injectable } from '@angular/core';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';

@Injectable({
  providedIn: 'root',
})
//This service is used to share data e.g. case and hearing across child components
export class CaseDataService {

  case!: CaseData;
  hearing!: HearingData;

  setCase(c: CaseData) {
    c = {
      case_id: 1,
      case_number: '12342',
      reporting_restriction: 'Section 39, Children and Young Persons Act 1933',
      courthouse: 'Reading'
    }
    this.case = c;
  }

  getCase(): CaseData {
    return this.case;    
  }

  setHearing(h: HearingData) {
    h = {
      id: 1,
      date: '2023-09-01',
      judges: ['judge judy', 'judge jeffrey', 'judge jose'],
      courtroom: '99',
      transcript_count: 100,
    };
    
    this.hearing = h;
  }

  getHearing(): HearingData {
    return this.hearing;    
  }
}
