import { RetentionPolicy } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TabsComponent } from '@common/tabs/tabs.component';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { DurationPipe } from '@pipes/duration.pipe';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { RetentionPoliciesService } from '@services/retention-policies/retention-policies.service';
import { DateTime } from 'luxon';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-retention-policies',
  standalone: true,
  imports: [
    TabsComponent,
    TabDirective,
    DataTableComponent,
    CommonModule,
    LuxonDatePipe,
    TableRowTemplateDirective,
    DurationPipe,
    GovukHeadingComponent,
    RouterLink,
    LoadingComponent,
  ],
  templateUrl: './retention-policies.component.html',
  styleUrl: './retention-policies.component.scss',
})
export class RetentionPoliciesComponent {
  private retentionPoliciesService = inject(RetentionPoliciesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  retentionPoliciesData$ = this.retentionPoliciesService.getRetentionPolicyTypes();
  retentionPoliciesPath = 'admin/system-configuration/retention-policies';

  retentionPolicies$ = combineLatest({
    activeRetentionPolicies: this.retentionPoliciesData$.pipe(map((policy) => this.filterActivePolicies(policy))),
    inactiveRetentionPolicies: this.retentionPoliciesData$.pipe(map((policy) => this.filterInactivePolicies(policy))),
  });

  inActiveColumns: DatatableColumn[] = [
    { name: 'Display name', prop: 'displayName', sortable: false },
    { name: 'Name', prop: 'name', sortable: false },
    { name: 'Description', prop: 'description', sortable: false },
    { name: 'Fixed policy key', prop: 'fixedPolicyKey', sortable: false },
    { name: 'Duration', prop: 'duration', sortable: false },
    { name: 'Policy start', prop: 'policyStart', sortable: false },
    { name: 'Policy end', prop: 'policyEnd', sortable: false },
  ];

  activeColumns: DatatableColumn[] = [...this.inActiveColumns, { name: '', prop: '', sortable: false }];

  isPolicyActive(policyStartDate: DateTime): boolean {
    return policyStartDate > DateTime.now();
  }

  isPolicyRevision(policy: RetentionPolicy, policies: RetentionPolicy[]): boolean {
    // check if other policies have the same fixed policy key, this means it is a revision
    return policies.some((p) => p.fixedPolicyKey === policy.fixedPolicyKey && p.id !== policy.id);
  }

  onEditClick(policy: RetentionPolicy, policies: RetentionPolicy[]): void {
    this.router.navigate([
      this.retentionPoliciesPath,
      policy.id,
      this.isPolicyRevision(policy, policies) ? 'edit-revision' : 'edit',
    ]);
  }

  filterActivePolicies(policies: RetentionPolicy[]): RetentionPolicy[] {
    return policies.filter((r) => (r.policyEndAt ? r.policyEndAt > DateTime.now() : true));
  }

  filterInactivePolicies(policies: RetentionPolicy[]): RetentionPolicy[] {
    return policies.filter((r) => (r.policyEndAt ? r.policyEndAt < DateTime.now() : false));
  }
}
