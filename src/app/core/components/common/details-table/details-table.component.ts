import { CommonModule, KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DetailsTableLink } from '@core-types/details-table/details-table-array.interface';

export type SummaryListAcion = {
  text: string;
  url?: string;
  fragment?: string;
  fn?: () => void;
  queryParams?: { [key: string]: string };
};

@Component({
  selector: 'app-details-table',
  standalone: true,
  imports: [CommonModule, RouterLink, GovukHeadingComponent],
  templateUrl: './details-table.component.html',
  styleUrl: './details-table.component.scss',
})
export class DetailsTableComponent<T extends object> {
  @Input({ required: true }) title = '';
  @Input({ required: true }) details!: T;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  originalOrder = (a: KeyValue<string, unknown>, b: KeyValue<string, unknown>): number => {
    return 0;
  };

  isNotNullUndefinedOrEmptyString(value: unknown) {
    return value !== null && value !== undefined && value !== '';
  }

  getLinkArray(value: unknown): DetailsTableLink[] {
    // Return the array if it is DetailsTableLink, otherwise empty array
    return typeof value === 'string' ? [] : (value as DetailsTableLink[]);
  }

  getAction(value: unknown): SummaryListAcion | null {
    if (this.doesValueHaveAction(value)) {
      return (value as { action: SummaryListAcion })?.action;
    }
    return null;
  }

  doesValueHaveAction(obj: unknown): obj is { action: SummaryListAcion } {
    if (typeof obj !== 'object' || !obj) return false;
    return 'action' in obj;
  }

  getStringValues(value: unknown) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'object' && value !== null) {
      if ('value' in value) {
        return value['value'];
      }
    }
    return null;
  }
}
