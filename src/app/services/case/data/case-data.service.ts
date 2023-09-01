import { Injectable } from '@angular/core';
import { CaseData } from 'src/app/types/case';

@Injectable({
  providedIn: 'root',
})
//This service is used to share data e.g. case and hearing across child components
export class CaseDataService {
  //I need case file passed into hearing

  //reference this service in case parent and hearing parent

  //Use output from case-file to send casedata to parent via event emitter

  //pass case data object from hearing parent down to hearing-file via Input

  // constructor() {}

  case!: CaseData;

  setCaseData(c: CaseData) {
    this.case = c;
  }

  getCaseData(): CaseData | undefined {
    return this.case;    
  }
}
