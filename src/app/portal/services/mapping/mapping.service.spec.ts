import { DateTime } from 'luxon';
import { TestBed } from '@angular/core/testing';

import { MappingService } from './mapping.service';
import { Transcript } from '@portal-types/transcriptions/transcript.type';
import { AnnotationsData } from '@portal-types/annotations/annotations-data.interface';

describe('MappingService', () => {
  let service: MappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#mapTranscriptRequestToRows', () => {
    it('should map correctly', () => {
      const hearingDateDateTime = DateTime.fromISO('2024-02-01');
      const requestedOnDateTime = DateTime.fromISO('2024-01-01');
      const transcripts: Transcript[] = [
        {
          id: 1,
          hearingId: 1,
          hearingDate: hearingDateDateTime,
          type: 'TYPE',
          requestedOn: requestedOnDateTime,
          requestedByName: 'Mrs Test',
          status: 'Complete',
        },
      ];
      const result = service.mapTranscriptRequestToRows(transcripts);
      expect(result).toStrictEqual([
        {
          hearingDate: hearingDateDateTime,
          id: 1,
          requestedBy: 'Mrs Test',
          requestedOn: requestedOnDateTime,
          status: 'Complete',
          type: 'TYPE',
        },
      ]);
    });
  });

  describe('#mapAnnotationsDataToAnnotations', () => {
    it('should map correctly', () => {
      const hearingDateIso = '2024-02-01';
      const annotationTimeStampIso = '2024-01-01';
      const uploadedTimeStampIso = '2024-03-01';
      const transcripts: AnnotationsData[] = [
        {
          annotation_id: 1,
          hearing_id: 2,
          hearing_date: hearingDateIso,
          annotation_ts: annotationTimeStampIso,
          annotation_text: 'TEST',
          annotation_documents: [
            {
              annotation_document_id: 3,
              file_name: 'filename.docx',
              file_type: 'DOC',
              uploaded_by: 'Dr Test',
              uploaded_ts: uploadedTimeStampIso,
            },
          ],
        },
      ];
      const result = service.mapAnnotationsDataToAnnotations(transcripts);
      expect(result).toStrictEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO(hearingDateIso),
          annotationTs: DateTime.fromISO(annotationTimeStampIso),
          annotationText: 'TEST',
          annotationDocuments: [
            {
              annotationDocumentId: 3,
              fileName: 'filename.docx',
              fileType: 'DOC',
              uploadedBy: 'Dr Test',
              uploadedTs: DateTime.fromISO(uploadedTimeStampIso),
            },
          ],
        },
      ]);
    });
  });
});
