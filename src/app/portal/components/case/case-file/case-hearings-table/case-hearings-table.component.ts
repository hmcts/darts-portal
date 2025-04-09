import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Hearing } from '@portal-types/index';
import { ActiveTabService } from '@services/active-tab/active-tab.service';

@Component({
  selector: 'app-case-hearings-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe],
  templateUrl: './case-hearings-table.component.html',
  styleUrl: './case-hearings-table.component.scss',
})
export class CaseHearingsTableComponent {
  router = inject(Router);
  activeTabService = inject(ActiveTabService);

  hearings = input<Hearing[]>([]);
  caseId = input<number>();
  adminScreen = input(false);

  columns: DatatableColumn[] = [
    { name: 'Hearing date', prop: 'date', sortable: true },
    { name: 'Judge', prop: 'judges', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'No. of transcripts', prop: 'transcriptCount', sortable: true },
  ];

  goToHearingDetails(hearingId: number): void {
    const screenId = this.adminScreen() ? 'admin-hearing-details' : 'hearing-screen';
    this.activeTabService.clearActiveTab(screenId);

    const basePath = this.adminScreen() ? '/admin/case' : '/case';

    this.router.navigate([basePath, this.caseId(), 'hearing', hearingId], {
      queryParams: { backUrl: `${basePath}/${this.caseId()}` },
    });
  }
}
