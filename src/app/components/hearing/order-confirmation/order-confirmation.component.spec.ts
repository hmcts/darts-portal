import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CaseData } from '@darts-types/index';
import { HeaderService } from '@services/header/header.service';

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
      providers: [HeaderService, RouterTestingModule],
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
      const showPrimaryNavigationSpy = jest.spyOn(component.headerService, 'showPrimaryNavigation');

      component.onReturnToSearch(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(showPrimaryNavigationSpy).toBeCalledWith(true);
    });
  });
});
