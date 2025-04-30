import { TestBed } from '@angular/core/testing';
import { AdminCaseEventSortBy } from '@components/case/case-file/case-events-table/case-events-table.component';
import { CaseEvent } from '@portal-types/events';
import { CaseService } from '@services/case/case.service';
import { of } from 'rxjs';
import { CaseEventsLoaderService } from './case-events-loader.service';

describe('CaseEventsLoaderService', () => {
  let service: CaseEventsLoaderService;
  let mockCaseService: jest.Mocked<CaseService>;

  const mockEvents = {
    currentPage: 2,
    pageSize: 10,
    totalPages: 5,
    totalItems: 100,
    data: [
      { id: 1, eventName: 'Event A' },
      { id: 2, eventName: 'Event B' },
    ] as unknown as CaseEvent[],
  };

  beforeEach(() => {
    mockCaseService = {
      getCaseEventsPaginated: jest.fn().mockReturnValue(of(mockEvents)),
    } as unknown as jest.Mocked<CaseService>;

    TestBed.configureTestingModule({
      providers: [{ provide: CaseService, useValue: mockCaseService }, CaseEventsLoaderService],
    });

    service = TestBed.inject(CaseEventsLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load and emit events data correctly', () => {
    const setEvents = jest.fn();
    const setTotalItems = jest.fn();
    const setCurrentPage = jest.fn();

    service.load(1, {
      page: 2,
      pageSize: 10,
      sort: { sortBy: 'eventId' as AdminCaseEventSortBy, sortOrder: 'asc' },
      setEvents,
      setTotalItems,
      setCurrentPage,
    });

    expect(mockCaseService.getCaseEventsPaginated).toHaveBeenCalledWith(1, {
      page_number: 2,
      page_size: 10,
      sort_by: 'eventId',
      sort_order: 'asc',
    });

    expect(setEvents).toHaveBeenCalledWith(mockEvents.data);
    expect(setTotalItems).toHaveBeenCalledWith(100);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });
});
