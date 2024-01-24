import { CaseRententionConfirmComponent } from './case-retention-confirm/case-retention-confirm.component';
import { CaseRententionChangeComponent } from './case-retention-change/case-retention-change.component';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaseRetentionHistory } from '@darts-types/case-retention-history.interface';
import { Case } from '@darts-types/case.interface';
import { DatatableColumn } from '@darts-types/data-table-column.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { combineLatest, map } from 'rxjs';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '../../common/data-table/data-table.component';
import { DetailsTableComponent } from '../../common/details-table/details-table.component';
import { GovukHeadingComponent } from '../../common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '../../common/loading/loading.component';
import { NotificationBannerComponent } from '../../common/notification-banner/notification-banner.component';
import { CaseRetentionPageState } from '@darts-types/case-retention-page-state.type';
import { SuccessBannerComponent } from '@common/success-banner/success-banner.component';

@Component({
  selector: 'app-case-retention-date',
  standalone: true,
  templateUrl: './case-retention-date.component.html',
  styleUrl: './case-retention-date.component.scss',
  imports: [
    BreadcrumbComponent,
    BreadcrumbDirective,
    LoadingComponent,
    CommonModule,
    GovukHeadingComponent,
    DetailsTableComponent,
    DataTableComponent,
    RouterLink,
    TableRowTemplateDirective,
    NotificationBannerComponent,
    CaseRententionChangeComponent,
    CaseRententionConfirmComponent,
    SuccessBannerComponent,
  ],
})
export class CaseRetentionDateComponent implements OnInit {
  private _state: CaseRetentionPageState = 'Default';
  newRetentionDate = new Date();
  newRetentionReason = '';
  newRetentionPermanent: boolean = false;
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);
  datePipe = inject(DatePipe);

  caseId = this.route.snapshot.params.caseId;

  retentionHistory$ = this.caseService.getCaseRetentionHistory(this.caseId);
  caseDetails$ = this.caseService.getCase(this.caseId).pipe(
    map((data: Case) => {
      const caseDetails = {
        details: {
          'Case ID': data.case_number,
          'Case closed date': this.datePipe.transform(data.case_closed_date_time, 'dd MMM yyyy') || '-',
          Courthouse: data.courthouse,
          'Judge(s)': data.judges?.map((judge) => ' ' + judge),
          'Defendant(s)': data.defendants?.map((defendant) => ' ' + defendant),
        },
        currentRetention: {
          'Date applied': this.datePipe.transform(data.retention_date_time_applied, 'dd MMM yyyy'),
          'Retain case until': this.datePipe.transform(data.retain_until_date_time, 'dd MMM yyyy'),
          'DARTS Retention policy applied': data.retention_policy_applied,
        },
        case_id: data.case_id,
        case_number: data.case_number,
        case_retain_until_date_time: this.datePipe.transform(data.retain_until_date_time, 'dd/MM/yyyy'),
      };
      return caseDetails;
    })
  );

  // getter for state variable
  public get state() {
    return this._state;
  }

  // overriding state setter to call show/hide navigation
  public set state(value: CaseRetentionPageState) {
    switch (value) {
      case 'Success':
      case 'Default':
        this.headerService.showNavigation();
        break;
      default:
        this.headerService.hideNavigation();
    }
    this._state = value;
  }

  infoBannerHide(rows: CaseRetentionHistory[]): boolean {
    if (rows.length) {
      return this.getLatestDate(rows).status !== 'PENDING';
    } else {
      //Show banner if array is empty
      return false;
    }
  }

  buttonGroupHide(rows: CaseRetentionHistory[]): boolean {
    if (rows.length) {
      return this.getLatestDate(rows).status !== 'COMPLETE';
    } else {
      return true;
    }
  }

  getLatestDate(rows: CaseRetentionHistory[]) {
    return rows.reduce(
      (max, item) =>
        new Date(item.retention_last_changed_date) > new Date(max.retention_last_changed_date) ? item : max,
      rows[0]
    );
  }

  getEarliestDate(rows: CaseRetentionHistory[]) {
    return rows.reduce(
      (max, item) =>
        new Date(item.retention_last_changed_date) < new Date(max.retention_last_changed_date) ? item : max,
      rows[0]
    );
  }

  getOriginalRetentionDateString(rows: CaseRetentionHistory[]) {
    const earliestDate = this.getEarliestDate(rows).retention_date;
    return this.datePipe.transform(earliestDate, 'dd/MM/yyyy', 'GMT+1');
  }

  changeRetentionDate() {
    this.state = 'Change';
  }

  onStateChanged(state: CaseRetentionPageState) {
    this.state = state;
  }

  onRetentionDateChanged(value: Date) {
    this.newRetentionDate = value;
  }

  onRetentionReasonChanged(value: string) {
    this.newRetentionReason = value;
  }

  onRetentionPermanentChanged(value: boolean) {
    this.newRetentionPermanent = value;
  }

  vm$ = combineLatest({
    caseDetails: this.caseDetails$,
    retentionHistory: this.retentionHistory$,
  });

  columns: DatatableColumn[] = [
    { name: 'Date retention changed', prop: 'retention_last_changed_date', sortable: true },
    { name: 'Retention date', prop: 'retention_date', sortable: false },
    { name: 'Amended by', prop: 'amended_by', sortable: false },
    { name: 'Retention policy', prop: 'retention_policy_applied', sortable: false },
    { name: 'Comments', prop: 'comments', sortable: false },
    { name: 'Status', prop: 'status', sortable: false },
  ];

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }
}
