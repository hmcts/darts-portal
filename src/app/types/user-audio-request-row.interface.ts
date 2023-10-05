import { DatatableRow } from './data-table-row.interface';

export interface UserAudioRequestRow extends DatatableRow {
  caseNumber: string;
  courthouse: string;
  hearingDate: string | null;
  startTime: string | null;
  endTime: string | null;
  requestId: number;
  expiry: string | null;
  status: 'OPEN' | 'PROCESSING' | 'FAILED' | 'COMPLETED';
  last_accessed_ts?: string;
}
