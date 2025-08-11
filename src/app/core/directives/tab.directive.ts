import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tab]',
  standalone: true,
})
export class TabDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);

  @Input('tab') name!: string;
  @Input('tabCount') count?: number;
  @Input('tabId') id?: string;
  @Input('tabScreenReaderText') screenReaderText?: string;
}
