import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { of } from 'rxjs';
import { CreateUpdateCourthouseFormComponent } from './create-update-courthouse-form.component';
import { CourthouseService } from '@services/courthouses/courthouses.service';

type formValidationTestCase = {
  name: string;
  data: CreateUpdateCourthouseFormValues;
  validity: boolean;
  courthouseNameExists?: boolean;
  displayNameExists?: boolean;
};

const formValidationTestCases: formValidationTestCase[] = [
  {
    name: 'valid when all fields are valid',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', region: 'South west' },
    validity: true,
  },
  {
    name: 'invalid when full name is empty',
    data: { courthouseName: '', displayName: 'Courthouse', region: 'South west' },
    validity: false,
  },
  {
    name: 'invalid when email is empty',
    data: { courthouseName: 'COURTHOUSE', displayName: '', region: 'South west' },
    validity: false,
  },
  {
    name: 'invalid when courthouseName already exists in DB',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', region: 'South west' },
    validity: false,
    courthouseNameExists: true,
  },
  {
    name: 'invalid when displayName already exists in DB',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', region: 'South west' },
    validity: false,
    displayNameExists: true,
  },
  {
    name: 'valid when optional description is empty',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', region: null },
    validity: true,
  },
];

describe('CreateUpdateCourthouseFormComponent', () => {
  let component: CreateUpdateCourthouseFormComponent;
  let fixture: ComponentFixture<CreateUpdateCourthouseFormComponent>;
  let mockCourthouseService: Partial<CourthouseService>;

  beforeEach(async () => {
    mockCourthouseService = { doesDisplayNameExist: jest.fn(() => of(false)) };

    await TestBed.configureTestingModule({
      imports: [CreateUpdateCourthouseFormComponent],
      providers: [{ provide: CourthouseService, useValue: mockCourthouseService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCourthouseFormComponent);
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
        courthouseName: 'COURTHOUSE',
        displayName: 'Courthouse',
        region: 'South west',
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
        { fieldId: 'courthouseName', message: 'Enter courthouse name' },
        { fieldId: 'displayName', message: 'Enter display name' },
      ]);
    });

    it('does not emit errors when form is valid', fakeAsync(() => {
      jest.spyOn(component.errors, 'emit');

      component.form.setValue({ courthouseName: 'COURTHOUSE', displayName: 'Courthouse', region: 'South west' });

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
          mockCourthouseService.doesCourthouseNameExist = jest.fn(() => of(test?.courthouseNameExists || false));
          mockCourthouseService.doesDisplayNameExist = jest.fn(() => of(test?.displayNameExists || false));

          component.form.get('courthouseName')?.setValue(test.data.courthouseName);
          component.form.get('displayName')?.setValue(test.data.displayName);
          component.form.get('region')?.setValue(test.data.region);

          tick(500); // wait for async validators to complete
          component.form.updateValueAndValidity();

          expect(component.form.valid).toBe(test.validity);
        })
      );
    });
  });

  describe('#ngOnInit', () => {
    it('should set form value when updating a courthouse', fakeAsync(() => {
      const updateCourthouse = {
        courthouseName: 'COURTHOUSE',
        displayName: 'Courthouse',
        region: 'South west',
      };
      component.updateCourthouse = updateCourthouse;

      component.ngOnInit();

      tick(500); // wait for async validators to complete

      expect(component.form.value).toEqual(updateCourthouse);
      expect(component.form.get('displayName')?.asyncValidator).toEqual(null);
      expect(component.form.valid).toBe(true);
    }));

    it('should not modify form values when not updating a courthouse', () => {
      component.updateCourthouse = null;
      const originalFormValue = component.form.value;

      component.ngOnInit();

      expect(component.form.value).toEqual(originalFormValue);
      expect(component.form.get('displayName')?.asyncValidator).not.toEqual(null);
      expect(component.form.valid).toBe(false);
    });
  });
});
