import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranscriptionRequest, TranscriptionType, YourTranscriptionRequests } from '@darts-types/index';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { Observable, map } from 'rxjs';

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
}
