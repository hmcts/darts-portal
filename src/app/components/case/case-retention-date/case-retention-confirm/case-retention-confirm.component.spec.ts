import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseRententionConfirmComponent } from './case-retention-confirm.component';
import { Router } from '@angular/router';

describe('CaseRetentionComponent', () => {
  let component: CaseRententionConfirmComponent;
  let fixture: ComponentFixture<CaseRententionConfirmComponent>;
  const fakeRouter = {
    navigate: jest.fn(),
    url: 'test#',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseRententionConfirmComponent],
      providers: [{ provide: Router, useValue: fakeRouter }],
    });
    fixture = TestBed.createComponent(CaseRententionConfirmComponent);
    component = fixture.componentInstance;
    component.caseCourthouse = 'Ducksea';
    component.caseDefendants = [' Mrs Test', ' Mr Test'];
    component.newRetentionDate = new Date(2024, 0, 1);
    component.newRetentionReason = 'Here is a reason';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onCancel', () => {
    it('should emit a stateChange event to "Default"', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onCancel(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(stateChangeSpy).toHaveBeenCalledWith('Default');
    });
  });

  describe('#onReturnDate', () => {
    it('should emit a stateChange event to "Change" and call router with fragment', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onReturnDate(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(stateChangeSpy).toHaveBeenCalledWith('Change');
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'retention-date' });
    });
  });

  describe('#onReturnReason', () => {
    it('should emit a stateChange event to "Change" and call router with fragment', () => {
      const event = new MouseEvent('click');
      const eventSpy = jest.spyOn(event, 'preventDefault');
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onReturnReason(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(stateChangeSpy).toHaveBeenCalledWith('Change');
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'change-reason' });
    });
  });
});
