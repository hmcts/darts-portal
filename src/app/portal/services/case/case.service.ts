import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Courthouse } from '@core-types/index';
import {
  Case,
  CaseData,
  CaseRetentionChange,
  CaseRetentionHistory,
  CaseRetentionHistoryData,
  CaseSearchResult,
  CaseSearchResultData,
  Hearing,
  HearingData,
  SearchFormValues,
  Transcript,
  TranscriptData,
} from '@portal-types/index';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';

export const GET_COURTHOUSES_PATH = '/api/courthouses';
export const GET_CASE_PATH = '/api/cases';
export const GET_HEARINGS_PATH = 'api/hearings';
export const ADVANCED_SEARCH_CASE_PATH = '/api/cases/search';
export const GET_CASE_RETENTION_HISTORY = '/api/retentions';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  constructor(private readonly http: HttpClient) {}

  // Store for previous search results and form values
  searchResults$: Observable<CaseSearchResult[] | null> | null = null;
  searchFormValues: SearchFormValues | null = null;

  getCourthouses(): Observable<Courthouse[]> {
    return this.http.get<Courthouse[]>(GET_COURTHOUSES_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getHearingTranscripts(hearingId: number): Observable<Transcript[]> {
    const url = `${GET_HEARINGS_PATH}/${hearingId}/transcripts`;
    return this.http.get<TranscriptData[]>(url).pipe(map(this.mapTranscriptDataToTranscript));
  }

  getCaseTranscripts(caseId: number): Observable<Transcript[]> {
    const url = `${GET_CASE_PATH}/${caseId}/transcripts`;
    return this.http.get<TranscriptData[]>(url).pipe(map(this.mapTranscriptDataToTranscript));
  }

  getCase(caseId: number): Observable<Case> {
    const apiURL = `${GET_CASE_PATH}/${caseId}`;
    return this.http.get<CaseData>(apiURL).pipe(map(this.mapCaseDataToCase));
  }

  getCaseHearings(caseId: number): Observable<Hearing[]> {
    return this.http.get<HearingData[]>(`${GET_CASE_PATH}/${caseId}/hearings`).pipe(map(this.mapHearingDataToHearing));
  }

  searchCases(searchForm: SearchFormValues): Observable<CaseSearchResult[] | null> {
    // Save search form values
    this.searchFormValues = searchForm;
    // Deep copy form to create Post Obj DTO
    const body: SearchFormValues = { ...searchForm };

    // if there is a specific date, set both date from and date to as the same value, to the correct backend format of YYYY-MM-DD
    if (body.specific_date) {
      const specificDate = this.formatDate(body.specific_date);
      body.date_from = specificDate;
      body.date_to = specificDate;
    } else {
      // otherwise set date range values to the correct backend format
      if (body.date_from) body.date_from = this.formatDate(body.date_from);
      if (body.date_to) body.date_to = this.formatDate(body.date_to);
    }

    // remove the specific date property before sending
    delete body.specific_date;

    // Store results in service for retrieval
    this.searchResults$ = this.http
      .post<CaseData[]>(ADVANCED_SEARCH_CASE_PATH, body)
      .pipe(map((results) => results.map(this.mapCaseDataToCaseSearchResult)))
      .pipe(shareReplay(1));
    return this.searchResults$;
  }

  // takes a date of format DD/MM/YYYY and returns YYYY-MM-DD
  formatDate(date: string): string {
    return date.split('/').reverse().join('-');
  }

  /**
   * @param {number} cId Required parameter, representing the case id to look for
   * @param {number} hId Required parameter, representing the hearing id to look for
   * @returns {Observable<Hearing | undefined> | undefined} Returns either a Observable of Hearing, or undefined
   */
  getHearingById(cId: number, hId: number): Observable<Hearing | undefined> {
    return this.getCaseHearings(cId).pipe(map((h) => h.find((x) => x.id == hId)));
  }

  getCaseRetentionHistory(caseId: number): Observable<CaseRetentionHistory[]> {
    let params = new HttpParams();
    params = params.set('case_id', caseId);
    return this.http
      .get<CaseRetentionHistoryData[]>(GET_CASE_RETENTION_HISTORY, { params })
      .pipe(map(this.mapCaseRetentionHistory));
  }

  postCaseRetentionChange(retentionChange: CaseRetentionChange): Observable<CaseRetentionChange> {
    return this.http.post<CaseRetentionChange>(GET_CASE_RETENTION_HISTORY, retentionChange);
  }

  postCaseRetentionDateValidate(retentionChange: CaseRetentionChange): Observable<CaseRetentionChange> {
    let params = new HttpParams();
    params = params.set('validate_only', true);
    return this.http.post<CaseRetentionChange>(GET_CASE_RETENTION_HISTORY, retentionChange, { params });
  }

  private mapCaseRetentionHistory(retentionHistory: CaseRetentionHistoryData[]): CaseRetentionHistory[] {
    return retentionHistory.map((r) => ({
      retentionLastChangedDate: DateTime.fromISO(r.retention_last_changed_date),
      retentionDate: DateTime.fromISO(r.retention_date),
      amendedBy: r.amended_by,
      retentionPolicyApplied: r.retention_policy_applied,
      comments: r.comments,
      status: r.status,
    }));
  }

  private mapHearingDataToHearing(hearingData: HearingData[]): Hearing[] {
    return hearingData.map((h) => ({
      id: h.id,
      date: DateTime.fromISO(h.date),
      judges: h.judges,
      courtroom: h.courtroom,
      transcriptCount: h.transcript_count,
    }));
  }

  private mapTranscriptDataToTranscript(transcriptData: TranscriptData[]): Transcript[] {
    return transcriptData.map((t) => ({
      id: t.transcription_id,
      hearingId: t.hearing_id,
      hearingDate: DateTime.fromISO(t.hearing_date),
      type: t.type,
      requestedOn: DateTime.fromISO(t.requested_on),
      requestedByName: t.requested_by_name,
      status: t.status,
    }));
  }

  private mapCaseDataToCaseSearchResult(c: CaseSearchResultData): CaseSearchResult {
    return {
      id: c.case_id,
      number: c.case_number,
      courthouse: c.courthouse,
      defendants: c.defendants,
      judges: c.judges,
      reportingRestriction: c.reporting_restriction,
      hearings: c.hearings,
    };
  }

  private mapCaseDataToCase(c: CaseData): Case {
    return {
      id: c.case_id,
      number: c.case_number,
      courthouse: c.courthouse,
      defendants: c.defendants,
      defenders: c.defenders,
      judges: c.judges,
      reportingRestrictions: c.reporting_restrictions,
      prosecutors: c.prosecutors,
      retainUntil: c.retain_until,
      retainUntilDateTime: c.retain_until_date_time ? DateTime.fromISO(c.retain_until_date_time) : undefined,
      closedDateTime: c.case_closed_date_time ? DateTime.fromISO(c.case_closed_date_time) : undefined,
      retentionDateTimeApplied: c.retention_date_time_applied
        ? DateTime.fromISO(c.retention_date_time_applied)
        : undefined,
      retentionPolicyApplied: c.retention_policy_applied,
    };
  }
}
