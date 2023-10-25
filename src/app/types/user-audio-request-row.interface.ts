import { DatatableRow } from './data-table-row.interface';
import { AudioRequestStatus, AudioRequestType } from './user-audio-request.interface';

export interface UserAudioRequestRow extends DatatableRow {
  caseId: number;
  caseNumber: string;
  courthouse: string;
  hearingDate: string | null;
  startTime: string | null;
  endTime: string | null;
  requestId: number;
  expiry: string | null;
  status: AudioRequestStatus;
  requestType: AudioRequestType;
  lastAccessed?: string;
}
