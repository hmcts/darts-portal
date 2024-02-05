import { DateTime } from 'luxon';

export type AnnotationDocument = {
  annotationDocumentId: number;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  uploadedTs: DateTime;
};
