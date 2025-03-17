import { AssociatedHearing } from '@admin-types/transformed-media/associated-hearing';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-associated-hearings-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
  templateUrl: './associated-hearings-table.component.html',
  styleUrl: './associated-hearings-table.component.scss',
})
export class AssociatedHearingsTableComponent {
  rows = input<AssociatedHearing[]>([]);

  url = input<string>('');

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
  ];
}
