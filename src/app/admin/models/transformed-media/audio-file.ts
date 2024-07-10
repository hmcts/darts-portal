import { DateTime } from 'luxon';
import { AdminAction } from './admin-action';

export type AudioFile = {
  id: number;
  startAt: DateTime;
  endAt: DateTime;
  channel: number;
  totalChannels: number;
  mediaType: string;
  mediaFormat: string;
  fileSizeBytes: number;
  filename: string;
  mediaObjectId: string;
  contentObjectId: string;
  clipId: string;
  checksum: string;
  mediaStatus: string;
  isHidden: boolean;
  isDeleted: boolean;
  adminAction?: AdminAction | null;
  version: string;
  chronicleId: string;
  antecedentId: string;
  retainUntil: DateTime;
  createdAt: DateTime;
  createdById: number;
  createdBy?: string;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: string;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  hearings: {
    id: number;
    hearingDate: DateTime;
    caseId: number;
  }[];
};
