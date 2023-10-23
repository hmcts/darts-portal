import { DatatableRow } from './data-table-row.interface';

export interface TranscriptsRow extends DatatableRow {
  hearingDate: string;
  type: string;
  requestedOn: string;
  requestedBy: string;
  status: string;
}
