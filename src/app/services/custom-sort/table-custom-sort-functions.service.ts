import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableCustomSortFunctionsService {
  constructor() {}

  transcriptionUrgencyCustomSort(a: unknown, b: unknown, direction?: 'asc' | 'desc') {
    const priorityMatrix = this.priorityMatrix;

    if (direction === 'desc') {
      return (
        priorityMatrix.get((a as TranscriptionDataTableRow).urgency)! -
        priorityMatrix.get((b as TranscriptionDataTableRow).urgency)!
      );
    } else if (direction === 'asc') {
      return (
        priorityMatrix.get((b as TranscriptionDataTableRow).urgency)! -
        priorityMatrix.get((a as TranscriptionDataTableRow).urgency)!
      );
    } else {
      return 0;
    }
  }
}
