import { SecurityGroup } from '@admin-types/index';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { GroupFormComponent } from './group-form.component';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Create Group', () => {
    beforeEach(() => {
      component.group = null;
      fixture.detectChanges();
    });

    it('isEdit should be false', () => {
      expect(component.isEdit).toBe(false);
    });

    it('initialize form with default values', () => {
      expect(component.form.get('name')?.value).toBe(null);
      expect(component.form.get('description')?.value).toBe(null);
      expect(component.form.get('role')?.value).toBe(null);
    });

    it('role should have required validator', () => {
      expect(component.form.get('role')?.hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('Edit Group', () => {
    beforeEach(() => {
      const group: Partial<SecurityGroup> = {
        name: 'Judiciary',
        displayName: 'Judiciary',
        description: 'Judiciary Group',
        role: {
          id: 1,
          name: 'Approver',
          displayState: true,
          displayName: 'Approver',
        },
      };
      component.group = group as SecurityGroup;
      fixture.detectChanges();
    });

    it('isEdit should be true', () => {
      expect(component.isEdit).toBe(true);
    });

    it('set form values from group input', () => {
      expect(component.form.get('name')?.value).toBe('Judiciary');
      expect(component.form.get('description')?.value).toBe('Judiciary Group');
      expect(component.form.get('role')?.value).toEqual({
        displayName: 'Approver',
        displayState: true,
        id: 1,
        name: 'Approver',
      });
    });

    it('role should not have required validator', () => {
      component.group = {} as SecurityGroup;
      fixture.detectChanges();
      expect(component.form.get('role')?.hasValidator(Validators.required)).toBe(false);
    });
  });

  describe('onSave', () => {
    beforeEach(() => {
      fixture.detectChanges();
      jest.spyOn(component.saveGroup, 'emit');
      jest.spyOn(component.errors, 'emit');
      jest.spyOn(component.form, 'markAllAsTouched');
    });

    it('should mark all form controls as touched', () => {
      component.onSave();
      expect(component.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('should emit saveGroup event if form is valid', () => {
      component.form.setValue({ name: 'Judiciary', description: 'Judiciary Group', role: 'Approver' });
      component.onSave();
      expect(component.saveGroup.emit).toHaveBeenCalledWith(component.form.value);
    });

    it('should emit error summary if form is invalid', () => {
      component.onSave();
      expect(component.errors.emit).toHaveBeenCalledWith([
        {
          fieldId: 'name',
          message: 'Enter a group name',
        },
        {
          fieldId: 'role',
          message: 'Select a role',
        },
      ]);
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      jest.spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('getFormControlErrorMessages', () => {
    it('should return error messages for control', () => {
      fixture.detectChanges();
      component.form.get('name')?.setErrors({ required: true });
      expect(component.getFormControlErrorMessages('name')).toEqual(['Enter a group name']);
    });
  });

  describe('isControlInvalid', () => {
    it('should return true if control has errors and is touched', () => {
      fixture.detectChanges();
      component.form.get('name')?.setErrors({ required: true });
      component.form.get('name')?.markAsTouched();
      expect(component.isControlInvalid('name')).toBe(true);
    });

    it('should return false if control has no errors', () => {
      fixture.detectChanges();
      expect(component.isControlInvalid('name')).toBe(false);
    });

    it('should return false if control is not touched', () => {
      fixture.detectChanges();
      component.form.get('name')?.setErrors({ required: true });
      expect(component.isControlInvalid('name')).toBe(false);
    });
  });
});
