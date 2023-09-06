import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { CaseData } from 'src/app/types/case';
import { HearingData } from 'src/app/types/hearing';

@Injectable({
  providedIn: 'root',
})
//This service is used to share data e.g. case and hearing across child components
export class CaseDataService {
  case$!: Subject<CaseData>;
  private _case: Observable<CaseData> = this.case$.asObservable();
  hearings$: Subject<HearingData[]> = new Subject<HearingData[]>();

  // setCase(c: CaseData) {
  //   this.case = c;
  // }

  getCase(): Observable<CaseData> {
    return this._case;
  }

  // setHearings(h: HearingData[]) {
  //   this.hearings = h;
  // }

  // getHearings(): HearingData[] {
  //   return this.hearings;
  // }

  /**
   *
   * @param {number} hId Required parameter, representing the hearing id to look for
   * @param {HearingData[]} [hearings] Optional parameter for array of HearingData
   * @returns {HearingData | undefined} Returns either a single HearingData object, or undefined
   */
  getHearingById(hId: number, hearings?: Observable<HearingData[]>): Observable<HearingData | undefined> | undefined {
    if (hearings) {
      return hearings.pipe(map((h) => h.find((x) => x.id === hId)));
    } else if (this.hearings$) {
      return this.hearings$.pipe(map((h) => h.find((x) => x.id === hId)));
    } else {
      console.log('hearings is undefined');
      return undefined;
    }
  }
}
