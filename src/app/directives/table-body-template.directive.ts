import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[tableBodyTemplate]',
  standalone: true,
})
export class TableBodyTemplateDirective {
  constructor() {}
}
