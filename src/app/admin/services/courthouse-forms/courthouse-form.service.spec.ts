import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { CaseSearchFormValues } from '@portal-types/index';
import { CourthouseFormService } from './courthouse-form.service';

describe('CourthouseFormService', () => {
  let service: CourthouseFormService;
  let form: FormGroup;
  let formValuesSignal: WritableSignal<CaseSearchFormValues>;

  const courthouseList = [
    { id: 1, displayName: 'Cardiff' },
    { id: 2, displayName: 'Reading' },
  ] as Courthouse[];

  beforeEach(() => {
    service = new CourthouseFormService();

    form = new FormGroup({
      courthouses: new FormControl([]),
    });

    formValuesSignal = {
      update: jest.fn(),
    } as unknown as WritableSignal<CaseSearchFormValues>;
  });

  describe('updateSelectedCourthouse', () => {
    it('should add courthouse if not already selected', () => {
      const selected: AutoCompleteItem = { id: 1, name: 'Cardiff' };

      service.updateSelectedCourthouse(selected, courthouseList, form, formValuesSignal);

      expect(form.value.courthouses).toEqual([{ id: 1, displayName: 'Cardiff' }]);
      expect(formValuesSignal.update).toHaveBeenCalled();
    });

    it('should do nothing if selected is null', () => {
      service.updateSelectedCourthouse(null, courthouseList, form, formValuesSignal);

      expect(form.value.courthouses).toEqual([]);
      expect(formValuesSignal.update).not.toHaveBeenCalled();
    });

    it('should do nothing if courthouse not found in list', () => {
      const selected: AutoCompleteItem = { id: 999, name: 'Nonexistent' };

      service.updateSelectedCourthouse(selected, courthouseList, form, formValuesSignal);

      expect(form.value.courthouses).toEqual([]);
      expect(formValuesSignal.update).not.toHaveBeenCalled();
    });

    it('should not add if already selected', () => {
      form.patchValue({ courthouses: [{ id: 1, displayName: 'Cardiff' }] });

      const selected: AutoCompleteItem = { id: 1, name: 'Cardiff' };
      service.updateSelectedCourthouse(selected, courthouseList, form, formValuesSignal);

      expect(form.value.courthouses).toEqual([{ id: 1, displayName: 'Cardiff' }]);
      expect(formValuesSignal.update).not.toHaveBeenCalled();
    });
  });

  describe('removeSelectedCourthouse', () => {
    it('should remove courthouse by id', () => {
      form.patchValue({ courthouses: courthouseList });

      service.removeSelectedCourthouse(1, form, formValuesSignal);

      expect(form.value.courthouses).toEqual([{ id: 2, displayName: 'Reading' }]);
      expect(formValuesSignal.update).toHaveBeenCalled();
    });

    it('should do nothing if id not found', () => {
      form.patchValue({ courthouses: courthouseList });

      service.removeSelectedCourthouse(999, form, formValuesSignal);

      expect(form.value.courthouses).toEqual(courthouseList);
      expect(formValuesSignal.update).toHaveBeenCalled();
    });
  });
});
