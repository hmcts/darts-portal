import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TranscriptionDetails,
  TranscriptionRequest,
  TranscriptionType,
  TranscriptionUrgency,
  WorkRequests,
  YourTranscriptionRequests,
} from '@darts-types/index';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

export const COMPLETED_TRANSCRIPTION_STATUS_ID = 6;
@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  constructor(private http: HttpClient) {}

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

  getWorkRequests(): Observable<WorkRequests> {
    let params = new HttpParams();
    params = params.set('assigned', false);
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
}
