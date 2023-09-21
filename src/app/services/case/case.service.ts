import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Case, Courthouse, Hearing, SearchFormValues } from '@darts-types/index';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const GET_COURTHOUSES_PATH = '/api/courthouses';
export const GET_CASE_PATH = '/api/cases';
export const ADVANCED_SEARCH_CASE_PATH = '/api/cases/search';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private readonly http: HttpClient) {}

  getCourthouses(): Observable<Courthouse[]> {
    return this.http.get<Courthouse[]>(GET_COURTHOUSES_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCase(caseId: number): Observable<Case> {
    const apiURL = `${GET_CASE_PATH}/${caseId}`;
    return this.http.get<Case>(apiURL);
  }

  getCaseHearings(caseId: number): Observable<Hearing[]> {
    return this.http.get<Hearing[]>(`${GET_CASE_PATH}/${caseId}/hearings`);
  }

  getCasesAdvanced(searchForm: SearchFormValues): Observable<Case[]> {
    let params = new HttpParams();

    if (searchForm.case_number) params = params.set('case_number', searchForm.case_number);

    if (searchForm.courthouse) params = params.set('courthouse', searchForm.courthouse);

    if (searchForm.courtroom) params = params.set('courtroom', searchForm.courtroom);

    if (searchForm.judge_name) params = params.set('judge_name', searchForm.judge_name);

    if (searchForm.defendant_name) params = params.set('defendant_name', searchForm.defendant_name);

    if (searchForm.specific_date) {
      const dateParameter = searchForm.specific_date.split('/').reverse().join('-');
      params = params.set('date_from', dateParameter);
      params = params.set('date_to', dateParameter);
    } else {
      if (searchForm.date_from) params = params.set('date_from', searchForm.date_from.split('/').reverse().join('-'));
      if (searchForm.date_to) params = params.set('date_to', searchForm.date_to.split('/').reverse().join('-'));
    }

    if (searchForm.event_text_contains) params = params.set('event_text_contains', searchForm.event_text_contains);

    return this.http.get<Case[]>(ADVANCED_SEARCH_CASE_PATH, { params });
  }

  /**
   * @param {number} cId Required parameter, representing the case id to look for
   * @param {number} hId Required parameter, representing the hearing id to look for
   * @returns {Observable<Hearing | undefined> | undefined} Returns either a Observable of Hearing, or undefined
   */
  getHearingById(cId: number, hId: number): Observable<Hearing | undefined> {
    return this.getCaseHearings(cId).pipe(map((h) => h.find((x) => x.id == hId)));
  }
}
