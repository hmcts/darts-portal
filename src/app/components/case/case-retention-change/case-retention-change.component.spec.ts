import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '@services/user/user.service';
import { CaseRententionChangeComponent } from './case-retention-change.component';

describe('CaseRetentionComponent', () => {
  let component: CaseRententionChangeComponent;
  let fixture: ComponentFixture<CaseRententionChangeComponent>;

  const fakeUserService = { isRequester: () => true, isTranscriber: () => false } as Partial<UserService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseRententionChangeComponent],
      providers: [{ provide: UserService, useValue: fakeUserService }],
    });
    fixture = TestBed.createComponent(CaseRententionChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onChange', () => {
    it('should reset errors', () => {
      component.onChange();
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
    it('should return false if date format', () => {
      component.retainDateFormControl.markAsDirty();
      component.retainDateFormControl.patchValue('01/01/2024');
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(false);
    });

    it('should return true if not date', () => {
      component.retainDateFormControl.markAsDirty();
      component.retainDateFormControl.patchValue('TEST');
      const isDateInvalid = component.isDateInvalid();

      expect(isDateInvalid).toEqual(true);
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
