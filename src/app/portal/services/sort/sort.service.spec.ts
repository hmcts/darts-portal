import { TestBed } from '@angular/core/testing';
import { Urgency } from '@portal-types/index';
import { SortService } from './sort.service';

describe('TableCustomSortFunctionsService', () => {
  let service: SortService;

  const mockUrgencyA: { urgency: Urgency } = {
    urgency: {
      transcription_urgency_id: 1,
      description: 'Overnight',
      priority_order: 1,
    },
  };

  const mockUrgencyB: { urgency: Urgency } = {
    urgency: {
      transcription_urgency_id: 3,
      description: 'Up to 3 working days',
      priority_order: 3,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
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
    it('should return -1 if urgencyA or urgencyB is undefined', () => {
      const result = service.sortByUrgencyPriorityOrder(undefined, mockUrgencyA);
      expect(result).toEqual(-1);
    });
  });
});
