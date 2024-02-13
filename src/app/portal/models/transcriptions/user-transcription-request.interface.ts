import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';

export interface TranscriptRequestData {
  transcription_id: number;
  case_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  transcription_type: string;
  status: TranscriptStatus;
  urgency: string;
  requested_ts: string;
}
