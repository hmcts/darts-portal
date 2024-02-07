import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@services/user/user.service';
import { CaseRetentionChangeComponent } from './case-retention-change.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { CaseService } from '@services/case/case.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('CaseRetentionComponent', () => {
  let component: CaseRetentionChangeComponent;
  let fixture: ComponentFixture<CaseRetentionChangeComponent>;
  let mockUserService: Partial<UserService>;

  const mockCaseService = {
    postCaseRetentionDateValidate: jest.fn().mockReturnValue(of({})),
  } as unknown as CaseService;

  const currentRetentionDate = '01/01/2024';
  const originalRetentionDate = '01/01/2023';

  beforeEach(() => {
    mockUserService = {
      hasRoles: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CaseRetentionChangeComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: DatePipe },
        { provide: CaseService, useValue: mockCaseService },
      ],
    });
    fixture = TestBed.createComponent(CaseRetentionChangeComponent);
    component = fixture.componentInstance;
    component.currentRetentionDate = currentRetentionDate;
    component.originalRetentionDate = originalRetentionDate;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onChange', () => {
    it('should reset errors', () => {
      component.onChangeOption();
      expect(component.errors).toEqual([]);
    });
  });

  describe('#onConfirm', () => {
    it('should check option selected', () => {
      // Populate reason
      component.retainReasonFormControl.patchValue('test');
      const expected = [{ fieldId: 'change-radios', message: 'Select an option' }];
      component.onConfirm();
      expect(component.errors).toEqual(expected);
    });

    it('should check date is valid', () => {
      // Select an option
      component.retainOptionFormControl.patchValue('date');
      // Populate reason
      component.retainReasonFormControl.patchValue('test');
      // Put in nonsense to the date input
      component.retainDateFormControl.patchValue('NONSENSE');
      const expected = [
        {
          fieldId: 'retention-date',
          message: 'You have not entered a recognised date in the correct format (for example 31/01/2023)',
        },
      ];
      component.onConfirm();

      expect(component.errors).toEqual(expected);
    });

    it('should check reason populated', () => {
      // Select an option
      component.retainOptionFormControl.patchValue('permanent');
      const expected = [{ fieldId: 'change-reason', message: 'You must explain why you are making this change' }];
      component.onConfirm();
      expect(component.errors).toEqual(expected);
    });

    it('should emit stateChange events if all is OK', () => {
      const testDate = new Date(2024, 0, 1);
      const testReason = 'This is the reason';
      // Select date option
      component.retainOptionFormControl.patchValue('date');
      component.retainDateFormControl.patchValue('01/01/2024');
      // Populate reason
      component.retainReasonFormControl.patchValue(testReason);
      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');
      const retentionDateChangeSpy = jest.spyOn(component.retentionDateChange, 'emit');
      const retentionReasonChange = jest.spyOn(component.retentionReasonChange, 'emit');

      component.onConfirm();

      expect(stateChangeSpy).toHaveBeenCalledWith('Confirm');
      expect(retentionDateChangeSpy).toHaveBeenCalledWith(testDate);
      expect(retentionReasonChange).toHaveBeenCalledWith(testReason);
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

  describe('#isOptionInvalid', () => {
    it('should return false if option selected', () => {
      component.retainOptionFormControl.markAsDirty();
      component.retainOptionFormControl.patchValue('date');
      const isOptionInvalid = component.isOptionInvalid();

      expect(isOptionInvalid).toEqual(false);
    });

    it('should return true if no option selected', () => {
      component.retainOptionFormControl.markAsDirty();
      const isOptionInvalid = component.isOptionInvalid();

      expect(isOptionInvalid).toEqual(true);
    });
  });

  describe('#isDateInvalid', () => {
    it('should return false if date format and user is Admin or Judge', () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(true);
      component.retainDateFormControl.patchValue('01/01/2024');
      component.retainDateFormControl.markAsDirty();
      // Signal the date has been changed
      component.onChangeDate();
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(false);
    });

    it('should return true if not date', () => {
      component.retainDateFormControl.patchValue('TEST');
      component.retainDateFormControl.markAsDirty();
      // Signal the date has been changed
      component.onChangeDate();
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(true);
      expect(component.errorDate).toEqual(
        'You have not entered a recognised date in the correct format (for example 31/01/2023)'
      );
    });

    it('should return true if user is NOT Admin or Judge and date is set before current retention date', () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(false);
      component.retainDateFormControl.patchValue('31/12/2023');
      component.retainDateFormControl.markAsDirty();
      // Signal the date has been changed
      component.onChangeDate();
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(true);
      expect(component.errorDate).toEqual(
        'You do not have permission to reduce the current retention date. Please refer to the DARTS retention policy guidance'
      );
    });

    it('should return true if user is Admin or Judge but date is set before original retention date', () => {
      jest.spyOn(mockUserService, 'hasRoles').mockReturnValue(true);
      component.retainDateFormControl.patchValue('31/12/2022');
      component.retainDateFormControl.markAsDirty();
      // Signal the date has been changed
      component.onChangeDate();
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(true);
      expect(component.errorDate).toEqual(`You cannot set retention date earlier than ${originalRetentionDate}`);
    });
  });

  describe('#isReasonInvalid', () => {
    it('should return true if reason empty', () => {
      component.retainReasonFormControl.markAsDirty();
      const isReasonInvalid = component.isReasonInvalid();

      expect(isReasonInvalid).toEqual(true);
    });

    it('should return false if reason specified', () => {
      component.retainReasonFormControl.markAsDirty();
      component.retainReasonFormControl.patchValue('TEST');
      const isReasonInvalid = component.isReasonInvalid();

      expect(isReasonInvalid).toEqual(false);
    });
  });

  describe('#setDateValue', () => {
    it('should set date value', () => {
      const testValue = '01/01/2024';
      component.setDateValue(testValue);
      expect(component.retainDateFormControl.value).toEqual(testValue);
    });
  });
});
