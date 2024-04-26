import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { Urgency } from './transcription-urgency.interface';

export interface TranscriptRequestData {
  transcription_id: number;
  case_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  transcription_type: string;
  status: TranscriptStatus;
  transcription_urgency: Urgency;
  requested_ts: string;
}
