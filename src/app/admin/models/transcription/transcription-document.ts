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
  adminAction?: {
    id: number;
    reasonId: number;
    hiddenById: number;
    hiddenAt: DateTime;
    hiddenByName?: string;
    isMarkedForManualDeletion: boolean;
    markedForManualDeletionById: number;
    markedForManualDeletionBy?: string;
    markedForManualDeletionAt: DateTime;
    ticketReference: string;
    comments: string;
  };
};
