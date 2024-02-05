import { TranscriptRequestData } from '@portal-types/transcriptions/user-transcription-request.interface';

export interface WorkRequestData extends TranscriptRequestData {
  state_change_ts: string;
  is_manual: boolean;
}
