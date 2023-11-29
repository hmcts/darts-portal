import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tab]',
  standalone: true,
})
export class TabDirective {
  @Input('tab') name!: string;
  @Input('tabCount') count?: number;
  @Input('tabId') id?: string;
  constructor(public template: TemplateRef<unknown>) {}
}
