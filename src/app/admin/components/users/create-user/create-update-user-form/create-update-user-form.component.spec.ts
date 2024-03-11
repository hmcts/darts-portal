import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateUpdateUserFormValues } from '@admin-types/index';
import { By } from '@angular/platform-browser';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { CreateUpdateUserFormComponent } from './create-update-user-form.component';

type formValidationTestCase = {
  name: string;
  data: CreateUpdateUserFormValues;
  validity: boolean;
  emailExists: boolean;
  errorText?: string;
};

const formValidationTestCases: formValidationTestCase[] = [
  {
    name: 'valid when all fields are valid',
    data: { fullName: 'Test User', email: 'test@user.com', description: 'A test user' },
    validity: true,
    emailExists: false,
  },
  {
    name: 'invalid when full name is empty',
    data: { fullName: '', email: 'test@user.com', description: 'A test user' },
    validity: false,
    emailExists: false,
    errorText: 'Enter a full name',
  },
  {
    name: 'invalid when email is empty',
    data: { fullName: 'Test User', email: '', description: 'A test user' },
    validity: false,
    emailExists: false,
    errorText: 'Enter an email address',
  },
  {
    name: 'invalid when email is not a valid email',
    data: { fullName: 'Test User', email: 'test', description: 'A test user' },
    validity: false,
    emailExists: false,
    errorText: 'Enter an email address in the correct format, like name@example.com',
  },
  {
    name: 'invalid when email already exists in DB',
    data: { fullName: 'Test User', email: 'test@user.com', description: 'A test user' },
    validity: false,
    emailExists: true,
    errorText: 'Enter a unique email address',
  },
  {
    name: 'valid when optional description is empty',
    data: { fullName: 'Test User', email: 'test@user.com', description: null },
    validity: true,
    emailExists: false,
  },
  {
    name: 'invalid when optional description is too long',
    data: { fullName: 'Test User', email: 'test@test.com', description: 'A'.repeat(257) },
    validity: false,
    emailExists: false,
    errorText: 'Enter a description shorter than 256 characters',
  },
];

describe('CreateUpdateUserFormComponent', () => {
  let component: CreateUpdateUserFormComponent;
  let fixture: ComponentFixture<CreateUpdateUserFormComponent>;
  let mockUserAdminService: Partial<UserAdminService>;

  beforeEach(async () => {
    mockUserAdminService = { doesEmailExist: jest.fn(() => of(false)) };

    await TestBed.configureTestingModule({
      imports: [CreateUpdateUserFormComponent],
      providers: [{ provide: UserAdminService, useValue: mockUserAdminService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onSubmit', () => {
    it('emits form values', fakeAsync(() => {
      jest.spyOn(component.submitForm, 'emit');
      const formValues = {
        fullName: 'Test User',
        email: 'test@test.com',
        description: 'A test user',
      };

      component.form.setValue(formValues);
      tick(500);

      component.onSubmit();

      expect(component.submitForm.emit).toHaveBeenCalledWith(formValues);
    }));

    it('emits errors when form is invalid', () => {
      jest.spyOn(component.errors, 'emit');
      component.onSubmit();

      expect(component.errors.emit).toHaveBeenCalledWith([
        { fieldId: 'fullName', message: 'Enter a full name' },
        { fieldId: 'email', message: 'Enter an email address' },
      ]);
    });

    it('does not emit errors when form is valid', fakeAsync(() => {
      jest.spyOn(component.errors, 'emit');

      component.form.setValue({ fullName: 'Test User', email: 'test@test.com', description: 'A test user' });

      tick(500);
      component.onSubmit();

      expect(component.errors.emit).toHaveBeenCalledWith([]);
    }));

    it('does not emit submitForm when form is pending', fakeAsync(() => {
      jest.spyOn(component.submitForm, 'emit');
      const formValues = {
        fullName: 'Test User',
        email: 'test@test.com',
        description: 'A test user',
      };
      component.form.setValue(formValues);

      tick(500);
      component.form.markAsPending();
      component.onSubmit();

      expect(component.submitForm.emit).not.toHaveBeenCalled();
    }));
  });

  describe('#onCancel', () => {
    it('emits cancel event', () => {
      jest.spyOn(component.cancel, 'emit');
      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    formValidationTestCases.forEach((test) => {
      it(
        test.name,
        fakeAsync(() => {
          mockUserAdminService.doesEmailExist = jest.fn(() => of(test.emailExists));

          component.form.get('fullName')?.setValue(test.data.fullName);
          component.form.get('email')?.setValue(test.data.email);
          component.form.get('description')?.setValue(test.data.description);

          tick(500); // wait for async validators to complete

          component.form.markAllAsTouched();
          component.form.updateValueAndValidity();

          if (test.errorText) {
            fixture.detectChanges();

            const errorText = fixture.debugElement
              .queryAll(By.css('.govuk-error-message'))
              .find((el) => el.nativeElement.textContent.includes(test.errorText));

            expect(errorText).toBeTruthy();
          }

          expect(component.form.valid).toBe(test.validity);
        })
      );
    });
  });

  describe('#ngOnInit', () => {
    it('should set form values and remove email exists validator when updating a user', fakeAsync(() => {
      const updateUser = {
        fullName: 'Test User',
        email: 'test@test.com',
        description: 'A test user',
      };
      component.updateUser = updateUser;

      component.ngOnInit();

      tick(500); // wait for async validators to complete

      expect(component.form.value).toEqual(updateUser);
      expect(component.form.get('email')?.asyncValidator).toEqual(null);
      expect(component.form.valid).toBe(true);
    }));

    it('should not modify form values when not updating a user', () => {
      component.updateUser = null;
      const originalFormValue = component.form.value;

      component.ngOnInit();

      expect(component.form.value).toEqual(originalFormValue);
      expect(component.form.get('email')?.asyncValidator).not.toEqual(null);
      expect(component.form.valid).toBe(false);
    });
  });
});
