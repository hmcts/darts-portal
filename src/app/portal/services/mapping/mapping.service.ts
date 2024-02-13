import { Injectable } from '@angular/core';
import { Annotations } from '@portal-types/annotations/annotations.type';
import { AnnotationsData } from '@portal-types/annotations/annotations-data.interface';
import { AnnotationDocumentData } from '@portal-types/annotations/annotations-document-data.interface';
import { Transcript } from '@portal-types/transcriptions/transcript.type';
import { TranscriptsRow } from '@portal-types/transcriptions/transcripts-row.type';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  mapTranscriptRequestToRows(transcripts: Transcript[]): TranscriptsRow[] {
    return transcripts.map((transcript) => {
      return {
        id: transcript.id,
        hearingDate: transcript.hearingDate,
        type: transcript.type,
        requestedOn: transcript.requestedOn,
        requestedBy: transcript.requestedByName,
        status: transcript.status,
      };
    });
  }

  mapAnnotationsDataToAnnotations(annotationsData: AnnotationsData[]): Annotations[] {
    return annotationsData.map((a) => ({
      annotationId: a.annotation_id,
      hearingId: a.hearing_id,
      hearingDate: DateTime.fromISO(a.hearing_date),
      annotationTs: DateTime.fromISO(a.annotation_ts),
      annotationText: a.annotation_text,
      annotationDocuments: a.annotation_documents.map((ad: AnnotationDocumentData) => ({
        annotationDocumentId: ad.annotation_document_id,
        fileName: ad.file_name,
        fileType: ad.file_type,
        uploadedBy: ad.uploaded_by,
        uploadedTs: DateTime.fromISO(ad.uploaded_ts),
      })),
    }));
  }
}
