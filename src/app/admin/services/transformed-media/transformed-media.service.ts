import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaAdminData } from '@admin-types/transformed-media/transformed-media-admin-data.interface';
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
      media_request_id: searchCriteria.requestId,
      case_number: searchCriteria.caseId,
      courthouse_display_name: searchCriteria.courthouse,
      hearing_date: hearingDate,
      owner: searchCriteria.owner,
      requested_by: searchCriteria.requestedBy,
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

  // takes a date of format DD/MM/YYYY and returns YYYY-MM-DD
  private formatDate(date: string): string {
    return date.split('/').reverse().join('-');
  }
}
