import { AdminHearingData } from '@admin-types/hearing/hearing.interface';
import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminHearingService {
  http = inject(HttpClient);

  getHearing(id: number): Observable<AdminHearing> {
    return this.http.get<AdminHearingData>(`/api/admin/hearings/${id}`).pipe(map(this.mapAdminHearing));
  }

  private mapAdminHearing(data: AdminHearingData): AdminHearing {
    return {
      id: data.id,
      hearingDate: DateTime.fromISO(data.hearing_date),
      scheduledStartTime: DateTime.fromISO(data.scheduled_start_time),
      hearingIsActual: data.hearing_is_actual,
      case: {
        id: data.case.id,
        caseNumber: data.case.case_number,
        courthouse: {
          id: data.case.courthouse.id,
          displayName: data.case.courthouse.display_name,
        },
        defendants: data.case.defendants,
        prosecutors: data.case.prosecutors,
        defenders: data.case.defenders,
        judges: data.case.judges,
      },
      courtroom: {
        id: data.courtroom.id,
        name: data.courtroom.name,
      },
      judges: data.judges,
      createdAt: DateTime.fromISO(data.created_at),
      createdById: data.created_by,
      lastModifiedAt: DateTime.fromISO(data.last_modified_at),
      lastModifiedById: data.last_modified_by,
    };
  }
}
