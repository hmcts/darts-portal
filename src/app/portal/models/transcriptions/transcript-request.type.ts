import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';
import { Urgency } from '@portal-types/transcriptions/transcription-urgency.interface';
import { DateTime } from 'luxon';

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
