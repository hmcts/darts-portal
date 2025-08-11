import { Directive, ElementRef, Input, OnInit, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[govukSummaryValue]',
  standalone: true,
  host: {
    class: 'govuk-summary-list__value',
  },
})
export class GovukSummaryValueDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() preserveLineBreaks = false;

  ngOnInit(): void {
    if (this.preserveLineBreaks) {
      this.renderer.setStyle(this.el.nativeElement, 'white-space', 'pre-line');
    }
  }
}
