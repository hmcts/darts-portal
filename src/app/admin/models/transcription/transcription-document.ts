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
};
