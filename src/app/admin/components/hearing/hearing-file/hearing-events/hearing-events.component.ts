import { AdminHearingEvent } from '@admin-types/hearing/hearing-events.type';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-hearing-events',
  imports: [GovukHeadingComponent, DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './hearing-events.component.html',
  styleUrl: './hearing-events.component.scss',
})
export class HearingEventsComponent {
  events = input<AdminHearingEvent[]>([]);
  url = input();

  columns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'id', sortable: true },
    { name: 'Time stamp', prop: 'timestamp', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
  ];
}
