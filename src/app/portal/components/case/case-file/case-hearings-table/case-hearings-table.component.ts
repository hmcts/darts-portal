import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Hearing } from '@portal-types/index';
import { ActiveTabService } from '@services/active-tab/active-tab.service';

@Component({
  selector: 'app-case-hearings-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './case-hearings-table.component.html',
  styleUrl: './case-hearings-table.component.scss',
})
export class CaseHearingsTableComponent {
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

  clearStoredTabs(): void {
    //Required to ensure other hearings don't use other active tabs
    const screenId = this.adminScreen() ? 'admin-hearing-details' : 'hearing-screen';
    this.activeTabService.clearActiveTab(screenId);
  }
}
