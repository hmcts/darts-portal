import { Injectable } from '@angular/core';
import { Order } from '@darts-types/data-table-column.interface';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  // only works for transcription data table
  sortByUrgencyPriorityOrder(a: unknown, b: unknown, direction?: Order) {
    const urgencyA = a as { urgency: TranscriptionUrgency };
    const urgencyB = b as { urgency: TranscriptionUrgency };

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
