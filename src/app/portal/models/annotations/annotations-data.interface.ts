import { AnnotationDocumentData } from './annotations-document-data.interface';

export interface AnnotationsData {
  annotation_id: number;
  hearing_id: number;
  hearing_date: string;
  annotation_ts: string;
  annotation_text: string;
  annotation_documents: AnnotationDocumentData[];
}
