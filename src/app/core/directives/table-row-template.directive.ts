import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'ng-template[tableRowTemplate]',
  standalone: true,
})
export class TableRowTemplateDirective<TRow> {
  @Input('tableRowTemplate') rows!: TRow[];

  static ngTemplateContextGuard<TContextRow>(
    directive: TableRowTemplateDirective<TContextRow>,
    context: unknown
  ): context is TableRowTemplateContext<TContextRow> {
    void context;
    return true;
  }
}

interface TableRowTemplateContext<TRow> {
  $implicit: TRow;
}
