import { ElementRef, Renderer2 } from '@angular/core';
import { GovukSummaryValueDirective } from './govuk-summary-value.directive';

describe('GovukSummaryValueDirective (Jest)', () => {
  let mockElement: HTMLElement;
  let mockElementRef: ElementRef;
  let renderer: jest.Mocked<Renderer2>;

  beforeEach(() => {
    mockElement = document.createElement('dd');
    mockElementRef = new ElementRef(mockElement);
    renderer = {
      setStyle: jest.fn(),
    } as unknown as jest.Mocked<Renderer2>;
  });

  it('should create an instance', () => {
    const directive = new GovukSummaryValueDirective(mockElementRef, renderer);
    expect(directive).toBeTruthy();
  });

  it('should not apply white-space style if preserveLineBreaks is false', () => {
    const directive = new GovukSummaryValueDirective(mockElementRef, renderer);
    directive.preserveLineBreaks = false;
    directive.ngOnInit();

    expect(renderer.setStyle).not.toHaveBeenCalled();
  });

  it('should apply white-space: pre-line if preserveLineBreaks is true', () => {
    const directive = new GovukSummaryValueDirective(mockElementRef, renderer);
    directive.preserveLineBreaks = true;
    directive.ngOnInit();

    expect(renderer.setStyle).toHaveBeenCalledWith(mockElement, 'white-space', 'pre-line');
  });
});
