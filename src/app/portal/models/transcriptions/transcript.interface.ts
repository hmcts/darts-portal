import { TranscriptStatus } from '@portal-types/transcriptions/transcript-status.type';

// 'Data' postfixed to the end of the interface name is the data returned from the API
export interface TranscriptData {
  transcription_id: number;
  hearing_id: number;
  hearing_date: string;
  type: string;
  requested_on: string;
  requested_by_name: string;
  status: TranscriptStatus;
}
