import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { DateTime } from 'luxon';

export type Transcript = {
  id: number;
  hearingId: number;
  hearingDate: DateTime;
  type: string;
  requestedOn: DateTime;
  requestedByName: string;
  status: TranscriptStatus;
  courtroom: string;
};
