import { DateTime } from 'luxon';
import { AdminAction } from '@admin-types/transformed-media/admin-action';
import { User } from '@admin-types/users/user.type';

type UserSubSet = Pick<User, 'id' | 'fullName' | 'isSystemUser'>;

export type TranscriptionDocument = {
  transcriptionDocumentId: number;
  transcriptionId: number;
  fileType: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: DateTime;
  uploadedBy: number;
  uploadedByObj?: UserSubSet;
  isHidden: boolean;
  retainUntil: DateTime;
  contentObjectId: string;
  checksum: string;
  clipId: string;
  lastModifiedAt: DateTime;
  lastModifiedBy: number;
  lastModifiedByObj?: UserSubSet;
  adminAction?: AdminAction;
};
