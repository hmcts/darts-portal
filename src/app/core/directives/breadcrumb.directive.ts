import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[breadcrumb]',
  standalone: true,
})
export class BreadcrumbDirective {
  @Input('breadcrumb') link: string | string[] | null | undefined = ['.'];
  constructor(public template: TemplateRef<unknown>) {}
}
