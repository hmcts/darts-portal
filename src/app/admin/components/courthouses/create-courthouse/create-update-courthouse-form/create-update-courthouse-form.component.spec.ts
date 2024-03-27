import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreateUpdateCourthouseFormValues, SecurityGroup } from '@admin-types/index';
import { CourthouseService } from '@services/courthouses/courthouses.service';
import { of } from 'rxjs';
import { CreateUpdateCourthouseFormComponent } from './create-update-courthouse-form.component';

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
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', regionId: 1, securityGroupIds: [] },
    validity: true,
  },
  {
    name: 'invalid when courthouseName is empty',
    data: { courthouseName: '', displayName: 'Courthouse', regionId: 1, securityGroupIds: [] },
    validity: false,
  },
  {
    name: 'invalid when displayName is empty',
    data: { courthouseName: 'COURTHOUSE', displayName: '', regionId: 1, securityGroupIds: [] },
    validity: false,
  },
  {
    name: 'invalid when courthouseName already exists in DB',
    data: { courthouseName: 'COURTHOUSEEXISTS', displayName: 'Courthouse', regionId: 1, securityGroupIds: [] },
    validity: false,
    courthouseNameExists: true,
  },
  {
    name: 'invalid when displayName already exists in DB',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse Exists', regionId: 1, securityGroupIds: [] },
    validity: false,
    displayNameExists: true,
  },
  {
    name: 'valid when regionId is null',
    data: { courthouseName: 'COURTHOUSE', displayName: 'Courthouse', regionId: null, securityGroupIds: [] },
    validity: true,
  },
];

describe('CreateUpdateCourthouseFormComponent', () => {
  let component: CreateUpdateCourthouseFormComponent;
  let fixture: ComponentFixture<CreateUpdateCourthouseFormComponent>;
  let mockCourthouseService: Partial<CourthouseService>;

  beforeEach(async () => {
    mockCourthouseService = {
      getCourthouses: jest.fn(() => of([])),
    };
    await TestBed.configureTestingModule({
      imports: [CreateUpdateCourthouseFormComponent],
      providers: [{ provide: CourthouseService, useValue: mockCourthouseService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCourthouseFormComponent);
    component = fixture.componentInstance;
    component.courthouses = [
      { id: 0, code: 0, courthouse_name: 'COURTHOUSEEXISTS', display_name: 'Courthouse Exists', created_date_time: '' },
    ];
    component.companies = [
      { id: 1, name: 'Transcriber company 1' },
      { id: 2, name: 'Transcriber company 2' },
    ] as SecurityGroup[];
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
        regionId: 1,
        securityGroupIds: [],
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
        { fieldId: 'courthouseName', message: 'Enter a courthouse code' },
        { fieldId: 'displayName', message: 'Enter a display name' },
        { fieldId: 'regionId', message: 'Select a region' },
      ]);
    });

    it('does not emit errors when form is valid', fakeAsync(() => {
      jest.spyOn(component.errors, 'emit');

      component.form.setValue({
        courthouseName: 'COURTHOUSE',
        displayName: 'Courthouse',
        regionId: 1,
        securityGroupIds: [],
      });

      tick(500);
      component.onSubmit();

      expect(component.errors.emit).toHaveBeenCalledWith([]);
    }));
  });

  describe('#formatNameToId', () => {
    it('Should change name to id radio style', () => {
      expect(component.formatNameToRadioId('Test ID')).toEqual('test-id-radio');
    });
    it('Should provide "no-region" if undefined', () => {
      expect(component.formatNameToRadioId(undefined)).toEqual('no-region-radio');
    });
  });

  describe('#onCancel', () => {
    it('emits cancel event', () => {
      jest.spyOn(component.cancel, 'emit');
      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('#selectCompany', () => {
    it('finds appropriate company on select', () => {
      const companies = [
        { id: 0, name: 'Company 1' },
        { id: 1, name: 'Company 2' },
      ] as SecurityGroup[];
      component.companies = companies;
      component.selectCompany('1');
      expect(component.selectedCompany).toEqual(companies[1]);
    });
  });

  describe('#addCompany', () => {
    it('finds appropriate company and adds to form array on "Add company" button press"', () => {
      const companies = [
        { id: 0, name: 'Company 1' },
        { id: 1, name: 'Company 2' },
        { id: 2, name: 'Company 3' },
      ] as SecurityGroup[];
      component.companies = companies;
      component.selectCompany('1');
      component.addCompany();
      component.selectCompany('2');
      component.addCompany();
      expect(component.selectedCompanies).toEqual([companies[1], companies[2]]);
    });
  });

  describe('#removeCompany', () => {
    it('finds appropriate company and removes from form array on "Remove" button press"', () => {
      const companies = [
        { id: 0, name: 'Company 1' },
        { id: 1, name: 'Company 2' },
        { id: 2, name: 'Company 3' },
      ] as SecurityGroup[];
      component.selectedCompanies = [...companies];
      component.removeCompany(1);
      expect(component.selectedCompanies).toEqual([companies[0], companies[2]]);
    });
  });

  describe('form validation', () => {
    formValidationTestCases.forEach((test) => {
      it(
        test.name,
        fakeAsync(() => {
          component.form.get('courthouseName')?.setValue(test.data.courthouseName);
          component.form.get('displayName')?.setValue(test.data.displayName);
          component.form.get('regionId')?.setValue(test.data.regionId);

          tick(500); // wait for async validators to complete
          component.form.updateValueAndValidity();

          expect(component.form.valid).toBe(test.validity);
        })
      );
    });
  });

  describe('#ngOnInit', () => {
    it('should not modify form values when not updating a courthouse', () => {
      component.updateCourthouse = null;
      const originalFormValue = component.form.value;

      component.ngOnInit();

      expect(component.form.value).toEqual(originalFormValue);
      expect(component.form.valid).toBe(false);
    });

    it('should provide empty string on no region', () => {
      const updateCourthouse = {
        courthouseName: 'COURTHOUSE',
        displayName: 'Courthouse',
        regionId: undefined,
        securityGroupIds: ['1', '2'],
      };
      component.updateCourthouse = updateCourthouse;

      component.ngOnInit();

      expect(component.form.get('regionId')?.value).toEqual(null);
      // Form should be valid because region will be selected as "No region"
      expect(component.form.valid).toBe(true);
    });
  });
});
