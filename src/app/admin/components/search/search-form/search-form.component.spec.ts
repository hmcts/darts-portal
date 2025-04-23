import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { defaultFormValues } from '@services/admin-search/admin-search.service';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('courthouseAutoCompleteItems', () => {
    it('map courthouses to autocomplete items', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      fixture.detectChanges();
      expect(component.courthouseAutoCompleteItems()).toEqual([{ id: 1, name: 'Courthouse 1' }]);
    });

    it('filter out already selected courthouses', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      component.formValues.update((v) => ({
        ...v,
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      }));
      fixture.detectChanges();
      expect(component.courthouseAutoCompleteItems()).toEqual([]);
    });
  });

  describe('updateSelectedCourthouses', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      fixture.detectChanges();
    });

    it('should add courthouse to the form and signal if not already selected', () => {
      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });

      expect(component.form.value.courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
      expect(component.formValues().courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });

    it('should not add courthouse if already selected', () => {
      component.formValues.set({
        ...defaultFormValues,
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      });

      component.form.patchValue({
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      });

      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });

      expect(component.form.value.courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
      expect(component.formValues().courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });

    it('should do nothing if selectedCourthouse is null', () => {
      component.updateSelectedCourthouses(null);
      expect(component.form.value.courthouses).toEqual([]);
      expect(component.formValues().courthouses).toEqual([]);
    });

    it('should do nothing if selectedCourthouse is not found in courthouses list', () => {
      component.updateSelectedCourthouses({ id: 999, name: 'Nonexistent' });
      expect(component.form.value.courthouses).toEqual([]);
      expect(component.formValues().courthouses).toEqual([]);
    });
  });

  describe('removeSelectedCourthouse', () => {
    beforeEach(() => {
      component.form.patchValue({
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      });
      component.formValues.set({
        ...component.formValues(),
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      });
    });

    it('should remove courthouse from form and signal', () => {
      component.removeSelectedCourthouse(1);

      expect(component.form.value.courthouses).toEqual([]);
      expect(component.formValues().courthouses).toEqual([]);
    });

    it('should handle removal of non-existent courthouse gracefully', () => {
      component.removeSelectedCourthouse(999);

      // Should remain unchanged
      expect(component.form.value.courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
      expect(component.formValues().courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });
  });

  describe('onSubmit', () => {
    it('log form value and selected courthouses', () => {
      const searchSpy = jest.spyOn(component.search, 'emit');
      component.form.get('caseId')?.setValue('123');
      component.form.get('courtroom')?.setValue('1');
      component.form.get('hearingDate.type')?.setValue('specific');
      component.form.get('hearingDate.specific')?.setValue('01/01/2021');
      component.form.get('resultsFor')?.setValue('Cases');
      component.form.get('courthouses')?.setValue([{ id: 1, displayName: 'Courthouse 1' } as Courthouse]);

      component.onSubmit();

      expect(searchSpy).toHaveBeenCalledWith({
        caseId: '123',
        courtroom: '1',
        hearingDate: { type: 'specific', specific: '01/01/2021', from: '', to: '' },
        resultsFor: 'Cases',
        courthouses: [{ id: 1, displayName: 'Courthouse 1' }],
      });
    });

    it('emit errors if form is invalid', () => {
      jest.spyOn(component.errors, 'emit');

      component.form.controls.hearingDate.controls.specific.setErrors({ pattern: true });
      component.form.updateValueAndValidity();
      component.onSubmit();
      expect(component.errors.emit).toHaveBeenCalled();
    });
  });

  describe('logicError output', () => {
    it('should emit COMMON_105 when date range exceeds one year', () => {
      const logicErrorSpy = jest.spyOn(component.logicError, 'emit');

      component.form.get('hearingDate.from')?.setValue('01/01/2020');
      component.form.get('hearingDate.to')?.setValue('02/01/2021');
      component.onSubmit();

      expect(logicErrorSpy).toHaveBeenCalledWith({ code: 'COMMON_105', tabName: 'Cases' });
    });

    it('should not emit COMMON_105 when date range is less than or equal to one year', () => {
      const logicErrorSpy = jest.spyOn(component.logicError, 'emit');

      component.form.get('hearingDate.from')?.setValue('01/01/2021');
      component.form.get('hearingDate.to')?.setValue('31/12/2021');
      component.onSubmit();

      expect(logicErrorSpy).not.toHaveBeenCalledWith('COMMON_105');
    });

    it('should not emit logicError if dates are missing', () => {
      const logicErrorSpy = jest.spyOn(component.logicError, 'emit');

      component.form.get('hearingDate.from')?.setValue('');
      component.form.get('hearingDate.to')?.setValue('');
      component.onSubmit();

      expect(logicErrorSpy).not.toHaveBeenCalled();
    });
  });
});
