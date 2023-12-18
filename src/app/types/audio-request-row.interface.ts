import { AudioRequestStatus, AudioRequestType } from './requested-media.interface';

export interface AudioRequestRow {
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
}

export interface TransformedMediaRow extends AudioRequestRow {
  mediaId: number;
  filename: string;
  format: string;
  lastAccessed?: string;
}
