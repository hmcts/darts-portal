import { Injectable } from '@angular/core';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';

@Injectable({
  providedIn: 'root',
})
//This service is used to share data e.g. case and hearing across child components
export class CaseDataService {
  case!: CaseData;
  hearings!: HearingData[];

  setCase(c: CaseData) {
    this.case = c;
  }

  getCase(): CaseData {
    return this.case;
  }

  setHearings(h: HearingData[]) {
    this.hearings = h;
  }

  getHearings(): HearingData[] {
    return this.hearings;
  }

  /**
   *
   * @param {number} hId Required parameter, representing the hearing id to look for
   * @param {HearingData[]} [hearings] Optional parameter for array of HearingData
   * @returns {HearingData | undefined} Returns either a single HearingData object, or undefined
   */
  getHearingById(hId: number, hearings?: HearingData[]): HearingData | undefined {
    if (hearings) {
      return hearings.find((h) => h.id == hId);
    } else if (this.hearings) {
      return this.hearings.find((h) => h.id == hId);
    } else {
      console.log('hearings is undefined');
      return undefined;
    }
  }
}
