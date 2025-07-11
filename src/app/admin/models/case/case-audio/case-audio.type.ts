import { DateTime } from 'luxon';

export type PaginatedCaseAudio = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  data: CaseAudio[];
};

export type CaseAudio = {
  audioId: number;
  startTime: DateTime;
  endTime: DateTime;
  channel: number;
  courtroom: string;
};
