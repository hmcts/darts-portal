import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  TranscriptionDetails,
  TranscriptionRequest,
  TranscriptionType,
  TranscriptionUrgency,
  UserTranscriptionRequest,
  WorkRequests,
  YourTranscriptionRequests,
} from '@darts-types/index';
import { CountNotificationService } from '@services/count-notification/count-notification.service';
import { map, shareReplay, switchMap, tap, timer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export const APPROVED_TRANSCRIPTION_STATUS_ID = 3;
export const REJECTED_TRANSCRIPTION_STATUS_ID = 4;
export const COMPLETED_TRANSCRIPTION_STATUS_ID = 6;
@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  datePipe = inject(DatePipe);
  http = inject(HttpClient);
  countService = inject(CountNotificationService);

  private readonly DATA_POLL_INTERVAL_SECS = 60;

  unassignedRequests$ = timer(0, this.DATA_POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getWorkRequests(false)),
    tap((requests: WorkRequests) => {
      this.countService.setUnassignedTranscriptCount(requests.length);
    })
  );

  assignedRequests$ = timer(0, this.DATA_POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getWorkRequests(true)),
    tap((requests: WorkRequests) => {
      this.countService.setAssignedTranscriptCount(requests.filter((r) => r.status != 'Complete').length);
    })
  );

  getUrgencies(): Observable<TranscriptionUrgency[]> {
    return this.http.get<TranscriptionUrgency[]>('/api/transcriptions/urgencies').pipe(shareReplay(1));
  }

  getTranscriptionTypes(): Observable<TranscriptionType[]> {
    return this.http.get<TranscriptionType[]>('/api/transcriptions/types');
  }

  postTranscriptionRequest(request: TranscriptionRequest): Observable<{ transcription_id: number }> {
    return this.http.post<{ transcription_id: number }>('/api/transcriptions', request);
  }

  getTranscriptionRequests(): Observable<YourTranscriptionRequests> {
    return this.http.get<YourTranscriptionRequests>('/api/transcriptions').pipe(
      map((requests) => {
        return {
          requester_transcriptions: requests.requester_transcriptions.map((r) => ({
            ...r,
            hearing_date: r.hearing_date + 'T00:00:00Z',
          })),
          approver_transcriptions: requests.approver_transcriptions.map((r) => ({
            ...r,
            hearing_date: r.hearing_date + 'T00:00:00Z',
          })),
        };
      })
    );
  }

  getWorkRequests(assigned = true): Observable<WorkRequests> {
    return this.http.get<WorkRequests>('/api/transcriptions/transcriber-view', { params: { assigned } }).pipe(
      map((workRequests) => {
        return workRequests.map((workRequest) => ({
          ...workRequest,
          hearing_date: workRequest.hearing_date + 'T00:00:00Z',
        }));
      })
    );
  }

  getTranscriptionDetails(transcriptId: number): Observable<TranscriptionDetails> {
    return this.http.get<TranscriptionDetails>(`/api/transcriptions/${transcriptId}`).pipe(
      map((transcription: TranscriptionDetails) => {
        transcription.transcript_file_name = transcription.transcript_file_name ?? 'Document not found';
        transcription.hearing_date += 'T00:00:00Z';
        return transcription;
      })
    );
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
      'Case ID': transcript.case_number,
      Courthouse: transcript.courthouse,
      'Judge(s)': transcript.judges,
      'Defendant(s)': transcript.defendants,
    };
  }

  getRequestDetailsFromTranscript(transcript: TranscriptionDetails) {
    return {
      'Hearing Date': this.datePipe.transform(transcript.hearing_date, 'dd MMM yyyy'),
      'Request Type': transcript.request_type,
      'Request ID': transcript.transcription_id,
      Urgency: transcript.urgency,
      'Audio for transcript':
        'Start time ' +
        this.datePipe.transform(transcript.transcription_start_ts, 'HH:mm:ss') +
        ' - End time ' +
        this.datePipe.transform(transcript.transcription_end_ts, 'HH:mm:ss'),
      From: transcript.from,
      Received: this.datePipe.transform(transcript.received, 'dd MMM yyyy HH:mm:ss'),
      Instructions: transcript.requestor_comments,
      'Judge approval': 'Yes',
    };
  }

  public mapTranscriptUrgencies() {
    return switchMap((requests: UserTranscriptionRequest[]) =>
      this.getUrgencies().pipe(
        map((urgencies) => requests.map((r) => ({ ...r, urgency: this.getUrgencyByDescription(urgencies, r.urgency) })))
      )
    );
  }

  getUrgencyByDescription(urgencies: TranscriptionUrgency[], description: string) {
    return urgencies.find((u) => u.description === description);
  }
}
