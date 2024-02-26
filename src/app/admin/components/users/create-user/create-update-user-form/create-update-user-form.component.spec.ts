import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateUpdateUserFormValues } from '@admin-types/index';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { of } from 'rxjs';
import { CreateUpdateUserFormComponent } from './create-update-user-form.component';

type formValidationTestCase = {
  name: string;
  data: CreateUpdateUserFormValues;
  validity: boolean;
  emailExists: boolean;
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
  },
  {
    name: 'invalid when email is empty',
    data: { fullName: 'Test User', email: '', description: 'A test user' },
    validity: false,
    emailExists: false,
  },
  {
    name: 'invalid when email is not a valid email',
    data: { fullName: 'Test User', email: 'test', description: 'A test user' },
    validity: false,
    emailExists: false,
  },
  {
    name: 'invalid when email already exists in DB',
    data: { fullName: 'Test User', email: 'test@user.com', description: 'A test user' },
    validity: false,
    emailExists: true,
  },
  {
    name: 'valid when optional description is empty',
    data: { fullName: 'Test User', email: 'test@user.com' },
    validity: true,
    emailExists: false,
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
      component.onSubmit();
      tick(500);

      expect(component.submitForm.emit).toHaveBeenCalledWith(formValues);
    }));

    it('emits errors when form is invalid', () => {
      jest.spyOn(component.errors, 'emit');
      component.onSubmit();

      expect(component.errors.emit).toHaveBeenCalledWith([
        { fieldId: 'fullName', message: 'Enter full name' },
        { fieldId: 'email', message: 'Enter email' },
      ]);
    });

    it('does not emit errors when form is valid', fakeAsync(() => {
      jest.spyOn(component.errors, 'emit');

      component.form.setValue({ fullName: 'Test User', email: 'test@test.com', description: 'A test user' });

      tick(500);
      component.onSubmit();

      expect(component.errors.emit).toHaveBeenCalledWith([]);
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
          component.form.updateValueAndValidity();

          expect(component.form.valid).toBe(test.validity);
        })
      );
    });
  });
});
