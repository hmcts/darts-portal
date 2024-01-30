import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewChecked } from '@angular/core';
import { initAll } from '@scottish-government/pattern-library/src/all';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements AfterViewChecked {
  @Input({ required: true }) control!: FormControl;
  @Input() inputId: string | null = null;
  @Input() name: string | null = null;
  @Input() label!: string;
  @Input() hint!: string;
  @Input() errors: string[] | null = null;
  @Output() dateChange = new EventEmitter<string>();

  setDateValue(value: string) {
    this.dateChange.emit(value);
  }

  areDateErrors() {
    // If all items in array are empty strings
    // or there are no errors, return false
    return !this.errors?.every((value) => value === '') && !!this.errors?.length;
  }

  ngAfterViewChecked(): void {
    initAll();
  }
}
