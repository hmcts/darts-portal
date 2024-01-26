import { FormControl } from '@angular/forms';
/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import { initAll } from '@scottish-government/pattern-library/src/all';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements AfterViewChecked {
  @Input() id: string | null = null;
  @Input() name: string | null = null;
  @Input() error: string | null = null;
  @Input() label!: string;
  @Input() hint!: string;
  @Output() dateChange = new EventEmitter<string>();

  setDateValue(value: string) {
    this.dateChange.emit(value);
  }

  ngAfterViewChecked(): void {
    initAll();
  }
}
