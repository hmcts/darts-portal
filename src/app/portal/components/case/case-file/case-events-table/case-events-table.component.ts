import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CaseEvent } from '@portal-types/events/case-event';
import { AppConfigService } from '@services/app-config/app-config.service';

export type CaseEventSortBy = 'hearingDate' | 'timestamp' | 'eventName';

@Component({
  selector: 'app-case-events-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, GovukHeadingComponent, LuxonDatePipe],
  templateUrl: './case-events-table.component.html',
  styleUrl: './case-events-table.component.scss',
})
export class CaseEventsTableComponent {
  appConfig = inject(AppConfigService);

  events = input<CaseEvent[]>([]);
  caseId = input<number>();
  totalItems = input<number>();
  eventsPerPage = input<number>();

  pageChange = output<number>();
  sortChange = output<{ sortBy: 'hearingDate' | 'timestamp' | 'eventName'; sortOrder: 'asc' | 'desc' }>();

  columns: DatatableColumn[] = [
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Time', prop: 'timestamp', sortable: true },
    { name: 'Event', prop: 'eventName', sortable: true },
    { name: 'Text', prop: 'text', sortable: false },
  ];

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSortChange(sort: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
    if (!this.isCaseEventSortBy(sort.sortBy)) return;

    this.sortChange.emit({
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });
  }

  private isCaseEventSortBy(value: string): value is CaseEventSortBy {
    return ['hearingDate', 'timestamp', 'eventName'].includes(value);
  }
}
