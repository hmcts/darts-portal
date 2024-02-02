import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SuccessBannerComponent } from '@common/success-banner/success-banner.component';
import { DatatableColumn } from '@darts-types/data-table-column.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { Case } from '@portal-types/case/case.type';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';
import { combineLatest, map } from 'rxjs';
import { CaseRetentionHistory } from 'src/app/portal/models/case/case-retention-history.interface';
import { CaseRetentionPageState } from 'src/app/portal/models/case/case-retention-page-state.type';
import { CaseService } from 'src/app/portal/services/case/case.service';
import { BreadcrumbComponent } from '../../../../components/common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '../../../../components/common/data-table/data-table.component';
import { DetailsTableComponent } from '../../../../components/common/details-table/details-table.component';
import { GovukHeadingComponent } from '../../../../components/common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '../../../../components/common/loading/loading.component';
import { NotificationBannerComponent } from '../../../../components/common/notification-banner/notification-banner.component';
import { CaseRententionChangeComponent } from './case-retention-change/case-retention-change.component';
import { CaseRententionConfirmComponent } from './case-retention-confirm/case-retention-confirm.component';

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
  dateTime = DateTime;

  caseId = this.route.snapshot.params.caseId;

  retentionHistory$ = this.caseService.getCaseRetentionHistory(this.caseId);
  caseDetails$ = this.caseService.getCase(this.caseId).pipe(
    map((data: Case) => {
      const caseDetails = {
        details: {
          'Case ID': data.number,
          'Case closed date': this.datePipe.transform(data.closedDateTime?.toISO(), 'dd MMM yyyy') || '-',
          Courthouse: data.courthouse,
          'Judge(s)': data.judges?.map((judge) => ' ' + judge),
          'Defendant(s)': data.defendants?.map((defendant) => ' ' + defendant),
        },
        currentRetention: {
          'Date applied': this.datePipe.transform(data.retentionDateTimeApplied?.toISO(), 'dd MMM yyyy'),
          'Retain case until': this.datePipe.transform(data.retainUntilDateTime?.toISO(), 'dd MMM yyyy'),
          'DARTS Retention policy applied': data.retentionPolicyApplied,
        },
        case_id: data.id,
        case_number: data.number,
        case_retain_until_date_time: this.datePipe.transform(data.retainUntilDateTime?.toISO(), 'dd/MM/yyyy'),
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
    return DateTime.fromISO(earliestDate, { setZone: true }).toFormat('dd/MM/yyyy');
  }

  changeRetentionDate() {
    this.state = 'Change';
  }

  onStateChanged(state: CaseRetentionPageState) {
    this.state = state;
    if (state === 'Success') {
      // Refetch case and retention data
      this.vm$ = combineLatest({
        caseDetails: this.caseDetails$,
        retentionHistory: this.retentionHistory$,
      });
    }
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
