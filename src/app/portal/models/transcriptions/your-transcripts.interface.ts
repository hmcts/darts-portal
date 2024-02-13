import { TranscriptRequestData } from '@portal-types/index';

export interface YourTranscriptsData {
  requester_transcriptions: TranscriptRequestData[];
  approver_transcriptions: TranscriptRequestData[];
}
