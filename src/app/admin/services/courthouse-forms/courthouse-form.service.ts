import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Injectable, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { CaseSearchFormValues } from '@portal-types/index';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';

@Injectable({ providedIn: 'root' })
export class CourthouseFormService {
  updateSelectedCourthouse(
    selected: AutoCompleteItem | null,
    courthouses: Courthouse[],
    form: FormGroup,
    formValuesSignal: WritableSignal<CaseSearchFormValues | AdminSearchFormValues>
  ): void {
    if (!selected) return;

    const courthouse = courthouses.find((c) => c.id === selected.id);
    if (!courthouse) return;

    const alreadySelected = form.value.courthouses.some((c: { id: number }) => c.id === courthouse.id);
    if (alreadySelected) return;

    const updatedCourthouses = [...form.value.courthouses, courthouse];

    form.patchValue({ courthouses: updatedCourthouses });
    form.get('courthouses')?.markAsDirty();

    formValuesSignal.update(() => ({
      ...(form.value as CaseSearchFormValues),
      courthouses: updatedCourthouses,
    }));
  }

  removeSelectedCourthouse(
    courthouseId: number,
    form: FormGroup,
    formValuesSignal: WritableSignal<CaseSearchFormValues | AdminSearchFormValues>
  ): void {
    const updatedCourthouses = form.value.courthouses.filter((c: { id: number }) => c.id !== courthouseId);

    form.patchValue({ courthouses: updatedCourthouses });
    form.get('courthouses')?.markAsDirty();

    formValuesSignal.update(() => ({
      ...(form.value as CaseSearchFormValues),
      courthouses: updatedCourthouses,
    }));
  }
}
