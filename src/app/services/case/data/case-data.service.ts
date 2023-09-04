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
    this.case = c;
  }

  getCase(): CaseData {
    return this.case;    
  }

  setHearing(h: HearingData) {    
    this.hearing = h;
  }

  getHearing(): HearingData {
    return this.hearing;    
  }
}
