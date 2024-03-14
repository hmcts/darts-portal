import { RetentionPolicyTypes, RetentionPolicyTypesData } from '@admin-types/index';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RetentionPoliciesService {
  http = inject(HttpClient);

  getRetentionPolicyTypes(): Observable<RetentionPolicyTypes[]> {
    return this.http.get<RetentionPolicyTypesData[]>(`api/admin/retention-policy-types`).pipe(
      map((retentionPolicies) => {
        return retentionPolicies.map((retentionPolicy) => ({
          id: retentionPolicy.id,
          name: retentionPolicy.name,
          displayName: retentionPolicy.display_name,
          description: retentionPolicy.description,
          fixedPolicyKey: retentionPolicy.fixed_policy_key,
          duration: retentionPolicy.duration,
          policyStartAt: DateTime.fromISO(retentionPolicy.policy_start_at),
          policyEndAt: retentionPolicy.policy_end_at ? DateTime.fromISO(retentionPolicy.policy_end_at) : null,
        }));
      })
    );
  }
}
