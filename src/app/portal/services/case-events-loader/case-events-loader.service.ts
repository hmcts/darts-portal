import { Injectable, inject } from '@angular/core';
import { AdminCaseEventSortBy } from '@components/case/case-file/case-events-table/case-events-table.component';
import { CaseEvent } from '@portal-types/events';
import { CaseService } from '@services/case/case.service';

@Injectable({ providedIn: 'root' })
export class CaseEventsLoaderService {
  private caseService = inject(CaseService);

  load(
    caseId: number,
    {
      page,
      pageSize,
      sort,
      setEvents,
      setTotalItems,
      setCurrentPage,
    }: {
      page: number;
      pageSize: number;
      sort: { sortBy: AdminCaseEventSortBy; sortOrder: 'asc' | 'desc' } | null;
      setEvents: (e: CaseEvent[] | null) => void;
      setTotalItems: (n: number) => void;
      setCurrentPage: (n: number) => void;
    }
  ) {
    this.caseService
      .getCaseEventsPaginated(caseId, {
        page_number: page,
        page_size: pageSize,
        sort_by: sort?.sortBy,
        sort_order: sort?.sortOrder,
      })
      .subscribe((events) => {
        setEvents(events.data);
        setTotalItems(events.totalItems);
        setCurrentPage(events.currentPage);
      });
  }
}
