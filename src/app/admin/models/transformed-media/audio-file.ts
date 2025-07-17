import { DateTime } from 'luxon';
import { AdminAction } from './admin-action';
import { User } from '@admin-types/users/user.type';

type UserSubSet = Pick<User, 'id' | 'fullName' | 'isSystemUser'>;

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
  isCurrent?: boolean;
  adminAction?: AdminAction | null;
  version: string;
  chronicleId: string;
  antecedentId: string;
  retainUntil: DateTime;
  createdAt: DateTime;
  createdById: number;
  createdBy?: UserSubSet;
  lastModifiedAt: DateTime;
  lastModifiedById: number;
  lastModifiedBy?: UserSubSet;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  cases: {
    id: number;
    courthouse: {
      id: number;
      displayName: string;
    };
    caseNumber: string;
    source: string;
  }[];
  hearings: {
    id: number;
    hearingDate: DateTime;
    caseId: number;
    caseNumber: string;
    courthouse: {
      id: number;
      displayName: string;
    };
    courtroom: {
      id: number;
      name: string;
    };
  }[];
};
