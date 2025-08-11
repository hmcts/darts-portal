import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[breadcrumb]',
  standalone: true,
})
export class BreadcrumbDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);

  @Input('breadcrumb') link: string | string[] | null | undefined = ['.'];
}
