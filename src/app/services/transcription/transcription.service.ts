import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  TranscriptRequest,
  TranscriptRequestData,
  TranscriptionDetails,
  TranscriptionDetailsData,
  TranscriptionRequest,
  TranscriptionType,
  Urgency,
  WorkRequest,
  WorkRequestData,
  YourTranscripts,
  YourTranscriptsData,
} from '@darts-types/index';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { DateTime } from 'luxon';
import { Observable, map, shareReplay, switchMap, tap, timer } from 'rxjs';

export const APPROVED_TRANSCRIPTION_STATUS_ID = 3;
export const REJECTED_TRANSCRIPTION_STATUS_ID = 4;
export const COMPLETED_TRANSCRIPTION_STATUS_ID = 6;

@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  luxonPipe = inject(LuxonDatePipe);
  http = inject(HttpClient);
  countService = inject(CountNotificationService);

  private readonly DATA_POLL_INTERVAL_SECS = 60;

  unassignedRequests$ = timer(0, this.DATA_POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getWorkRequests(false)),
    tap((requests: WorkRequest[]) => {
      this.countService.setUnassignedTranscriptCount(requests.length);
    })
  );

  assignedRequests$ = timer(0, this.DATA_POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getWorkRequests(true)),
    tap((requests: WorkRequest[]) => {
      this.countService.setAssignedTranscriptCount(requests.filter((r) => r.status != 'Complete').length);
    })
  );

  getUrgencies(): Observable<Urgency[]> {
    return this.http.get<Urgency[]>('/api/transcriptions/urgencies').pipe(shareReplay(1));
  }

  getTranscriptionTypes(): Observable<TranscriptionType[]> {
    return this.http.get<TranscriptionType[]>('/api/transcriptions/types');
  }

  postTranscriptionRequest(request: TranscriptionRequest): Observable<{ transcription_id: number }> {
    return this.http.post<{ transcription_id: number }>('/api/transcriptions', request);
  }

  getYourTranscripts(): Observable<YourTranscripts> {
    return this.http.get<YourTranscriptsData>('/api/transcriptions').pipe(
      switchMap((requests: YourTranscriptsData) =>
        this.getUrgencies().pipe(
          map((urgencies) => ({
            requesterTranscriptions: this.mapYourTranscriptRequestData(requests.requester_transcriptions, urgencies),
            approverTranscriptions: this.mapYourTranscriptRequestData(requests.approver_transcriptions, urgencies),
          }))
        )
      )
    );
  }

  getWorkRequests(assigned = true): Observable<WorkRequest[]> {
    return this.http
      .get<WorkRequestData[]>('/api/transcriptions/transcriber-view', { params: { assigned } })
      .pipe(
        switchMap((requests) =>
          this.getUrgencies().pipe(map((urgencies) => this.mapWorkRequestData(requests, urgencies)))
        )
      );
  }

  getTranscriptionDetails(transcriptId: number): Observable<TranscriptionDetails> {
    return this.http
      .get<TranscriptionDetailsData>(`/api/transcriptions/${transcriptId}`)
      .pipe(map(this.mapTranscriptionDetails));
  }

  deleteRequest(transcriptionIds: number[]) {
    return this.http.patch(
      `api/transcriptions`,
      transcriptionIds.map((id) => ({
        transcription_id: id,
        hide_request_from_requestor: true,
      }))
    );
  }

  uploadTranscript(transcriptId: string, file: File) {
    const formData = new FormData();
    formData.append('transcript', file, file.name);
    return this.http.post(`/api/transcriptions/${transcriptId}/document`, formData).pipe(
      tap(() => {
        this.countService.decrementAssignedTranscriptCount();
      })
    );
  }

  completeTranscriptionRequest(transcriptId: number) {
    return this.http
      .patch(`/api/transcriptions/${transcriptId}`, {
        transcription_status_id: COMPLETED_TRANSCRIPTION_STATUS_ID,
      })
      .pipe(
        tap(() => {
          this.countService.decrementAssignedTranscriptCount();
        })
      );
  }

  approveTranscriptionRequest(transcriptId: number) {
    return this.http.patch(`/api/transcriptions/${transcriptId}`, {
      transcription_status_id: APPROVED_TRANSCRIPTION_STATUS_ID,
    });
  }

  rejectTranscriptionRequest(transcriptId: number, rejectReason: string) {
    return this.http.patch(`/api/transcriptions/${transcriptId}`, {
      transcription_status_id: REJECTED_TRANSCRIPTION_STATUS_ID,
      workflow_comment: rejectReason,
    });
  }

  assignTranscript(transcriptId: number) {
    return this.http
      .patch(`/api/transcriptions/${transcriptId}`, {
        transcription_status_id: 5,
      })
      .pipe(
        tap(() => {
          this.countService.decrementUnassignedTranscriptCount();
          this.countService.incrementAssignedTranscriptCount();
        })
      );
  }

  downloadTranscriptDocument(transcriptId: number): Observable<Blob> {
    return this.http.get(`/api/transcriptions/${transcriptId}/document`, { responseType: 'blob' });
  }

  getCaseDetailsFromTranscript(transcript: TranscriptionDetails) {
    return {
      'Case ID': transcript.caseNumber,
      Courthouse: transcript.courthouse,
      'Judge(s)': transcript.judges,
      'Defendant(s)': transcript.defendants,
    };
  }

  getRequestDetailsFromTranscript(transcript: TranscriptionDetails) {
    return {
      'Hearing Date': this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
      'Request Type': transcript.requestType,
      'Request ID': transcript.transcriptionId,
      Urgency: transcript.urgency,
      'Audio for transcript':
        transcript.transcriptionStartTs && transcript.transcriptionEndTs
          ? 'Start time ' +
            this.luxonPipe.transform(transcript.transcriptionStartTs, 'HH:mm:ss') +
            ' - End time ' +
            this.luxonPipe.transform(transcript.transcriptionEndTs, 'HH:mm:ss')
          : '',
      Requested: transcript.from,
      Received: this.luxonPipe.transform(transcript.received, 'dd MMM yyyy HH:mm:ss'),
      Instructions: transcript.requestorComments,
      'Judge approval': 'Yes',
    };
  }

  getHearingRequestDetailsFromTranscript(transcript: TranscriptionDetails) {
    return {
      'Hearing Date': this.luxonPipe.transform(transcript.hearingDate, 'dd MMM yyyy'),
      'Request Type': transcript.requestType,
      'Request ID': transcript.transcriptionId,
      Urgency: transcript.urgency,
      'Audio for transcript':
        transcript.transcriptionStartTs && transcript.transcriptionEndTs
          ? 'Start time ' +
            this.luxonPipe.transform(transcript.transcriptionStartTs, 'HH:mm:ss') +
            ' - End time ' +
            this.luxonPipe.transform(transcript.transcriptionEndTs, 'HH:mm:ss')
          : '',
    };
  }

  getUrgencyByDescription(urgencies: Urgency[], description: string): Urgency {
    return (
      urgencies.find((u) => u.description === description) ?? {
        transcription_urgency_id: 0,
        description: '-',
        priority_order: 999,
      }
    );
  }

  private mapYourTranscriptRequestData(requests: TranscriptRequestData[], urgencies: Urgency[]): TranscriptRequest[] {
    return requests.map((r) => ({
      transcriptionId: r.transcription_id,
      caseId: r.case_id,
      caseNumber: r.case_number,
      courthouseName: r.courthouse_name,
      hearingDate: DateTime.fromISO(r.hearing_date),
      transcriptionType: r.transcription_type,
      status: r.status,
      urgency: this.getUrgencyByDescription(urgencies, r.urgency),
      requestedTs: DateTime.fromISO(r.requested_ts),
    }));
  }

  private mapWorkRequestData(requests: WorkRequestData[], urgencies: Urgency[]): WorkRequest[] {
    return requests.map((r) => ({
      transcriptionId: r.transcription_id,
      caseId: r.case_id,
      caseNumber: r.case_number,
      courthouseName: r.courthouse_name,
      hearingDate: DateTime.fromISO(r.hearing_date),
      transcriptionType: r.transcription_type,
      status: r.status,
      urgency: this.getUrgencyByDescription(urgencies, r.urgency),
      requestedTs: DateTime.fromISO(r.requested_ts),
      stateChangeTs: DateTime.fromISO(r.state_change_ts),
      isManual: r.is_manual,
    }));
  }

  private mapTranscriptionDetails(transcription: TranscriptionDetailsData): TranscriptionDetails {
    return {
      caseReportingRestrictions: transcription.case_reporting_restrictions,
      caseId: transcription.case_id,
      caseNumber: transcription.case_number,
      courthouse: transcription.courthouse,
      status: transcription.status,
      from: transcription.from,
      received: transcription.received ? DateTime.fromISO(transcription.received) : undefined,
      requestorComments: transcription.requestor_comments,
      rejectionReason: transcription.rejection_reason,
      defendants: transcription.defendants,
      judges: transcription.judges,
      transcriptFileName: transcription.transcript_file_name ?? 'Document not found',
      hearingDate: DateTime.fromISO(transcription.hearing_date),
      urgency: transcription.urgency,
      requestType: transcription.request_type,
      transcriptionId: transcription.transcription_id,
      transcriptionStartTs: DateTime.fromISO(transcription.transcription_start_ts),
      transcriptionEndTs: DateTime.fromISO(transcription.transcription_end_ts),
      isManual: transcription.is_manual,
      hearingId: transcription.hearing_id,
    };
  }
}
