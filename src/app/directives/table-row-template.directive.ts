import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tableRowTemplate]',
  standalone: true,
})
export class TableRowTemplateDirective<TRow> {
  @Input('tableRowTemplate') rows!: TRow[];

  static ngTemplateContextGuard<TContextRow>(
    directive: TableRowTemplateDirective<TContextRow>,
    context: unknown
  ): context is TableRowTemplateContext<TContextRow> {
    return true;
  }
}

interface TableRowTemplateContext<TRow> {
  $implicit: TRow;
}
