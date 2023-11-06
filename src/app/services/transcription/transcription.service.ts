import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranscriptionRequest } from '@darts-types/index';
import { TranscriptionType } from '@darts-types/transcription-type.interface';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { Observable } from 'rxjs';

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
}
