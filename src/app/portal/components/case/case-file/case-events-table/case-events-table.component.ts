import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CaseEvent } from '@portal-types/events/case-event';
import { AppConfigService } from '@services/app-config/app-config.service';

export type CaseEventSortBy = 'hearingDate' | 'timestamp' | 'eventName';
export type AdminCaseEventSortBy = CaseEventSortBy | 'eventId' | 'courtroom' | 'text';

@Component({
  selector: 'app-case-events-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, LuxonDatePipe],
  templateUrl: './case-events-table.component.html',
  styleUrl: './case-events-table.component.scss',
})
export class CaseEventsTableComponent {
  appConfig = inject(AppConfigService);

  events = input<CaseEvent[]>([]);
  caseId = input<number>();
  totalItems = input<number>();
  eventsPerPage = input<number>();

  adminScreen = input<boolean>(false);

  pageChange = output<number>();
  sortChange = output<{
    sortBy: CaseEventSortBy | AdminCaseEventSortBy;
    sortOrder: 'asc' | 'desc';
  }>();

  columns: DatatableColumn[] = [
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Time', prop: 'timestamp', sortable: true },
    { name: 'Event', prop: 'eventName', sortable: true },
    { name: 'Text', prop: 'text', sortable: false },
  ];

  adminColumns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'eventId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Time', prop: 'timestamp', sortable: true },
    { name: 'Event', prop: 'eventName', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Text', prop: 'text', sortable: true },
  ];

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSortChange(sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
    if (!this.isAllowedSort(sort.sortBy)) return;

    this.sortChange.emit({
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
  }

  private isAllowedSort(value: string): value is AdminCaseEventSortBy {
    const allowed = this.adminScreen()
      ? ['eventId', 'courtroom', 'text', 'hearingDate', 'timestamp', 'eventName']
      : ['hearingDate', 'timestamp', 'eventName'];

    return allowed.includes(value);
  }
}
