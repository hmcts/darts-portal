import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukSummaryValueDirective } from './govuk-summary-value.directive';

@Component({
  standalone: true,
  imports: [GovukSummaryValueDirective],
  template: `<dd govukSummaryValue [preserveLineBreaks]="preserveLineBreaks" data-testid="target">Example</dd>`,
})
class TestHostComponent {
  preserveLineBreaks = false;
}

describe('GovukSummaryValueDirective (Jest)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should not apply white-space: pre-line when preserveLineBreaks is false', () => {
    hostComponent.preserveLineBreaks = false;
    fixture.detectChanges();

    const dd = fixture.nativeElement.querySelector('[data-testid="target"]');
    expect(getComputedStyle(dd).whiteSpace).not.toBe('pre-line');
  });

  it('should apply white-space: pre-line when preserveLineBreaks is true', () => {
    hostComponent.preserveLineBreaks = true;
    fixture.detectChanges();

    const dd = fixture.nativeElement.querySelector('[data-testid="target"]');
    expect(getComputedStyle(dd).whiteSpace).toBe('pre-line');
  });
});
