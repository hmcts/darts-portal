import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tableRowTemplate]',
  standalone: true,
})
export class TableRowTemplateDirective {}
