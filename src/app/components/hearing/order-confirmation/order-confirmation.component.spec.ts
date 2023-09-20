import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseData } from '@darts-types/index';

import { OrderConfirmationComponent } from './order-confirmation.component';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  const MOCK_CASE: CaseData = {
    case_id: 1,
    case_number: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reporting_restriction: 'Section 4(2) of the Contempt of Court Act 1981',
    hearings: [
      {
        id: 1,
        date: '2023-08-10',
        courtroom: '1',
        judges: ['Judge Judy'],
        transcript_count: 0,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
    });
    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    component.case = MOCK_CASE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
