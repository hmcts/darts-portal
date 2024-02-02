import { DateTime } from 'luxon';

export interface AnnotationsData {
  annotation_id: number;
  hearing_id: number;
  hearing_date: string;
  annotation_ts: string;
  annotation_text: string;
  annotation_documents: AnnotationDocumentData[];
}

export interface AnnotationDocumentData {
  annotation_document_id: number;
  file_name: string;
  file_type: string;
  uploaded_by: string;
  uploaded_ts: string;
}

export type Annotations = {
  annotationId: number;
  hearingId: number;
  hearingDate: DateTime;
  annotationTs: DateTime;
  annotationText: string;
  annotationDocuments: AnnotationDocument[];
};

export type AnnotationDocument = {
  annotationDocumentId: number;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  uploadedTs: DateTime;
};
