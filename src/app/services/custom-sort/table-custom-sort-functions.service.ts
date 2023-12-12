import { Injectable } from '@angular/core';
import { Order } from '@darts-types/data-table-column.interface';
import { TranscriptionDataTableRow } from '@darts-types/transcription-datatable-row.interface';

@Injectable({
  providedIn: 'root',
})
export class TableCustomSortFunctionsService {
  // only works for transcription data table
  sortByUrgencyPriorityOrder(a: unknown, b: unknown, direction?: Order) {
    const castedA = a as TranscriptionDataTableRow;
    const castedB = b as TranscriptionDataTableRow;

    if (direction === 'desc') {
      return castedA.urgency.priority_order - castedB.urgency.priority_order;
    } else if (direction === 'asc') {
      return castedB.urgency.priority_order - castedA.urgency.priority_order;
    } else {
      return 0;
    }
  }
}
