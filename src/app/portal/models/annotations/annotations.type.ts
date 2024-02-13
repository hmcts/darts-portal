import { DateTime } from 'luxon';
import { AnnotationDocument } from './annotations-document.type';

export type Annotations = {
  annotationId: number;
  hearingId: number;
  hearingDate: DateTime;
  annotationTs: DateTime;
  annotationText: string;
} & AnnotationDocument;

// Example object
// {
//     "annotationId": 1,
//     "hearingId": 2,
//     "hearingDate": "2023-12-14T00:00:00.000Z",
//     "annotationTs": "2023-12-15T12:00:00.000Z",
//     "annotationText": "A summary notes of this annotation...",
//     "annotationDocumentId": 1,
//     "fileName": "Annotation.doc",
//     "fileType": "DOC",
//     "uploadedBy": "Mr User McUserFace",
//     "uploadedTs": "2023-12-15T12:00:00.000Z"
// }
