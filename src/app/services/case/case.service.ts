import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, ErrorHandler } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
declare type CaseData = typeof import('../../types/case');

const GET_CASE_PATH = '/cases/';
const ADVANCED_SEARCH_CASE_PATH = '/cases/search';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private readonly http: HttpClient, @Inject('Window') private window: Window) {}

  //Single get case API
  async getCase(caseId: string): Observable<CaseData> {
    const apiURL = `${GET_CASE_PATH}?caseId=${caseId}`;
    return this.http.get<CaseData>(apiURL).pipe(catchError(ErrorHandler.handleError));
  }

  //Advanced search API fetching multiple cases
  async getCasesAdvanced(
    case_number: string,
    courthouse?: string,
    courtroom?: string,
    judge_name?: string,
    defendant_name?: string,
    date_from?: string,
    date_to?: string,
    event_text_contains?: string
  ): Observable<CaseData> {
    const params = new HttpParams()
      .set('case_number', case_number)
      .set('courthouse', courthouse)
      .set('courtroom', courtroom)
      .set('judge_name', judge_name)
      .set('defendant_name', defendant_name)
      .set('date_from', date_from)
      .set('date_to', date_to)
      .set('event_text_contains', event_text_contains);

    const apiURL = `${ADVANCED_SEARCH_CASE_PATH}`;
    return this.http.get<CaseData>(apiURL, params).pipe(catchError(ErrorHandler.handleError));
  }
}
