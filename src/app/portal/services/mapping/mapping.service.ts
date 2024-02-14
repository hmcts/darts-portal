import { Injectable } from '@angular/core';
import { Annotations } from '@portal-types/annotations/annotations.type';
import { AnnotationsData } from '@portal-types/annotations/annotations-data.interface';
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
    return annotationsData.flatMap((x) =>
      x.annotation_documents.map((a) => ({
        annotationId: x.annotation_id,
        hearingId: x.hearing_id,
        hearingDate: DateTime.fromISO(x.hearing_date),
        annotationTs: DateTime.fromISO(x.annotation_ts),
        annotationText: x.annotation_text,
        annotationDocumentId: a.annotation_document_id,
        fileName: a.file_name,
        fileType: a.file_type,
        uploadedBy: a.uploaded_by,
        uploadedTs: DateTime.fromISO(a.uploaded_ts),
      }))
    );
  }
}
