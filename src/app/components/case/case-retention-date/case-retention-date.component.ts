import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Case } from '@darts-types/case.interface';
import { DatatableColumn } from '@darts-types/data-table-column.interface';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { combineLatest, map } from 'rxjs';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { DataTableComponent } from '../../common/data-table/data-table.component';
import { DetailsTableComponent } from '../../common/details-table/details-table.component';
import { GovukHeadingComponent } from '../../common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '../../common/loading/loading.component';

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
  ],
})
export class CaseRetentionDateComponent implements OnInit {
  headerService = inject(HeaderService);
  route = inject(ActivatedRoute);
  caseService = inject(CaseService);

  caseId = this.route.snapshot.params.caseId;
  //TODO: Map retention_last_changed_date & retention_date to display format
  //TODO: Show status display properly
  retentionHistory$ = this.caseService.getCaseRetentionHistory(this.caseId);
  caseDetails$ = this.caseService.getCase(this.caseId).pipe(
    map((data: Case) => {
      const caseDetails = {
        details: {
          'Case ID': data.case_id,
          'Case closed date': '-TO-DO------',
          Courthouse: data.courthouse,
          'Judge(s)': data.judges,
          'Defendant(s)': data.defendants,
        },
        case_id: data.case_id,
        case_number: data.case_number,
      };
      return caseDetails;
    })
  );

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
