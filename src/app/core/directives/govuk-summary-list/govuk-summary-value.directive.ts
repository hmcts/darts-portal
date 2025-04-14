import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[govukSummaryValue]',
  standalone: true,
  host: {
    class: 'govuk-summary-list__value',
  },
})
export class GovukSummaryValueDirective implements OnInit {
  @Input() preserveLineBreaks = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.preserveLineBreaks) {
      this.renderer.setStyle(this.el.nativeElement, 'white-space', 'pre-line');
    }
  }
}
