import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CaseData } from '../../../app/types/case';
import { CourthouseData } from '../../../app/types/courthouse';
import { HearingData } from 'src/app/types/hearing';
import { SearchFormValues } from 'src/app/types/search-form.interface';

//API Endpoints
const GET_COURTHOUSES_PATH = '/api/courthouses';
const GET_CASE_PATH = '/api/cases';
const ADVANCED_SEARCH_CASE_PATH = '/api/cases/search';

@Injectable({
  providedIn: 'root',
})
//Class containing API requests for data fetching
export class CaseService {
  constructor(private readonly http: HttpClient) {}

  //Fetches all courthouses
  getCourthouses(): Observable<CourthouseData[]> {
    return this.http.get<CourthouseData[]>(GET_COURTHOUSES_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  // Single get case file
  getCase(caseId: number): Observable<CaseData> {
    const apiURL = `${GET_CASE_PATH}/${caseId}`;
    return this.http.get<CaseData>(apiURL);
  }

  // Single get case hearings
  getCaseHearings(caseId: number): Observable<HearingData[]> {
    return this.http.get<HearingData[]>(`${GET_CASE_PATH}/${caseId}/hearings`);
  }

  getCasesAdvanced(searchForm: SearchFormValues): Observable<CaseData[]> {
    let params = new HttpParams();

    if (searchForm.case_number) params = params.set('case_number', searchForm.case_number);

    if (searchForm.courthouse) params = params.set('courthouse', searchForm.courthouse);

    if (searchForm.courtroom) params = params.set('courtroom', searchForm.courtroom);

    if (searchForm.judge_name) params = params.set('judge_name', searchForm.judge_name);

    if (searchForm.defendant_name) params = params.set('defendant_name', searchForm.defendant_name);

    if (searchForm.date_from) params = params.set('date_from', searchForm.date_from.split('/').reverse().join('-'));

    if (searchForm.date_to) params = params.set('date_to', searchForm.date_to.split('/').reverse().join('-'));

    if (searchForm.event_text_contains) params = params.set('event_text_contains', searchForm.event_text_contains);

    return this.http.get<CaseData[]>(ADVANCED_SEARCH_CASE_PATH, { params });
  }

  /**
   *
   * @param {number} cId Required parameter, representing the case id to look for
   * @param {number} hId Required parameter, representing the hearing id to look for
   * @returns {Observable<HearingData | undefined> | undefined} Returns either a Observable of HearingData, or undefined
   */
  getHearingById(cId: number, hId: number): Observable<HearingData | undefined> {
    return this.getCaseHearings(cId).pipe(map((h) => h.find((x) => x.id == hId)));
  }
}
