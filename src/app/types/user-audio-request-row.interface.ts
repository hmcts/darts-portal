import { AudioRequestStatus, AudioRequestType } from './user-audio-request.interface';

export interface UserAudioRequestRow {
  caseId: number;
  caseNumber: string;
  courthouse: string;
  hearingId: number;
  hearingDate: string;
  startTime: string;
  endTime: string;
  requestId: number;
  expiry: string;
  status: AudioRequestStatus;
  requestType: AudioRequestType;
  lastAccessed: string | undefined;
  output_filename: string | undefined;
  output_format: string | undefined;
}
