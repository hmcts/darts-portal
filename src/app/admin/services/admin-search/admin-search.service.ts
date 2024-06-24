import { AdminCaseSearchResult } from '@admin-types/search/admin-case-search-result';
import { AdminCaseSearchResultData } from '@admin-types/search/admin-case-search-result-data.interface';
import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { AdminEventSearchResultData } from '@admin-types/search/admin-event-search-result-data.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';

export const ADMIN_CASE_SEARCH_PATH = '/api/admin/cases/search';
export const ADMIN_EVENT_SEARCH_PATH = '/api/admin/events/search';

@Injectable({
  providedIn: 'root',
})
export class AdminSearchService {
  http = inject(HttpClient);

  getCases(formValues: AdminSearchFormValues): Observable<AdminCaseSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http
      .post<AdminCaseSearchResultData[]>(ADMIN_CASE_SEARCH_PATH, requestBody)
      .pipe(map((results) => this.mapCaseDataToCaseSearchResult(results)));
  }

  getEvents(formValues: AdminSearchFormValues): Observable<AdminEventSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http
      .post<AdminEventSearchResultData[]>(ADMIN_EVENT_SEARCH_PATH, requestBody)
      .pipe(map((results) => this.mapEventDataToEventSearchResult(results)));
  }

  private mapCaseDataToCaseSearchResult(results: AdminCaseSearchResultData[]): AdminCaseSearchResult[] {
    return results.map((result) => ({
      id: result.id,
      number: result.case_number,
      courthouse: result.courthouse.display_name,
      courtrooms: result.courtrooms.map((c) => c.name),
      judges: result.judges,
      defendants: result.defendants,
    }));
  }

  private mapEventDataToEventSearchResult(results: AdminEventSearchResultData[]): AdminEventSearchResult[] {
    return results.map((result) => ({
      id: result.id,
      createdAt: DateTime.fromISO(result.created_at),
      name: result.name,
      text: result.text,
      chronicleId: result.chronicle_id,
      antecedentId: result.antecedent_id,
      courthouse: result.courthouse.display_name,
      courtroom: result.courtroom.name,
    }));
  }

  private mapAdminSearchFormValuesToSearchRequest(formValues: AdminSearchFormValues) {
    const { hearingDate, courthouses, caseId, courtroom } = formValues;
    let hearing_start_at, hearing_end_at;

    switch (hearingDate.type) {
      case 'specific':
        hearing_start_at = this.formatDate(hearingDate.specific);
        hearing_end_at = this.formatDate(hearingDate.specific);
        break;
      case 'range':
        hearing_start_at = this.formatDate(hearingDate.from);
        hearing_end_at = this.formatDate(hearingDate.to);
        break;
    }

    return {
      courthouse_ids: courthouses.map((c) => c.id),
      case_number: caseId ? caseId : null,
      courtroom_name: courtroom ? courtroom : null,
      hearing_start_at: hearing_start_at ?? null,
      hearing_end_at: hearing_end_at ?? null,
    };
  }

  // takes a date of format DD/MM/YYYY and returns YYYY-MM-DD
  private formatDate(date: string): string {
    return date.split('/').reverse().join('-');
  }
}
