import { Directive } from '@angular/core';

@Directive({
  selector: '[govukSummaryListAction]',
  standalone: true,
  host: { class: 'govuk-summary-list__actions whitespace-pre' },
})
export class GovukSummaryActionDirective {}
