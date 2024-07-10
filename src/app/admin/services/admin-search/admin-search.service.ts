import { AdminCaseSearchResult } from '@admin-types/search/admin-case-search-result';
import { AdminCaseSearchResultData } from '@admin-types/search/admin-case-search-result-data.interface';
import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { AdminEventSearchResultData } from '@admin-types/search/admin-event-search-result-data.interface';
import { AdminHearingSearchResult } from '@admin-types/search/admin-hearing-search-result';
import { AdminHearingSearchResultData } from '@admin-types/search/admin-hearing-search-result-data.interface';
import { AdminMediaSearchResult } from '@admin-types/search/admin-media-search-result';
import { AdminMediaSearchResultData } from '@admin-types/search/admin-media-search-result-data.inerface';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';

export const ADMIN_CASE_SEARCH_PATH = '/api/admin/cases/search';
export const ADMIN_EVENT_SEARCH_PATH = '/api/admin/events/search';
export const ADMIN_HEARING_SEARCH_PATH = '/api/admin/hearings/search';
export const ADMIN_MEDIA_SEARCH_PATH = '/api/admin/medias/search';

export const defaultFormValues: AdminSearchFormValues = {
  courthouses: [],
  caseId: '',
  courtroom: '',
  hearingDate: {
    type: '',
    specific: '',
    from: '',
    to: '',
  },
  resultsFor: 'Cases',
};

@Injectable({
  providedIn: 'root',
})
export class AdminSearchService {
  http = inject(HttpClient);

  // signals to store previous search results and search form state
  formValues = signal<AdminSearchFormValues>(defaultFormValues);
  hasFormBeenSubmitted = signal<boolean>(false);
  cases = signal<AdminCaseSearchResult[]>([]);
  events = signal<AdminEventSearchResult[]>([]);
  hearings = signal<AdminHearingSearchResult[]>([]);
  audio = signal<AdminMediaSearchResult[]>([]);
  searchError = signal<string | null>(null);
  isLoading = signal<boolean>(true);

  getCases(formValues: AdminSearchFormValues): Observable<AdminCaseSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http.post<AdminCaseSearchResultData[]>(ADMIN_CASE_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapCaseDataToCaseSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.cases.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getEvents(formValues: AdminSearchFormValues): Observable<AdminEventSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http.post<AdminEventSearchResultData[]>(ADMIN_EVENT_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapEventDataToEventSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.events.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getHearings(formValues: AdminSearchFormValues): Observable<AdminHearingSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http.post<AdminHearingSearchResultData[]>(ADMIN_HEARING_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapHearingDataToHearingSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.hearings.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getAudioMedia(formValues: AdminSearchFormValues): Observable<AdminMediaSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    return this.http.post<AdminMediaSearchResultData[]>(ADMIN_MEDIA_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapMediaDataToMediaSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.audio.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  private handleSearchError() {
    this.searchError.set('There are more than 500 results. Refine your search.');
    return of([]);
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

  private mapHearingDataToHearingSearchResult(results: AdminHearingSearchResultData[]): AdminHearingSearchResult[] {
    return results.map((result) => ({
      caseId: result.case.id,
      caseNumber: result.case.case_number,
      hearingId: result.id,
      hearingDate: DateTime.fromFormat(result.hearing_date, 'yyyy-MM-dd'),
      courthouse: result.courthouse.display_name,
      courtroom: result.courtroom.name,
    }));
  }

  private mapMediaDataToMediaSearchResult(results: AdminMediaSearchResultData[]): AdminMediaSearchResult[] {
    return results.map((result) => ({
      id: result.id,
      courthouse: result.courthouse.display_name,
      courtroom: result.courtroom.name,
      hearingDate: DateTime.fromISO(result.start_at),
      startAt: DateTime.fromISO(result.start_at),
      endAt: DateTime.fromISO(result.end_at),
      channel: result.channel,
      isHidden: result.is_hidden,
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
