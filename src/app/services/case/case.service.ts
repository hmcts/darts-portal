import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CaseData } from '../../../app/types/case';
import { CourthouseData } from '../../../app/types/courthouse';
import { HearingData } from 'src/app/types/hearing';

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
  private params: HttpParams = new HttpParams();

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
    const apiURL = `${GET_CASE_PATH}/${caseId}/hearings`;
    return this.http.get<HearingData[]>(apiURL);
  }

  //Advanced search API fetching multiple cases
  getCasesAdvanced(
    case_number?: string,
    courthouse?: string,
    courtroom?: string,
    judge_name?: string,
    defendant_name?: string,
    date_from?: string,
    date_to?: string,
    event_text_contains?: string
  ): Observable<CaseData[]> {
    //Process optional parameters to form HttpParams
    this.params = new HttpParams();

    if (case_number) {
      this.params = this.params.set('case_number', case_number);
    }
    if (courthouse) {
      this.params = this.params.set('courthouse', courthouse);
    }
    if (courtroom) {
      this.params = this.params.set('courtroom', courtroom);
    }
    if (judge_name) {
      this.params = this.params.set('judge_name', judge_name);
    }
    if (defendant_name) {
      this.params = this.params.set('defendant_name', defendant_name);
    }
    if (date_from) {
      date_from = date_from.split('/').reverse().join('-');
      this.params = this.params.set('date_from', date_from);
    }
    if (date_to) {
      date_to = date_to.split('/').reverse().join('-');
      this.params = this.params.set('date_to', date_to);
    }
    if (event_text_contains) {
      this.params = this.params.set('event_text_contains', event_text_contains);
    }

    const options = { params: this.params };
    const apiURL = ADVANCED_SEARCH_CASE_PATH;

    //Make API call out to advanced search case API, return Observable to Case Component, catch any errors and pass to ErrorHandler service
    return this.http.get<CaseData[]>(apiURL, options);
  }

  public getHttpParams(): HttpParams {
    return this.params;
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
