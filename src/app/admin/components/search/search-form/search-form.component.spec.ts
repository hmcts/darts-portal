import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
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
    it('add courthouse to selectedCourthouses', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });
      expect(component.formValues().courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });

    it('do not add courthouse if already selected', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      component.formValues.update((v) => ({
        ...v,
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      }));
      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });
      expect(component.formValues().courthouses).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });
  });

  describe('removeSelectedCourthouse', () => {
    it('remove courthouse from selectedCourthouses', () => {
      component.formValues.update((v) => ({
        ...v,
        courthouses: [{ id: 1, displayName: 'Courthouse 1' } as Courthouse],
      }));
      component.removeSelectedCourthouse(1);
      expect(component.formValues().courthouses).toEqual([]);
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

      expect(logicErrorSpy).toHaveBeenCalledWith('COMMON_105');
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
