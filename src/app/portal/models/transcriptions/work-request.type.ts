import { TranscriptRequest } from '@portal-types/transcriptions/transcript-request.type';
import { DateTime } from 'luxon';

export type WorkRequest = TranscriptRequest & {
  stateChangeTs: DateTime;
  isManual: boolean;
};
