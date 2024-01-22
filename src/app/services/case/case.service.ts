import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaseRetentionHistory } from '@darts-types/case-retention-history.interface';
import {
  Case,
  CaseData,
  Courthouse,
  Hearing,
  HearingData,
  SearchFormValues,
  Transcript,
  TranscriptData,
} from '@darts-types/index';
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
  searchResults$: Observable<Case[] | null> | null = null;
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

  searchCases(searchForm: SearchFormValues): Observable<Case[] | null> {
    // Save search form values
    this.searchFormValues = searchForm;

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

    // Store results in service for retrieval
    this.searchResults$ = this.http
      .get<CaseData[]>(ADVANCED_SEARCH_CASE_PATH, { params })
      .pipe(map((results) => results.map(this.mapCaseDataToCase)))
      .pipe(shareReplay(1));
    return this.searchResults$;
  }

  getHearingById(cId: number, hId: number): Observable<Hearing | undefined> {
    return this.getCaseHearings(cId).pipe(map((h) => h.find((x) => x.id == hId)));
  }

  getCaseRetentionHistory(caseId: number): Observable<CaseRetentionHistory[]> {
    let params = new HttpParams();
    params = params.set('case_id', caseId);
    return this.http.get<CaseRetentionHistory[]>(GET_CASE_RETENTION_HISTORY, { params }).pipe(
      map((hearings) => hearings.map((h) => ({ ...h, retention_date: h.retention_date + 'T00:00:00Z' }))),
      catchError(() => {
        return of([]);
      })
    );
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

  mapCaseDataToCase(c: CaseData): Case {
    return {
      id: c.case_id,
      number: c.case_number,
      courthouse: c.courthouse,
      defendants: c.defendants,
      defenders: c.defenders,
      judges: c.judges,
      reportingRestriction: c.reporting_restriction,
      reportingRestrictions: c.reporting_restrictions,
      hearings: c.hearings,
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
