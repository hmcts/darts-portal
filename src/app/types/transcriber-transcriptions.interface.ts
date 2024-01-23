import { TranscriptStatus } from './transcript.interface';

export interface TranscriberTranscriptions {
  transcription_id: number;
  case_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  transcription_type: string;
  status: TranscriptStatus;
  urgency: string;
  requested_ts: string;
  state_change_ts: string;
  is_manual: boolean;
}
