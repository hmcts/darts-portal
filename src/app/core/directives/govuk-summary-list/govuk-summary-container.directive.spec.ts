import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukSummaryContainerDirective } from './govuk-summary-container.directive';
@Component({
  standalone: true,
  imports: [GovukSummaryContainerDirective],
  template: `<div govukSummaryContainer data-testid="target"></div>`,
})
class TestHostComponent {}

describe('GovukSummaryContainerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the correct width style to the element', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('[data-testid="target"]');
    expect(el.style.width).toBe('66.6666666667%');
  });
});
