import { CreateRetentionPolicy, RetentionPolicy, RetentionPolicyData, RetentionPolicyForm } from '@admin-types/index';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RetentionPoliciesService {
  http = inject(HttpClient);

  getRetentionPolicyTypes(): Observable<RetentionPolicy[]> {
    return this.http
      .get<RetentionPolicyData[]>(`api/admin/retention-policy-types`)
      .pipe(map((policies) => policies.map((p) => this.mapRetentionPolicyDataToRetentionPolicy(p))));
  }

  createRetentionPolicy(policy: RetentionPolicyForm, isRevision: boolean = false): Observable<RetentionPolicy> {
    return this.http
      .post<RetentionPolicyData>(`api/admin/retention-policy-types`, this.mapPolicyRequestBody(policy), {
        params: { is_revision: isRevision },
      })
      .pipe(map((policy) => this.mapRetentionPolicyDataToRetentionPolicy(policy)));
  }

  getRetentionPolicy(id: number): Observable<RetentionPolicy> {
    return this.http
      .get<RetentionPolicyData>(`api/admin/retention-policy-types/${id}`)
      .pipe(map((policy) => this.mapRetentionPolicyDataToRetentionPolicy(policy)));
  }

  editRetentionPolicy(policy: RetentionPolicyForm, id: string): Observable<RetentionPolicy> {
    return this.http
      .patch<RetentionPolicyData>(`api/admin/retention-policy-types/${id}`, this.mapPolicyRequestBody(policy))
      .pipe(map((policy) => this.mapRetentionPolicyDataToRetentionPolicy(policy)));
  }

  private mapPolicyRequestBody(policy: RetentionPolicyForm) {
    // 2 years, 3 months, 4 days => 2Y3M4D || 0Y0M0D
    const durationString = `${policy.duration.years || 0}Y${policy.duration.months || 0}M${policy.duration.days || 0}D`;

    const { hours, minutes } = policy.startTime;

    const policyStartAt =
      DateTime.fromFormat(policy.startDate, 'dd/MM/yyyy')
        .set({ hour: +hours, minute: +minutes })
        .toUTC()
        .toISO({ suppressMilliseconds: true }) ?? '';

    const createPolicyRequestBody: CreateRetentionPolicy = {
      name: policy.name,
      display_name: policy.displayName,
      description: policy.description,
      fixed_policy_key: policy.fixedPolicyKey,
      duration: durationString,
      policy_start_at: policyStartAt,
    };
    return createPolicyRequestBody;
  }

  private mapRetentionPolicyDataToRetentionPolicy(retentionPolicy: RetentionPolicyData): RetentionPolicy {
    return {
      id: retentionPolicy.id,
      name: retentionPolicy.name,
      displayName: retentionPolicy.display_name,
      description: retentionPolicy.description,
      fixedPolicyKey: retentionPolicy.fixed_policy_key,
      duration: retentionPolicy.duration,
      policyStartAt: DateTime.fromISO(retentionPolicy.policy_start_at),
      policyEndAt: retentionPolicy.policy_end_at ? DateTime.fromISO(retentionPolicy.policy_end_at) : null,
    };
  }
}
