import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaseEvent } from '@portal-types/events/case-event';
import { CaseEventData } from '@portal-types/events/case-event-data.interface';
import {
  Annotations,
  AnnotationsData,
  Case,
  CaseData,
  CaseRetentionChange,
  CaseRetentionHistory,
  CaseRetentionHistoryData,
  CaseSearchFormValues,
  CaseSearchRequest,
  CaseSearchResult,
  CaseSearchResultData,
  Hearing,
  HearingData,
  Transcript,
  TranscriptData,
} from '@portal-types/index';
import { MappingService } from '@services/mapping/mapping.service';
import { formatDate } from '@utils/index';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs/internal/Observable';
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

  //Returns hearings in a sorted ascending order
  getCaseHearings(caseId: number): Observable<Hearing[]> {
    return this.http.get<HearingData[]>(`${GET_CASE_PATH}/${caseId}/hearings`).pipe(
      map(this.mapHearingDataToHearing),
      map((hearings) => hearings.sort((a, b) => a.date.toMillis() - b.date.toMillis()))
    );
  }

  getCaseEvents(caseId: number): Observable<CaseEvent[]> {
    return this.http
      .get<CaseEventData[]>(`${GET_CASE_PATH}/${caseId}/events`)
      .pipe(map((events) => this.mapCaseEventData(events)));
  }

  getCaseAnnotations(caseId: number): Observable<Annotations[]> {
    const mappingService = new MappingService();
    return this.http
      .get<AnnotationsData[]>(`${GET_CASE_PATH}/${caseId}/annotations`)
      .pipe(map(mappingService.mapAnnotationsDataToAnnotations));
  }

  searchCases(searchFormValues: CaseSearchFormValues): Observable<CaseSearchResult[] | null> {
    const body = this.mapSearchFormValuesToCaseSearchRequest(searchFormValues);
    return this.http
      .post<CaseData[]>(ADVANCED_SEARCH_CASE_PATH, body)
      .pipe(map((results) => results.map(this.mapCaseDataToCaseSearchResult)))
      .pipe(shareReplay(1));
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
      status: t.status === 'Approved' ? 'With Transcriber' : t.status,
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
      courtrooms: Array.from(new Set(c.hearings?.map((h) => h.courtroom))),
      isDataAnonymised: c.is_data_anonymised,
      dataAnonymisedAt: c.data_anonymised_at ? DateTime.fromISO(c.data_anonymised_at) : undefined,
    };
  }

  private mapCaseDataToCase(c: CaseData): Case {
    return {
      id: c.case_id,
      number: c.case_number,
      courthouse: c.courthouse,
      courthouseId: c.courthouse_id,
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
      isDataAnonymised: c.is_data_anonymised,
      dataAnonymisedAt: c.data_anonymised_at ? DateTime.fromISO(c.data_anonymised_at) : undefined,
    };
  }

  private mapCaseEventData(events: CaseEventData[]) {
    return events.map((e) => ({
      id: e.id,
      hearingId: e.hearing_id,
      hearingDate: DateTime.fromISO(e.hearing_date),
      timestamp: DateTime.fromISO(e.timestamp),
      name: e.name,
      text: e.text,
    }));
  }

  private mapSearchFormValuesToCaseSearchRequest(searchFormValues: CaseSearchFormValues): CaseSearchRequest {
    // if there is a specific date, set both date from and date to as the same value, to the correct backend format of YYYY-MM-DD
    let dateFrom, dateTo;

    if (searchFormValues.hearingDate.type === 'specific') {
      dateFrom = formatDate(searchFormValues.hearingDate.specific);
      dateTo = formatDate(searchFormValues.hearingDate.specific);
    }

    if (searchFormValues.hearingDate.type === 'range') {
      dateFrom = formatDate(searchFormValues.hearingDate.from);
      dateTo = formatDate(searchFormValues.hearingDate.to);
    }

    return {
      case_number: searchFormValues.caseNumber || null,
      courthouse: searchFormValues.courthouse || null,
      courtroom: searchFormValues.courtroom || null,
      date_from: dateFrom || null,
      date_to: dateTo || null,
      judge_name: searchFormValues.judgeName || null,
      defendant_name: searchFormValues.defendantName || null,
      event_text_contains: searchFormValues.eventTextContains || null,
    };
  }
}
