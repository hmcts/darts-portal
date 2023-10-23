import { Directive, Input } from '@angular/core';
import { DatatableRow } from '@darts-types/data-table-row.interface';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tableRowTemplate]',
  standalone: true,
})
export class TableRowTemplateDirective<TRow extends DatatableRow> {
  @Input('tableRowTemplate') rows!: TRow[];

  static ngTemplateContextGuard<TContextRow extends DatatableRow>(
    directive: TableRowTemplateDirective<TContextRow>,
    context: unknown
  ): context is TableRowTemplateContext<TContextRow> {
    return true;
  }
}

interface TableRowTemplateContext<TRow extends DatatableRow> {
  $implicit: TRow;
}
