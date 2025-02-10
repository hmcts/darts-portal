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
import { formatDate } from '@utils/date.utils';
import { DateTime } from 'luxon';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { UserService } from '@services/user/user.service';

export const ADMIN_CASE_SEARCH_PATH = '/api/admin/cases/search';
export const ADMIN_EVENT_SEARCH_PATH = '/api/admin/events/search';
export const ADMIN_HEARING_SEARCH_PATH = '/api/admin/hearings/search';
export const ADMIN_MEDIA_SEARCH_PATH = '/api/admin/medias/search';

enum SearchType {
  CASE = 'CASE',
  HEARING = 'HEARING',
  EVENT = 'EVENT',
  AUDIO = 'AUDIO',
}

interface SearchResultBody {
  courthouse_ids: number[];
  case_number: string | null;
  courtroom_name: string | null;
  hearing_start_at: string | null;
  hearing_end_at: string | null;
}

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
  appInsightsService = inject(AppInsightsService);
  userService = inject(UserService);

  // signals to store previous search results and search form state
  formValues = signal<AdminSearchFormValues>({ ...defaultFormValues });
  hasFormBeenSubmitted = signal<boolean>(false);
  cases = signal<AdminCaseSearchResult[]>([]);
  events = signal<AdminEventSearchResult[]>([]);
  hearings = signal<AdminHearingSearchResult[]>([]);
  audio = signal<AdminMediaSearchResult[]>([]);
  searchError = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  getCases(formValues: AdminSearchFormValues): Observable<AdminCaseSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    this.logSearchEvent(SearchType.CASE, requestBody);
    return this.http.post<AdminCaseSearchResultData[]>(ADMIN_CASE_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapCaseDataToCaseSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.cases.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getEvents(formValues: AdminSearchFormValues): Observable<AdminEventSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    this.logSearchEvent(SearchType.EVENT, requestBody);
    return this.http.post<AdminEventSearchResultData[]>(ADMIN_EVENT_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapEventDataToEventSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.events.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getHearings(formValues: AdminSearchFormValues): Observable<AdminHearingSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    this.logSearchEvent(SearchType.HEARING, requestBody);
    return this.http.post<AdminHearingSearchResultData[]>(ADMIN_HEARING_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapHearingDataToHearingSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.hearings.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  getAudioMedia(formValues: AdminSearchFormValues): Observable<AdminMediaSearchResult[]> {
    const requestBody = this.mapAdminSearchFormValuesToSearchRequest(formValues);
    this.logSearchEvent(SearchType.AUDIO, requestBody);
    return this.http.post<AdminMediaSearchResultData[]>(ADMIN_MEDIA_SEARCH_PATH, requestBody).pipe(
      map((results) => this.mapMediaDataToMediaSearchResult(results)),
      catchError(() => this.handleSearchError()),
      tap((results) => this.audio.set(results)),
      finalize(() => this.isLoading.set(false))
    );
  }

  clearSearch() {
    this.cases.set([]);
    this.events.set([]);
    this.hearings.set([]);
    this.audio.set([]);
    this.searchError.set(null);
    this.isLoading.set(false);
    this.formValues.set({ ...defaultFormValues });
    this.hasFormBeenSubmitted.set(false);
  }

  private logSearchEvent(type: SearchType, formValues: SearchResultBody) {
    this.appInsightsService.logEvent(`ADMIN_PORTAL::${type}_SEARCH`, {
      userId: this.userService.userState()?.userId,
      ...formValues,
    });
  }

  private handleSearchError() {
    this.searchError.set('There are more than 1000 results. Refine your search.');
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
      isDataAnonymised: result.is_data_anonymised,
      dataAnonymisedAt: result.data_anonymised_at ? DateTime.fromISO(result.data_anonymised_at) : undefined,
    }));
  }

  private mapEventDataToEventSearchResult(results: AdminEventSearchResultData[]): AdminEventSearchResult[] {
    return results.map((result) => ({
      id: result.id,
      eventTs: DateTime.fromISO(result.event_ts),
      name: result.name,
      text: result.text,
      chronicleId: result.chronicle_id,
      antecedentId: result.antecedent_id,
      courthouse: result.courthouse.display_name,
      courtroom: result.courtroom.name,
      isEventAnonymised: result.is_event_anonymised,
      isCaseExpired: result.is_case_expired,
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

  private mapAdminSearchFormValuesToSearchRequest(formValues: AdminSearchFormValues): SearchResultBody {
    const { hearingDate, courthouses, caseId, courtroom } = formValues;
    let hearing_start_at, hearing_end_at;

    switch (hearingDate.type) {
      case 'specific':
        hearing_start_at = formatDate(hearingDate.specific);
        hearing_end_at = formatDate(hearingDate.specific);
        break;
      case 'range':
        hearing_start_at = formatDate(hearingDate.from);
        hearing_end_at = formatDate(hearingDate.to);
        break;
    }

    return {
      courthouse_ids: courthouses.map((c) => c.id),
      case_number: caseId ? caseId : null,
      courtroom_name: courtroom ? courtroom.toUpperCase() : null,
      hearing_start_at: hearing_start_at ?? null,
      hearing_end_at: hearing_end_at ?? null,
    };
  }
}
