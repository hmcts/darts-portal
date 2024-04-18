import { JsonPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatepickerComponent } from '@common/datepicker/datepicker.component';

@Component({
  selector: 'app-search-transcripts-form',
  standalone: true,
  imports: [ReactiveFormsModule, DatepickerComponent, NgIf, JsonPipe],
  templateUrl: './search-transcripts-form.component.html',
  styleUrl: './search-transcripts-form.component.scss',
})
export class SearchTranscriptsFormComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    requestId: [''],
    caseId: [''],
    courthouse: [''],
    hearingDate: [''],
    owner: [''],
    requestedBy: [''],
    requestedDate: this.fb.group({ type: [''], specific: [''], from: [''], to: [''] }),
    requestMethod: [''],
  });

  @Output() search = new EventEmitter<typeof this.form.value>();

  isAdvancedSearch = false;

  get requestedDateTypeControl() {
    return this.form.controls.requestedDate.controls.type;
  }

  get requestedDateFromControl() {
    return this.form.controls.requestedDate.controls.from;
  }

  get requestedDateToControl() {
    return this.form.controls.requestedDate.controls.to;
  }

  get requestedDateSpecificControl() {
    return this.form.controls.requestedDate.controls.specific;
  }

  toggleAdvancedSearch() {
    this.isAdvancedSearch = !this.isAdvancedSearch;
  }

  setInputValue(value: string, control: string) {
    this.form.get(control)?.setValue(value);
  }

  onSubmit() {
    this.search.emit(this.form.value);
  }
}
