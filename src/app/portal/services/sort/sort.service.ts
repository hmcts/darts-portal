import { Injectable } from '@angular/core';
import { Order } from '@core-types/data-table/data-table-column.interface';
import { Urgency } from '@portal-types/transcriptions/transcription-urgency.interface';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  // only works for transcription data table
  sortByUrgencyPriorityOrder(a: unknown, b: unknown, direction?: Order) {
    const urgencyA = a as { urgency: Urgency };
    const urgencyB = b as { urgency: Urgency };

    if (!urgencyA?.urgency || !urgencyB?.urgency) {
      return -1;
    }

    if (direction === 'desc') {
      return urgencyA.urgency.priority_order! - urgencyB.urgency.priority_order!;
    } else if (direction === 'asc') {
      return urgencyB.urgency.priority_order! - urgencyA.urgency.priority_order!;
    } else {
      return 0;
    }
  }
}
