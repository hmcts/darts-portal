import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Case, PostAudioRequest } from '@portal-types/index';
import { HeaderService } from '@services/header/header.service';
import { DateTime } from 'luxon';
import { OrderConfirmationComponent } from './order-confirmation.component';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  const MOCK_CASE: Case = {
    id: 1,
    number: 'C20220620001',
    courthouse: 'Swansea',
    defendants: ['Defendant Dave'],
    judges: ['Judge Judy'],
    reportingRestrictions: [
      {
        hearing_id: 1,
        event_id: 1,
        event_name: 'Section 4(2) of the Contempt of Court Act 1981',
        event_text: '',
        event_ts: '2023-08-10T09:00:00Z',
      },
    ],
    hearings: [
      {
        id: 1,
        date: DateTime.fromISO('2023-08-10'),
        courtroom: '1',
        judges: ['Judge Judy'],
        transcriptCount: 0,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
      providers: [HeaderService, RouterTestingModule, DatePipe],
    });
    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    component.case = MOCK_CASE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onReturnToHearing', () => {
    it('should emit a stateChange event', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onReturnToHearing(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(stateChangeSpy).toHaveBeenCalledWith('Default');
    });
  });

  describe('#onReturnToSearch', () => {
    it('should navigate back to search screen', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.onReturnToSearch(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/search']);
    });

    it('should call headerService to show nav', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const showPrimaryNavigationSpy = jest.spyOn(component.headerService, 'showNavigation');

      component.onReturnToSearch(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(showPrimaryNavigationSpy).toBeCalled();
    });
  });

  describe('#onConfirm', () => {
    it('should emit an orderConfirm event', () => {
      const orderConfirmSpy = jest.spyOn(component.orderConfirm, 'emit');
      const mockAudioRequest: PostAudioRequest = {
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
