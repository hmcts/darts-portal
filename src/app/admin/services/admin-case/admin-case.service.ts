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
      retentionDateTimeApplied: caseData.retention_date_time_applied
        ? DateTime.fromISO(caseData.retention_date_time_applied)
        : undefined,
      retentionPolicyApplied: caseData.retention_policy_applied,
      caseObjectId: caseData.case_object_id,
      caseStatus: caseData.case_status,
      createdAt: DateTime.fromISO(caseData.created_at),
      createdById: caseData.created_by,
      lastModifiedAt: DateTime.fromISO(caseData.last_modified_at),
      lastModifiedById: caseData.last_modified_by,
      isDeleted: caseData.is_deleted,
      caseDeletedAt: caseData.case_deleted_at ? DateTime.fromISO(caseData.case_deleted_at) : undefined,
      isDataAnonymised: caseData.is_data_anonymised,
      dataAnonymisedAt: caseData.data_anonymised_at ? DateTime.fromISO(caseData.data_anonymised_at) : undefined,
      isInterpreterUsed: caseData.is_interpreter_used,
    };
  }
}
