import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[tableBodyTemplate]',
  standalone: true,
})
export class TableBodyTemplateDirective {}
