import { DateTime } from 'luxon';
import { TranscriptRequest, TranscriptRequestData } from './user-transcription-request.interface';

export interface WorkRequestData extends TranscriptRequestData {
  state_change_ts: string;
  is_manual: boolean;
}

export type WorkRequest = TranscriptRequest & {
  stateChangeTs: DateTime;
  isManual: boolean;
};
