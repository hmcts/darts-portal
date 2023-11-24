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
}
