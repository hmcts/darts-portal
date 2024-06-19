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
      component.selectedCourthouses.set([{ id: 1, displayName: 'Courthouse 1' } as Courthouse]);
      fixture.detectChanges();
      expect(component.courthouseAutoCompleteItems()).toEqual([]);
    });
  });

  describe('updateSelectedCourthouses', () => {
    it('add courthouse to selectedCourthouses', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });
      expect(component.selectedCourthouses()).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });

    it('do not add courthouse if already selected', () => {
      fixture.componentRef.setInput('courthouses', [{ id: 1, displayName: 'Courthouse 1' }]);
      component.selectedCourthouses.set([{ id: 1, displayName: 'Courthouse 1' } as Courthouse]);
      component.updateSelectedCourthouses({ id: 1, name: 'Courthouse 1' });
      expect(component.selectedCourthouses()).toEqual([{ id: 1, displayName: 'Courthouse 1' }]);
    });
  });

  describe('removeSelectedCourthouse', () => {
    it('remove courthouse from selectedCourthouses', () => {
      component.selectedCourthouses.set([{ id: 1, displayName: 'Courthouse 1' } as Courthouse]);
      component.removeSelectedCourthouse(1);
      expect(component.selectedCourthouses()).toEqual([]);
    });
  });

  describe('onSubmit', () => {
    it('log form value and selected courthouses', () => {
      jest.spyOn(console, 'log');
      component.form.get('caseId')?.setValue('123');
      component.form.get('courtroom')?.setValue('1');
      component.form.get('hearingDate.type')?.setValue('specific');
      component.form.get('hearingDate.specific')?.setValue('2021-01-01');
      component.form.get('resultsFor')?.setValue('cases');
      component.selectedCourthouses.set([{ id: 1, displayName: 'Courthouse 1' } as Courthouse]);

      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith({
        caseId: '123',
        courtroom: '1',
        hearingDate: { type: 'specific', specific: '2021-01-01', from: '', to: '' },
        resultsFor: 'cases',
      });
      expect(console.log).toHaveBeenCalledWith([{ id: 1, displayName: 'Courthouse 1' }]);
    });
  });
});
