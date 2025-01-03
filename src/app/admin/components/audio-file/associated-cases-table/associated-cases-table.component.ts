import { AssociatedCase } from '@admin-types/transformed-media/associated-case';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';

@Component({
  selector: 'app-associated-cases-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink],
  templateUrl: './associated-cases-table.component.html',
  styleUrl: './associated-cases-table.component.scss',
})
export class AssociatedCasesTableComponent {
  rows = input<AssociatedCase[]>([]);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseId', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Source', prop: 'source', sortable: true },
  ];
}
