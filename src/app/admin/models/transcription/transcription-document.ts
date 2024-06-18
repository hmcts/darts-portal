import { AdminAction } from '@admin-types/transformed-media/admin-action';
import { DateTime } from 'luxon';

export type TranscriptionDocument = {
  transcriptionDocumentId: number;
  transcriptionId: number;
  fileType: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: DateTime;
  uploadedBy: number;
  uploadedByName?: string;
  isHidden: boolean;
  retainUntil: DateTime;
  contentObjectId: string;
  checksum: string;
  clipId: string;
  lastModifiedAt: DateTime;
  lastModifiedBy: number;
  lastModifiedByName?: string;
  adminAction?: AdminAction;
};
