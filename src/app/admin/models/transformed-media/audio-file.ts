import { User } from '@admin-types/users/user.type';
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
    hiddenBy?: User;
    hiddenAt: DateTime;
    isMarkedForManualDeletion: boolean;
    markedForManualDeletionById: number;
    markedForManualDeletionBy?: User;
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
  createdBy?: User;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: User;
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
