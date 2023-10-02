import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[tableRowTemplate]',
  standalone: true,
})
export class TableRowTemplateDirective {
  constructor() {}
}
