import { TranscriptStatus } from './transcript.interface';
import { TranscriptionUrgency } from './transcription-urgency.interface';

export interface WorkRequest {
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

export type WorkRequestVm = Omit<WorkRequest, 'urgency'> & { urgency: TranscriptionUrgency };
