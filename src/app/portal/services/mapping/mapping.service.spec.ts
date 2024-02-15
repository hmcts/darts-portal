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
      const transcripts: Transcript[] = [
        {
          id: 1,
          hearingId: 1,
          hearingDate: DateTime.fromISO('2024-02-01'),
          type: 'TYPE',
          requestedOn: DateTime.fromISO('2024-01-01'),
          requestedByName: 'Mrs Test',
          status: 'Complete',
        },
      ];
      const result = service.mapTranscriptRequestToRows(transcripts);
      expect(result).toStrictEqual([
        {
          hearingDate: DateTime.fromISO('2024-02-01'),
          id: 1,
          requestedBy: 'Mrs Test',
          requestedOn: DateTime.fromISO('2024-01-01'),
          status: 'Complete',
          type: 'TYPE',
        },
      ]);
    });
  });

  describe('#mapAnnotationsDataToAnnotations', () => {
    it('should map correctly', () => {
      const transcripts: AnnotationsData[] = [
        {
          annotation_id: 1,
          hearing_id: 2,
          hearing_date: '2024-02-01',
          annotation_ts: '2024-01-01',
          annotation_text: 'TEST',
          annotation_documents: [
            {
              annotation_document_id: 3,
              file_name: 'filename.docx',
              file_type: 'DOC',
              uploaded_by: 'Dr Test',
              uploaded_ts: '2024-03-01',
            },
          ],
        },
      ];
      const result = service.mapAnnotationsDataToAnnotations(transcripts);
      expect(result).toStrictEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2024-02-01'),
          annotationTs: DateTime.fromISO('2024-01-01'),
          annotationText: 'TEST',
          annotationDocumentId: 3,
          fileName: 'filename.docx',
          fileType: 'DOC',
          uploadedBy: 'Dr Test',
          uploadedTs: DateTime.fromISO('2024-03-01'),
        },
      ]);
    });
  });
});
