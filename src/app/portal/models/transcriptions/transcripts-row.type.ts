import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { DateTime } from 'luxon';

export type TranscriptsRow = {
  id: number;
  hearingDate: DateTime;
  type: string;
  requestedOn: DateTime;
  requestedBy: string;
  status: TranscriptStatus;
};
