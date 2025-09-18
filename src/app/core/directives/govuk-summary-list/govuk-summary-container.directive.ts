import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[govukSummaryContainer]',
  standalone: true,
})
export class GovukSummaryContainerDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '66.6666666667%');
  }
}
