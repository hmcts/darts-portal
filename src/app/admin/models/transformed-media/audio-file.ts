import { DateTime } from 'luxon';

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
  referenceId: string;
  checksum: string;
  mediaStatus: string;
  isHidden: boolean;
  isDeleted: boolean;
  adminAction: {
    id: number;
    reasonId: number;
    hiddenById: number;
    hiddenBy?: string;
    hiddenAt: DateTime;
    isMarkedForManualDeletion: boolean;
    markedForManualDeletionById: number;
    markedForManualDeletionBy?: string;
    markedForManualDeletionAt: DateTime;
    ticketReference: string;
    comments: string;
  };
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
