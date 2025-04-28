import { CaseEventData } from './case-event-data.interface';

export interface PaginatedCaseEventsData {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  data: CaseEventData[];
}
