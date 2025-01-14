import { ElementRef, Renderer2 } from '@angular/core';
import { GovukSummaryContainerDirective } from './govuk-summary-container.directive';

describe('GovukSummaryContainerDirective', () => {
  let mockElementRef: ElementRef;
  let mockRenderer2: Renderer2;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef;

    mockRenderer2 = {
      setStyle: jest.fn(),
    } as unknown as Renderer2;
  });

  it('should create an instance and set width style', () => {
    const directive = new GovukSummaryContainerDirective(mockElementRef, mockRenderer2);
    expect(directive).toBeTruthy();

    expect(mockRenderer2.setStyle).toHaveBeenCalledWith(mockElementRef.nativeElement, 'width', '66.6666666667%');
  });
});
