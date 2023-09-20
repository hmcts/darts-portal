import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseData, requestPlaybackAudioDTO } from '@darts-types/index';

import { OrderSummaryComponent } from './order-summary.component';

describe('OrderSummaryComponent', () => {
  let component: OrderSummaryComponent;
  let fixture: ComponentFixture<OrderSummaryComponent>;
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
      imports: [OrderSummaryComponent],
    });
    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    component.case = MOCK_CASE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onConfirm', () => {
    it('should emit an orderConfirm event', () => {
      const orderConfirmSpy = jest.spyOn(component.orderConfirm, 'emit');
      const mockAudioRequest: requestPlaybackAudioDTO = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      component.audioRequest = mockAudioRequest;

      component.onConfirm();

      expect(orderConfirmSpy).toHaveBeenCalledWith(mockAudioRequest);
    });
  });

  describe('#onCancel', () => {
    it('should emit a stateChange event', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onCancel(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(stateChangeSpy).toHaveBeenCalledWith('Default');
    });
  });
});
