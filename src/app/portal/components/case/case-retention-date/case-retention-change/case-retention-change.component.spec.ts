import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@services/user/user.service';
import { CaseRetentionChangeComponent } from './case-retention-change.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { CaseService } from '@services/case/case.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTime } from 'luxon';

describe('CaseRetentionComponent', () => {
  let component: CaseRetentionChangeComponent;
  let fixture: ComponentFixture<CaseRetentionChangeComponent>;
  let mockUserService: Partial<UserService>;
  let mockCaseService: Partial<CaseService>;

  const datePageFormat = 'dd/MM/yyyy';
  const dateApiFormat = 'yyyy-MM-dd';

  const currentRetentionDate = DateTime.fromObject({
    year: 2024,
    month: 1,
    day: 1,
  });
  const originalRetentionDate = DateTime.fromObject({
    year: 2023,
    month: 1,
    day: 1,
  });

  beforeEach(() => {
    mockUserService = {
      hasRoles: jest.fn(),
    };

    // By default, we'll return a successful response
    mockCaseService = {
      postCaseRetentionDateValidate: jest.fn().mockReturnValue(
        of({
          retention_date: currentRetentionDate.toFormat(dateApiFormat),
        })
      ),
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
      // Select date option
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
      // Select any option
      component.retainOptionFormControl.patchValue('permanent');
      const expected = [{ fieldId: 'change-reason', message: 'You must explain why you are making this change' }];
      component.onConfirm();
      expect(component.errors).toEqual(expected);
    });

    it('should show error message if user is NOT Admin or Judge and date is set before current retention date', () => {
      const errorResponse = new HttpErrorResponse({
        error: { title: 'The retention date being applied is too early.' },
        status: 403,
      });
      jest.spyOn(mockCaseService, 'postCaseRetentionDateValidate').mockReturnValue(throwError(() => errorResponse));
      // Select date option
      component.retainOptionFormControl.patchValue('date');
      // Type in a date that is lower than the original date
      component.retainDateFormControl.patchValue('31/12/2023');
      component.retainDateFormControl.markAsDirty();
      // Add a reason
      component.retainReasonFormControl.patchValue('This is a test');
      component.retainReasonFormControl.markAsDirty();
      // Confirm the date
      component.onConfirm();

      expect(component.errorDate).toEqual(
        'You do not have permission to reduce the current retention date.\r\nPlease refer to the DARTS retention policy guidance.'
      );
    });

    it('should show error message if user is Admin or Judge but date is set before original retention date', () => {
      const errorResponse = new HttpErrorResponse({
        error: { latest_automated_retention_date: originalRetentionDate.toFormat(dateApiFormat) },
        status: 422,
      });
      jest.spyOn(mockCaseService, 'postCaseRetentionDateValidate').mockReturnValue(throwError(() => errorResponse));
      // Select date option
      component.retainOptionFormControl.patchValue('date');
      // Type in a date that is lower than the original date
      component.retainDateFormControl.patchValue('31/12/2022');
      component.retainDateFormControl.markAsDirty();
      // Add a reason
      component.retainReasonFormControl.patchValue('This is a test');
      component.retainReasonFormControl.markAsDirty();
      // Confirm the date
      component.onConfirm();

      expect(component.errorDate).toEqual(
        `You cannot set retention date earlier than ${originalRetentionDate.toFormat(datePageFormat)}`
      );
    });

    it('should show error message if date is set after the "permanent" date', () => {
      const maxYears = 99;
      const errorResponse = new HttpErrorResponse({
        error: { max_duration: `${maxYears}Y0M0D` },
        status: 422,
      });
      jest.spyOn(mockCaseService, 'postCaseRetentionDateValidate').mockReturnValue(throwError(() => errorResponse));
      // Select date option
      component.retainOptionFormControl.patchValue('date');
      // Type in a date that is higher than the original date
      component.retainDateFormControl.patchValue('31/12/3000');
      component.retainDateFormControl.markAsDirty();
      // Add a reason
      component.retainReasonFormControl.patchValue('This is a test');
      component.retainReasonFormControl.markAsDirty();
      // Confirm the date
      component.onConfirm();

      expect(component.errorDate).toEqual(
        `You cannot retain a case for more than ${maxYears} years after the case closed`
      );
    });

    it('should emit stateChange events if all is OK', () => {
      const testReason = 'This is the reason';
      // Select date option
      component.retainOptionFormControl.patchValue('date');
      // Type in the current retention date
      component.retainDateFormControl.patchValue(currentRetentionDate.toFormat(datePageFormat));
      component.retainDateFormControl.markAsDirty();
      // Add a reason
      component.retainReasonFormControl.patchValue(testReason);
      component.retainReasonFormControl.markAsDirty();

      const stateChangeSpy = jest.spyOn(component.stateChange, 'emit');
      const retentionDateChangeSpy = jest.spyOn(component.retentionDateChange, 'emit');
      const retentionReasonChange = jest.spyOn(component.retentionReasonChange, 'emit');

      // Confirm the date
      component.onConfirm();

      expect(stateChangeSpy).toHaveBeenCalledWith('Confirm');
      expect(retentionDateChangeSpy).toHaveBeenCalledWith(currentRetentionDate.toJSDate());
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
