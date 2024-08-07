import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CaseService } from '@services/case/case.service';
import { of } from 'rxjs';
import { CaseRententionConfirmComponent } from './case-retention-confirm.component';

describe('CaseRetentionComponent', () => {
  let component: CaseRententionConfirmComponent;
  let fixture: ComponentFixture<CaseRententionConfirmComponent>;
  const mockDatePipe = new DatePipe('en-GB');
  const fakeRouter = {
    navigate: jest.fn(),
    url: 'test#',
  };

  const fakeCaseService = {
    postCaseRetentionChange: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseRententionConfirmComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: fakeRouter },
        { provide: CaseService, useValue: fakeCaseService },
        { provide: DatePipe },
      ],
    });
    fixture = TestBed.createComponent(CaseRententionConfirmComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onConfirm', () => {
    it('should call caseService with expected object when permanent is false"', () => {
      component.caseId = 123;
      component.caseCourthouse = 'Ducksea';
      component.caseDefendants = [' Mrs Test', ' Mr Test'];
      component.newRetentionDate = new Date(2024, 0, 1);
      component.newRetentionReason = 'Here is a reason';
      component.newRetentionPermanent = false;

      const expectedCall = {
        case_id: component.caseId,
        comments: component.newRetentionReason,
        is_permanent_retention: undefined,
        retention_date: mockDatePipe.transform(component.newRetentionDate, 'yyyy-MM-dd'),
      };

      component.onConfirm();

      expect(fakeCaseService.postCaseRetentionChange).toHaveBeenCalledWith(expectedCall);
    });

    it('should call caseService without date when permanent is true"', () => {
      component.caseId = 123;
      component.caseCourthouse = 'Ducksea';
      component.caseDefendants = [' Mrs Test', ' Mr Test'];
      component.newRetentionDate = new Date(2024, 0, 1);
      component.newRetentionReason = 'Here is a reason';
      component.newRetentionPermanent = true;

      const expectedCall = {
        case_id: component.caseId,
        comments: component.newRetentionReason,
        is_permanent_retention: true,
        retention_date: undefined,
      };

      component.onConfirm();

      expect(fakeCaseService.postCaseRetentionChange).toHaveBeenCalledWith(expectedCall);
    });
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
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onReturnDate();

      expect(stateChangeSpy).toHaveBeenCalledWith('Change');
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'retention-date' });
    });
  });

  describe('#onReturnReason', () => {
    it('should emit a stateChange event to "Change" and call router with fragment', () => {
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');

      component.onReturnReason();

      expect(stateChangeSpy).toHaveBeenCalledWith('Change');
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['test'], { fragment: 'change-reason' });
    });
  });
});
