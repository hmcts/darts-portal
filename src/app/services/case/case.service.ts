import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ErrorHandlerService } from '../error/error-handler.service';
import { CaseData } from '../../../app/types/case';

const GET_CASE_PATH = '/api/cases/';
const ADVANCED_SEARCH_CASE_PATH = '/api/cases/search';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private readonly http: HttpClient, private ErrorHandler: ErrorHandlerService) {} //

  //Single get case API
  getCase(caseId: string): Observable<CaseData> {
    const apiURL = `${GET_CASE_PATH}?caseId=${caseId}`;
    return this.http.get<CaseData>(apiURL).pipe(
      catchError((err: Error) => {
        this.ErrorHandler.handleError(err);
        return throwError(() => err);
      })
    );
  }

  //Advanced search API fetching multiple cases
  getCasesAdvanced(
    case_number: string,
    courthouse?: string | null,
    courtroom?: string | null,
    judge_name?: string | null,
    defendant_name?: string | null,
    date_from?: string | null,
    date_to?: string | null,
    event_text_contains?: string | null
  ): Observable<CaseData[]> {
    let params = new HttpParams().set('case_number', case_number);

    //Process optional parameters to form HttpParams
    if (courthouse) {
      params = params.set('courthouse', courthouse);
    }
    if (courtroom) {
      params = params.set('courtroom', courtroom);
    }
    if (judge_name) {
      params = params.set('judge_name', judge_name);
    }
    if (defendant_name) {
      params = params.set('defendant_name', defendant_name);
    }
    if (date_from) {
      params = params.set('date_from', date_from);
    }
    if (date_to) {
      params = params.set('date_to', date_to);
    }
    if (event_text_contains) {
      params = params.set('event_text_contains', event_text_contains);
    }

    const options = { params: params };
    const apiURL = `${ADVANCED_SEARCH_CASE_PATH}`;

    //Make API call out to advanced search case API, return Observable to Case Component, catch any errors and pass to ErrorHandler service
    return this.http.get<CaseData[]>(apiURL, options).pipe(
      catchError((err: Error) => {
        this.ErrorHandler.handleError(err);
        return throwError(() => err);
      })
    );
  }
}
