import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { AssociatedMediaData } from '@admin-types/transformed-media/associated-media-data.interface';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaAdminData } from '@admin-types/transformed-media/transformed-media-admin-data.interface';
import { TransformedMediaRequest } from '@admin-types/transformed-media/transformed-media-request';
import { TransformedMediaRequestData } from '@admin-types/transformed-media/transformed-media-request-data.interface';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransformedMediaService {
  http = inject(HttpClient);

  searchTransformedMedia(searchCriteria: TransformedMediaSearchFormValues): Observable<TransformedMediaAdmin[]> {
    const body = this.mapSearchCriteriaToSearchRequest(searchCriteria);
    return this.http
      .post<TransformedMediaAdminData[]>('/api/admin/transformed-medias/search', body)
      .pipe(map((data) => this.mapTransformedMedias(data)));
  }

  getTransformedMediaById(id: number): Observable<TransformedMediaAdmin> {
    return this.http
      .get<TransformedMediaAdminData>(`/api/admin/transformed-medias/${id}`)
      .pipe(map((data) => this.mapTransformedMedia(data)));
  }

  getMediaRequestById(id: number): Observable<TransformedMediaRequest> {
    return this.http
      .get<TransformedMediaRequestData>(`/api/admin/media-requests/${id}`)
      .pipe(map((data) => this.mapTransformedMediaRequest(data)));
  }

  getAssociatedMediaByTransformedMediaId(id: number): Observable<AssociatedMedia[]> {
    return this.http
      .get<AssociatedMediaData[]>('/api/admin/medias', { params: { transformed_media_id: id.toString() } })
      .pipe(map((data) => this.mapAssociatedMedias(data)));
  }

  getAssociatedMediaByTranscriptionDocumentId(id: number): Observable<AssociatedMedia[]> {
    return this.http
      .get<AssociatedMediaData[]>('/api/admin/medias', { params: { transcription_document_id: id.toString() } })
      .pipe(map((data) => this.mapAssociatedMedias(data)));
  }

  changeMediaRequestOwner(mediaRequestId: number, newOwnerId: number): Observable<void> {
    return this.http.patch<void>(`/api/admin/media-requests/${mediaRequestId}`, { owner_id: newOwnerId });
  }

  private mapAssociatedMedias(data: AssociatedMediaData[]): AssociatedMedia[] {
    return data.map((data) => this.mapAssociatedMedia(data));
  }

  private mapAssociatedMedia(data: AssociatedMediaData): AssociatedMedia {
    return {
      id: data.id,
      channel: data.channel,
      startAt: DateTime.fromISO(data.start_at),
      endAt: DateTime.fromISO(data.end_at),
      case: {
        id: data.case.id,
        caseNumber: data.case.case_number,
      },
      hearing: {
        id: data.hearing.id,
        hearingDate: DateTime.fromISO(data.hearing.hearing_date),
      },
      courthouse: {
        id: data.courthouse.id,
        displayName: data.courthouse.display_name,
      },
      courtroom: {
        id: data.courtroom.id,
        name: data.courtroom.name,
      },
    };
  }

  private mapSearchCriteriaToSearchRequest(searchCriteria: TransformedMediaSearchFormValues) {
    const hearingDate = searchCriteria.hearingDate ? this.formatDate(searchCriteria.hearingDate) : null;
    const requestedDateSpecific = searchCriteria.requestedDate?.specific
      ? this.formatDate(searchCriteria.requestedDate?.specific)
      : null;
    const requestedDateFrom = searchCriteria.requestedDate?.from
      ? this.formatDate(searchCriteria.requestedDate?.from)
      : null;
    const requestedDateTo = searchCriteria.requestedDate?.to ? this.formatDate(searchCriteria.requestedDate?.to) : null;

    return {
      media_request_id: searchCriteria.requestId ? searchCriteria.requestId : null,
      case_number: searchCriteria.caseId ? searchCriteria.caseId : null,
      courthouse_display_name: searchCriteria.courthouse ? searchCriteria.courthouse : null,
      hearing_date: hearingDate,
      owner: searchCriteria.owner ? searchCriteria.owner : null,
      requested_by: searchCriteria.requestedBy ? searchCriteria.requestedBy : null,
      requested_at_from: requestedDateSpecific ?? requestedDateFrom ?? null,
      requested_at_to: requestedDateSpecific ?? requestedDateTo ?? null,
    };
  }

  private mapTransformedMedias(mapTransformedMediaData: TransformedMediaAdminData[]): TransformedMediaAdmin[] {
    return mapTransformedMediaData.map((data) => this.mapTransformedMedia(data));
  }

  private mapTransformedMedia(data: TransformedMediaAdminData): TransformedMediaAdmin {
    return {
      id: data.id,
      fileName: data.file_name,
      fileFormat: data.file_format,
      fileSizeBytes: data.file_size_bytes,
      mediaRequest: {
        id: data.media_request.id,
        requestedAt: DateTime.fromISO(data.media_request.requested_at),
        ownerUserId: data.media_request.owner_user_id,
        requestedByUserId: data.media_request.requested_by_user_id,
      },
      case: {
        id: data.case.id,
        caseNumber: data.case.case_number,
      },
      courthouse: {
        id: data.courthouse.id,
        displayName: data.courthouse.display_name,
      },
      hearing: {
        id: data.hearing.id,
        hearingDate: DateTime.fromISO(data.hearing.hearing_date),
      },
      lastAccessedAt: DateTime.fromISO(data.last_accessed_at),
    };
  }

  private mapTransformedMediaRequest(data: TransformedMediaRequestData): TransformedMediaRequest {
    return {
      id: data.id,
      startAt: DateTime.fromISO(data.start_at),
      endAt: DateTime.fromISO(data.end_at),
      requestedAt: DateTime.fromISO(data.requested_at),
      hearing: {
        id: data.hearing.id,
        hearingDate: DateTime.fromISO(data.hearing.hearing_date),
      },
      courtroom: {
        id: data.courtroom.id,
        name: data.courtroom.name,
      },
      requestedById: data.requested_by_id,
      ownerId: data.owner_id,
    };
  }

  // takes a date of format DD/MM/YYYY and returns YYYY-MM-DD
  private formatDate(date: string): string {
    return date.split('/').reverse().join('-');
  }
}
