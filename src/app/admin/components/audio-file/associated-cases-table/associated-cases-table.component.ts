import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { BytesPipe } from '@pipes/bytes.pipe';
import { JoinPipe } from '@pipes/join';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';

@Component({
  selector: 'app-associated-cases-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, BytesPipe, LuxonDatePipe, DecimalPipe, RouterLink, JoinPipe],
  templateUrl: './associated-cases-table.component.html',
  styleUrl: './associated-cases-table.component.scss',
})
export class AssociatedCasesTableComponent {
  rows = input<AssociatedCase[]>([]);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'Defendant(s)', prop: 'defendants', sortable: true },
    { name: 'Judge(s)', prop: 'judges', sortable: true },
  ];
}
