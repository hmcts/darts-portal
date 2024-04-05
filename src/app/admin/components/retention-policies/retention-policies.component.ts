import { RetentionPolicy } from '@admin-types/index';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
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
    GovukBannerComponent,
  ],
  templateUrl: './retention-policies.component.html',
  styleUrl: './retention-policies.component.scss',
})
export class RetentionPoliciesComponent {
  private retentionPoliciesService = inject(RetentionPoliciesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  retentionPoliciesData$ = this.retentionPoliciesService.getRetentionPolicyTypes();
  hasPolicyCreated$ = this.route.queryParams.pipe(map((params) => !!params.created));

  retentionPolicies$ = combineLatest({
    activeRetentionPolicies: this.retentionPoliciesData$.pipe(map((policy) => this.filterActivePolicies(policy))),
    inactiveRetentionPolicies: this.retentionPoliciesData$.pipe(map((policy) => this.filterInactivePolicies(policy))),
  });

  inActiveColumns: DatatableColumn[] = [
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

  filterActivePolicies(policies: RetentionPolicy[]): RetentionPolicy[] {
    return policies.filter((r) => (r.policyEndAt ? r.policyEndAt > DateTime.now() : true));
  }

  filterInactivePolicies(policies: RetentionPolicy[]): RetentionPolicy[] {
    return policies.filter((r) => (r.policyEndAt ? r.policyEndAt < DateTime.now() : false));
  }
}
