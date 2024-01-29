import { DateTime } from 'luxon';
import { TranscriptStatus } from './transcript.interface';
import { Urgency } from './transcription-urgency.interface';

// DTOs
export interface YourTranscriptsData {
  requester_transcriptions: TranscriptRequestData[];
  approver_transcriptions: TranscriptRequestData[];
}
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

// View Models
export type YourTranscripts = {
  requesterTranscriptions: TranscriptRequest[];
  approverTranscriptions: TranscriptRequest[];
};

export type TranscriptRequest = {
  transcriptionId: number;
  caseId: number;
  caseNumber: string;
  courthouseName: string;
  hearingDate: DateTime;
  transcriptionType: string;
  status: TranscriptStatus;
  urgency: Urgency;
  requestedTs: DateTime;
};

export type WithTranscriptionUrgency<T> = T & { urgency: Urgency };
