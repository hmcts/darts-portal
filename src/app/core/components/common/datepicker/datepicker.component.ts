import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initAll } from '@ministryofjustice/frontend';
import { DateTime } from 'luxon';

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
  @Input() ariaLabel: string = 'Enter a date in dd/mm/yyyy format.';
  @Input() hint: string = 'For example, 17/5/2024.';
  @Input() errors: string[] | null = null;
  @Output() dateChange = new EventEmitter<string>();

  setDateValue(value: string) {
    const zeroPaddedDate = DateTime.fromFormat(value, 'd/M/yyyy').toFormat('dd/MM/yyyy');
    this.dateChange.emit(zeroPaddedDate);
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
