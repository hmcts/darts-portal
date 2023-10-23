import { TranscriptStatus } from './transcripts-row.interface';

export interface Transcript {
  tra_id: number;
  hea_id: number;
  hearing_date: string;
  type: string;
  requested_on: string;
  requested_by_name: string;
  status: TranscriptStatus;
}
