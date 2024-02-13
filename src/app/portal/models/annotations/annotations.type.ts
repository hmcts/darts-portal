import { DateTime } from 'luxon';
import { AnnotationDocument } from './annotations-document.type';

export type Annotations = {
  annotationId: number;
  hearingId: number;
  hearingDate: DateTime;
  annotationTs: DateTime;
  annotationText: string;
  annotationDocuments: AnnotationDocument[];
};
