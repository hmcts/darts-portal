import { CaseAudio } from '@admin-types/case/case-audio/case-audio.type';
import { Injectable } from '@angular/core';
import { AdminCaseService } from '@services/admin-case/admin-case.service';
import { CaseAudioSortBy } from '../../components/case/case-file/case-audio/case-audio.component';

@Injectable({
  providedIn: 'root',
})
export class CaseAudioLoaderService {
  constructor(private caseService: AdminCaseService) {}

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
      sort: { sortBy: CaseAudioSortBy; sortOrder: 'asc' | 'desc' } | null;
      setEvents: (e: CaseAudio[] | null) => void;
      setTotalItems: (n: number) => void;
      setCurrentPage: (n: number) => void;
    }
  ) {
    this.caseService
      .getCaseAudio(caseId, {
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
