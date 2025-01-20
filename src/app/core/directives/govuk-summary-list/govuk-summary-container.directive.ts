import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[govukSummaryContainer]',
  standalone: true,
})
export class GovukSummaryContainerDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'width', '66.6666666667%');
  }
}
