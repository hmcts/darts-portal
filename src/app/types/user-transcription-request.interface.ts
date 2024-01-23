import { TranscriptStatus } from './transcript.interface';
import { TranscriptionUrgency } from './transcription-urgency.interface';

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

export type UserTranscriptionRequestVm = Omit<UserTranscriptionRequest, 'urgency'> & { urgency: TranscriptionUrgency };

export interface YourTranscriptionRequests {
  requester_transcriptions: UserTranscriptionRequest[];
  approver_transcriptions: UserTranscriptionRequest[];
}

export interface YourTranscriptionRequestsVm {
  requester_transcriptions: UserTranscriptionRequestVm[];
  approver_transcriptions: UserTranscriptionRequestVm[];
}
