import { TranscriptStatus } from './transcripts-row.interface';

export interface UserTranscriptionRequest {
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

export interface YourTranscriptionRequests {
  requester_transcriptions: UserTranscriptionRequest[];
  approver_transcriptions: UserTranscriptionRequest[];
}
