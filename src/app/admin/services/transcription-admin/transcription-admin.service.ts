import {
  Transcription,
  TranscriptionData,
  TranscriptionSearchFormValues,
  TranscriptionSearchRequest,
  TranscriptionStatus,
  TranscriptionStatusData,
} from '@admin-types/index';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class TranscriptionAdminService {
  http = inject(HttpClient);

  search(formValues: TranscriptionSearchFormValues): Observable<Transcription[]> {
    const body = this.mapSearchFormValuesToSearchRequest(formValues);
    return this.http
      .post<TranscriptionData[]>('api/admin/transcriptions/search', body)
      .pipe(map((res) => this.mapTranscriptionDataToTranscription(res)));
  }

  getTranscriptionStatuses(): Observable<TranscriptionStatus[]> {
    return this.http
      .get<TranscriptionStatusData[]>('api/admin/transcription-status')
      .pipe(map((res) => this.mapTransctiptionStatusDataToTranscriptionStatus(res)));
  }

  private mapTranscriptionDataToTranscription(data: TranscriptionData[]): Transcription[] {
    return data.map((transcriptionData) => ({
      id: transcriptionData.transcription_id,
      caseNumber: transcriptionData.case_number,
      courthouse: { id: transcriptionData.courthouse_id },
      hearingDate: DateTime.fromISO(transcriptionData.hearing_date),
      requestedAt: DateTime.fromISO(transcriptionData.requested_at),
      status: { id: transcriptionData.transcription_status_id },
      isManual: transcriptionData.is_manual_transcription,
    }));
  }

  private mapSearchFormValuesToSearchRequest(values: TranscriptionSearchFormValues): TranscriptionSearchRequest {
    return {
      transcription_id: values.requestId || values.requestId === '0' ? Number(values.requestId) : null,
      case_number: values.caseId || null,
      courthouse_display_name: values.courthouse || null,
      hearing_date: values.hearingDate || null,
      owner: values.owner || null,
      requested_by: values.requestedBy || null,
      requested_at_from: values.requestedDate?.from || null,
      requested_at_to: values.requestedDate?.to || null,
      is_manual_transcription:
        values.requestMethod === 'all' || !values.requestMethod
          ? null
          : values.requestMethod === 'manual'
            ? true
            : false,
    };
  }

  private mapTransctiptionStatusDataToTranscriptionStatus(data: TranscriptionStatusData[]): TranscriptionStatus[] {
    return data.map((status) => ({ id: status.id, type: status.type, displayName: status.display_name }));
  }
}
