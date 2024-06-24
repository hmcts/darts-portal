import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent, AutoCompleteItem } from '@common/auto-complete/auto-complete.component';
import { SpecificOrRangeDatePickerComponent } from '@common/specific-or-range-date-picker/specific-or-range-date-picker.component';
import { dateRangeValidator } from '@validators/date-range.validator';
import { transformedMediaSearchDateValidators } from '../../transformed-media/search-transformed-media-form/search-transformed-media-form.component';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [AutoCompleteComponent, SpecificOrRangeDatePickerComponent, ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  courthouses = input<Courthouse[]>([]);
  selectedCourthouses = signal<Courthouse[]>([]);
  fb = inject(FormBuilder);

  form = this.fb.group({
    caseId: [''],
    courtroom: [''],
    hearingDate: this.fb.group(
      {
        type: [''],
        specific: ['', transformedMediaSearchDateValidators],
        from: ['', transformedMediaSearchDateValidators],
        to: ['', transformedMediaSearchDateValidators],
      },
      { validators: [dateRangeValidator('from', 'to')] }
    ),
    resultsFor: ['cases'],
  });

  courthouseAutoCompleteItems = computed(() =>
    this.courthouses()
      .map((c) => ({ id: c.id, name: c.displayName }))
      .filter((c) => !this.selectedCourthouses().some((sc) => sc.id === c.id))
  );

  updateSelectedCourthouses(selectedCourthouse: AutoCompleteItem | null) {
    if (!selectedCourthouse) return;

    const courthouse = this.courthouses().find((c) => c.id === selectedCourthouse.id);
    const isAlreadySelected = this.selectedCourthouses().some((c) => c.id === selectedCourthouse?.id);

    if (courthouse && !isAlreadySelected) {
      this.selectedCourthouses.update((courthouses) => [...courthouses, courthouse]);
    }
  }

  removeSelectedCourthouse(courthouseId: number) {
    this.selectedCourthouses.update((courthouses) => courthouses.filter((c) => c.id !== courthouseId));
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.selectedCourthouses());
  }
}
