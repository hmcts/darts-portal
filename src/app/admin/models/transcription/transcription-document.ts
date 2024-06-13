import { DateTime } from 'luxon';

export type TranscriptionDocument = {
  transcriptionDocumentId: number;
  transcriptionId: number;
  fileType: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: DateTime;
  uploadedBy: number;
  isHidden: boolean;
  retainUntil: DateTime;
  contentObjectId: string;
  checksum: string;
  clipId: string;
  lastModifiedAt: DateTime;
  lastModifiedBy: number;
  adminAction: {
    id: number;
    reasonId: number;
    hiddenById: number;
    hiddenAt: DateTime;
    isMarkedForManualDeletion: boolean;
    markedForManualDeletionById: number;
    markedForManualDeletionAt: DateTime;
    ticketReference: string;
    comments: string;
  };
};
