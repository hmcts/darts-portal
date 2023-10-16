import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tab]',
  standalone: true,
})
export class TabDirective {
  @Input('tab') name!: string;
  @Input() count!: number;
  constructor(public template: TemplateRef<unknown>) {}
}
