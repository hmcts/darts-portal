import { DetailsTableLink } from '@core-types/details-table/details-table-array.interface';
import { CommonModule, KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-details-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-table.component.html',
  styleUrl: './details-table.component.scss',
})
export class DetailsTableComponent<T extends object> {
  @Input({ required: true }) title = '';
  @Input({ required: true }) details!: T;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
    return 0;
  };

  isNotNullUndefinedOrEmptyString(value: unknown) {
    return value !== null && value !== undefined && value !== '';
  }

  getLinkArray(value: DetailsTableLink[] | string): DetailsTableLink[] {
    // Return the array if it is DetailsTableLink, otherwise empty array
    return typeof value === 'string' ? [] : value;
  }
}
