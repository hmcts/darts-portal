import { CaseAudioData, PaginatedCaseAudioData } from '@admin-types/case/case-audio/case-audio.interface';
import { CaseAudio, PaginatedCaseAudio } from '@admin-types/case/case-audio/case-audio.type';
import { AdminCaseData } from '@admin-types/case/case.interface';
import { AdminCase } from '@admin-types/case/case.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminCaseService {
  http = inject(HttpClient);

  getCase(id: number): Observable<AdminCase> {
    return this.http.get<AdminCaseData>(`/api/admin/cases/${id}`).pipe(map(this.mapCaseDataToCase));
  }

  getCaseAudio(
    id: number,
    options: {
      page_number: number;
      page_size: number;
      sort_by?: 'audioId' | 'startTime' | 'endTime' | 'courtroom' | 'channel';
      sort_order?: 'asc' | 'desc';
    }
  ): Observable<PaginatedCaseAudio> {
    const params: Record<string, string | number> = {
      page_number: options.page_number,
      page_size: options.page_size,
    };

    if (options.sort_by) {
      params.sort_by = options.sort_by;
    }

    if (options.sort_order) {
      params.sort_order = options.sort_order.toUpperCase();
    }

    return this.http
      .get<PaginatedCaseAudioData>(`/api/admin/cases/${id}/audios`, {
        params,
      })
      .pipe(
        map(
          (response): PaginatedCaseAudio => ({
            currentPage: response.current_page,
            pageSize: response.page_size,
            totalPages: response.total_pages,
            totalItems: response.total_items,
            data: this.mapCaseAudio(response.data),
          })
        )
      );
  }

  private mapCaseAudio(audio: CaseAudioData[]): CaseAudio[] {
    return audio.map((item) => ({
      audioId: item.id,
      startTime: DateTime.fromISO(item.start_at),
      endTime: DateTime.fromISO(item.end_at),
      channel: item.channel,
      courtroom: item.courtroom,
    }));
  }

  mapCaseDataToCase(caseData: AdminCaseData): AdminCase {
    return {
      id: caseData.id,
      caseNumber: caseData.case_number,
      courthouse: {
        id: caseData.courthouse.id,
        displayName: caseData.courthouse.display_name,
      },
      defendants: caseData.defendants,
      judges: caseData.judges,
      prosecutors: caseData.prosecutors,
      defenders: caseData.defenders,
      reportingRestrictions: caseData.reporting_restrictions ? caseData.reporting_restrictions : [],
      retainUntilDateTime: caseData.retain_until_date_time
        ? DateTime.fromISO(caseData.retain_until_date_time)
        : undefined,
      caseClosedDateTime: caseData.case_closed_date_time ? DateTime.fromISO(caseData.case_closed_date_time) : undefined,
      isRetentionUpdated: caseData.is_retention_updated ?? undefined,
      retentionRetries: caseData.retention_retries ?? undefined,
      retentionDateTimeApplied: caseData.retention_date_time_applied
        ? DateTime.fromISO(caseData.retention_date_time_applied)
        : undefined,
      retentionPolicyApplied: caseData.retention_policy_applied,
      retConfScore: caseData.ret_conf_score ?? undefined,
      retConfReason: caseData.ret_conf_reason ?? undefined,
      retConfUpdatedTs: caseData.ret_conf_updated_ts ? DateTime.fromISO(caseData.ret_conf_updated_ts) : undefined,
      caseObjectId: caseData.case_object_id,
      caseObjectName: caseData.case_object_name ?? undefined,
      caseType: caseData.case_type ?? undefined,
      uploadPriority: caseData.upload_priority ?? undefined,
      caseStatus: caseData.case_status,
      createdAt: DateTime.fromISO(caseData.created_at),
      createdById: caseData.created_by,
      lastModifiedAt: DateTime.fromISO(caseData.last_modified_at),
      lastModifiedById: caseData.last_modified_by,
      isDeleted: caseData.is_deleted,
      caseDeletedAt: caseData.case_deleted_at ? DateTime.fromISO(caseData.case_deleted_at) : undefined,
      caseDeletedById: caseData.case_deleted_by,
      isDataAnonymised: caseData.is_data_anonymised,
      dataAnonymisedAt: caseData.data_anonymised_at ? DateTime.fromISO(caseData.data_anonymised_at) : undefined,
      dataAnonymisedById: caseData.data_anonymised_by,
      isInterpreterUsed: caseData.is_interpreter_used,
    };
  }
}
