import { TestBed } from '@angular/core/testing';

import { TranscriptionUrgency } from '@darts-types/index';
import { TableCustomSortFunctionsService } from './table-custom-sort-functions.service';

describe('TableCustomSortFunctionsService', () => {
  let service: TableCustomSortFunctionsService;

  const mockUrgencyA: { urgency: TranscriptionUrgency } = {
    urgency: {
      transcription_urgency_id: 1,
      description: 'Overnight',
      priority_order: 1,
    },
  };

  const mockUrgencyB: { urgency: TranscriptionUrgency } = {
    urgency: {
      transcription_urgency_id: 3,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableCustomSortFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#sortByUrgencyPriorityOrder', () => {
    it('should sort 2 rows in descending order', () => {
      const result = service.sortByUrgencyPriorityOrder(mockUrgencyA, mockUrgencyB, 'desc');
      expect(result).toEqual(-2);
    });
    it('should sort 2 rows in ascending order', () => {
      const result = service.sortByUrgencyPriorityOrder(mockUrgencyA, mockUrgencyB, 'asc');
      expect(result).toEqual(2);
    });
    it("should shouldn't sort if there isn't an order passed into the function", () => {
      const result = service.sortByUrgencyPriorityOrder(mockUrgencyA, mockUrgencyA);
      expect(result).toEqual(0);
    });
  });
});
