import { AudioFile, AudioFileData } from '@admin-types/index';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { AssociatedMediaData } from '@admin-types/transformed-media/associated-media-data.interface';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import {
  TransformedMediaAdminData,
  TransformedMediaByIdAdminData,
} from '@admin-types/transformed-media/transformed-media-admin-data.interface';
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
      .get<TransformedMediaByIdAdminData>(`/api/admin/transformed-medias/${id}`)
      .pipe(map((data) => this.mapTransformedMediaById(data)));
  }

  getMediaRequestById(id: number): Observable<TransformedMediaRequest> {
    return this.http
      .get<TransformedMediaRequestData>(`/api/admin/media-requests/${id}`)
      .pipe(map((data) => this.mapTransformedMediaRequest(data)));
  }

  getMediaById(id: number): Observable<AudioFile> {
    return this.http.get<AudioFileData>(`/api/admin/medias/${id}`).pipe(map((data) => this.mapAudioFileData(data)));
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
        displayName: data.courtroom.display_name,
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

  private mapTransformedMediaById(data: TransformedMediaByIdAdminData): TransformedMediaAdmin {
    return {
      id: data.id,
      fileName: data.file_name,
      fileFormat: data.file_format,
      fileSizeBytes: data.file_size_bytes,
      mediaRequest: { id: data.media_request_id },
      case: { id: data.case_id },
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

  private mapAudioFileData(data: AudioFileData): AudioFile {
    return {
      id: data.id,
      startAt: DateTime.fromISO(data.start_at),
      endAt: DateTime.fromISO(data.end_at),
      channel: data.channel,
      totalChannels: data.total_channels,
      mediaType: data.media_type,
      mediaFormat: data.media_format,
      fileSizeBytes: data.file_size_bytes,
      filename: data.filename,
      mediaObjectId: data.media_object_id,
      contentObjectId: data.content_object_id,
      clipId: data.clip_id,
      referenceId: data.reference_id,
      checksum: data.checksum,
      mediaStatus: data.media_status,
      isHidden: data.is_hidden,
      isDeleted: data.is_deleted,
      adminAction: {
        id: data.admin_action.id,
        reasonId: data.admin_action.reason_id,
        hiddenById: data.admin_action.hidden_by_id,
        hiddenAt: DateTime.fromISO(data.admin_action.hidden_at),
        isMarkedForManualDeletion: data.admin_action.is_marked_for_manual_deletion,
        markedForManualDeletionById: data.admin_action.marked_for_manual_deletion_by_id,
        markedForManualDeletionAt: DateTime.fromISO(data.admin_action.marked_for_manual_deletion_at),
        ticketReference: data.admin_action.ticket_reference,
        comments: data.admin_action.comments,
      },
      version: data.version,
      chronicleId: data.chronicle_id,
      antecedentId: data.antecedent_id,
      retainUntil: DateTime.fromISO(data.retain_until),
      createdAt: DateTime.fromISO(data.created_at),
      createdById: data.created_by_id,
      lastModifiedAt: DateTime.fromISO(data.last_modified_at),
      lastModifiedById: data.last_modified_by_id,
      courthouse: {
        id: data.courthouse.id,
        displayName: data.courthouse.display_name,
      },
      courtroom: {
        id: data.courtroom.id,
        name: data.courtroom.name,
      },
      hearings: data.hearings.map((hearing) => ({
        id: hearing.id,
        hearingDate: DateTime.fromISO(hearing.hearing_date),
        caseId: hearing.case_id,
      })),
    };
  }
}
