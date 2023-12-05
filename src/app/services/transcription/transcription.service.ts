import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TranscriberRequestCounts,
  TranscriptionDetails,
  TranscriptionRequest,
  TranscriptionType,
  TranscriptionUrgency,
  WorkRequests,
  YourTranscriptionRequests,
} from '@darts-types/index';
import { TranscriberTranscriptions } from '@darts-types/transcriber-transcriptions.interface';
import { BehaviorSubject, timer, switchMap, tap, merge, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export const APPROVED_TRANSCRIPTION_STATUS_ID = 3;
export const REJECTED_TRANSCRIPTION_STATUS_ID = 4;
export const COMPLETED_TRANSCRIPTION_STATUS_ID = 6;
@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  constructor(private http: HttpClient) {}

  private readonly POLL_INTERVAL_SECS = 60;
  private readonly TRANSCRIPT_REQUEST_COUNT_POLL_INTERVAL_SECS = 30;

  // save unread count in memory
  private transcriptRequestCount = new BehaviorSubject<number>(0);
  readonly transcriptRequestCount$ = this.transcriptRequestCount.asObservable();

  transcriptRequests$ = timer(0, this.POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getTranscriberTranscriptRequests()),
    tap((transcriberTranscriptions: TranscriberTranscriptions[]) =>
      this.transcriptRequestCount.next(transcriberTranscriptions.length)
    )
  );

  pollTranscriptionRequestCount$ = timer(0, this.TRANSCRIPT_REQUEST_COUNT_POLL_INTERVAL_SECS * 1000).pipe(
    switchMap(() => this.getUnassignedTranscriptionRequestCounts())
  );

  // Merge both unread count observables into one
  transcriptRequestCounts$ = merge(
    this.pollTranscriptionRequestCount$, // Fetches count from server
    this.transcriptRequestCount$ // In memory count / manual update
  );

  getTranscriberTranscriptionRequestCounts(): Observable<TranscriberRequestCounts> {
    return this.http.get<TranscriberRequestCounts>('/api/transcriptions/transcriber-counts');
  }

  getUnassignedTranscriptionRequestCounts(): Observable<number> {
    return this.http
      .get<TranscriberRequestCounts>('/api/transcriptions/transcriber-counts')
      .pipe(map((res) => res.unassigned));
  }

  getAssignedTranscriptRequestCounts(): Observable<number> {
    return this.http
      .get<TranscriberRequestCounts>('/api/transcriptions/transcriber-counts')
      .pipe(map((res) => res.assigned));
  }

  getUrgencies(): Observable<TranscriptionUrgency[]> {
    return this.http.get<TranscriptionUrgency[]>('/api/transcriptions/urgencies');
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
    let params = new HttpParams();
    params = params.set('assigned', assigned);
    return this.http.get<WorkRequests>('/api/transcriptions/transcriber-view', { params }).pipe(
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
        return transcription;
      })
    );
  }

  getTranscriberTranscriptRequests(): Observable<TranscriberTranscriptions[]> {
    return this.http.get<TranscriberTranscriptions[]>(`/api/transcriptions/transcriber-view`, {
      params: { assigned: false },
    });
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
    return this.http.post(`/api/transcriptions/${transcriptId}/document`, formData);
  }

  completeTranscriptionRequest(transcriptId: number) {
    return this.http.patch(`/api/transcriptions/${transcriptId}`, {
      transcription_status_id: COMPLETED_TRANSCRIPTION_STATUS_ID,
    });
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
}
