import { TranscriptRequest } from '@portal-types/transcriptions/transcript-request.type';

export type YourTranscripts = {
  requesterTranscriptions: TranscriptRequest[];
  approverTranscriptions: TranscriptRequest[];
};
