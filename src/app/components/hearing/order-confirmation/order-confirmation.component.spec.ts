import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AudioRequest, Case } from '@darts-types/index';
import { HeaderService } from '@services/header/header.service';
import { AppConfigService } from '@services/app-config/app-config.service';

import { OrderConfirmationComponent } from './order-confirmation.component';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  const MOCK_CASE: Case = {
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

  const appConfigServiceMock = {
    getAppConfig: () => ({
      appInsightsKey: 'XXXXXXXX',
      support: {
        name: 'DARTS support',
        emailAddress: 'support@darts',
      },
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
      providers: [HeaderService, RouterTestingModule, { provide: AppConfigService, useValue: appConfigServiceMock }],
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
      const mockAudioRequest: AudioRequest = {
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
