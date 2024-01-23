import { DateTime } from 'luxon';
import { TranscriptStatus } from './transcript.interface';

export interface TranscriptsRow {
  id: number;
  hearingDate: DateTime;
  type: string;
  requestedOn: DateTime;
  requestedBy: string;
  status: TranscriptStatus;
}
