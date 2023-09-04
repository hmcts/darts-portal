import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../error/error-handler.service';
import { CaseData } from '../../../app/types/case';
import { CaseFile } from 'src/app/types/case-file';
import { CourthouseData } from '../../../app/types/courthouse';
import { HearingData } from 'src/app/types/hearing';

//API Endpoints
const GET_COURTHOUSES_PATH = '/api/courthouses';
const GET_CASE_PATH = '/api/cases/';
const ADVANCED_SEARCH_CASE_PATH = '/api/cases/search';

@Injectable({
  providedIn: 'root',
})
//Class containing API requests for data fetching
export class CaseService {
  constructor(private readonly http: HttpClient, private errorHandlerService: ErrorHandlerService) {}
  private params: HttpParams = new HttpParams();

  //Fetches all courthouses
  getCourthouses(): Observable<CourthouseData[]> {
    return this.http.get<CourthouseData[]>(GET_COURTHOUSES_PATH).pipe(
      catchError((err: Error) => {
        this.errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  //Single get case API
  getCase(caseId: string | number): Observable<CaseData> {
    return this.http.get<CaseData>(`${GET_CASE_PATH}?caseId=${caseId}`).pipe(
      catchError((err: Error) => {
        this.errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  // Single get case file
  getCaseFile(caseId: string | number): Observable<CaseData> {
    const apiURL = `${GET_CASE_PATH}/${caseId}`;
    return this.http.get<CaseData>(apiURL).pipe();
  }

  // Get hearings for a single case
  getCaseHearings(caseId: number): Observable<HearingData[]> {
    const apiURL = `${GET_CASE_PATH}/${caseId}/hearings`;
    return this.http.get<HearingData[]>(apiURL).pipe(
      catchError((err: Error) => {
        this.errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
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
    return this.http.get<CaseData[]>(apiURL, options).pipe(
      catchError((err: Error) => {
        this.errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  public getHttpParams(): HttpParams {
    return this.params;
  }
}
