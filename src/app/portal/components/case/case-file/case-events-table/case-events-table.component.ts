import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { CaseEvent } from '@portal-types/events/case-event';

@Component({
  selector: 'app-case-events-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, GovukHeadingComponent, LuxonDatePipe],
  templateUrl: './case-events-table.component.html',
  styleUrl: './case-events-table.component.scss',
})
export class CaseEventsTableComponent {
  events = input<CaseEvent[]>([]);
  caseId = input<number>();

  columns: DatatableColumn[] = [
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Time', prop: 'timestamp', sortable: true },
    { name: 'Event', prop: 'name', sortable: true },
    { name: 'Text', prop: 'text', sortable: false },
  ];
}
