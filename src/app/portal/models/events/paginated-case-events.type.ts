import { CaseEvent } from './case-event';

export type PaginatedCaseEvents = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  data: CaseEvent[];
};
