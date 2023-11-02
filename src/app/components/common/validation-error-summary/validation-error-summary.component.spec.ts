import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationErrorSummaryComponent } from './validation-error-summary.component';

describe('ValidationErrorSummaryComponent', () => {
  let component: ValidationErrorSummaryComponent;
  let fixture: ComponentFixture<ValidationErrorSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationErrorSummaryComponent],
    });
    fixture = TestBed.createComponent(ValidationErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
