import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { AnnotationsData } from '@portal-types/annotations/annotations-data.interface';
import { Transcript } from '@portal-types/transcriptions/transcript.type';
import { TranscriptionDetailsData } from '@portal-types/transcriptions/transcription-details.interface';
import { MappingService } from './mapping.service';

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
          courtroom: '1',
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
          courtroom: '1',
          hearingId: 1,
        },
      ]);
    });
  });

  describe('#mapBaseTranscriptionDetails', () => {
    it.each([
      [true, true],
      [false, false],
      [undefined, false],
    ])('should map is_archived %s to isArchived %s', (isArchived, expected) => {
      const transcription: TranscriptionDetailsData = {
        case_id: 1,
        case_number: 'C20220620001',
        courthouse: 'Swansea',
        courtroom: '5',
        courthouse_id: 1,
        status: 'Complete',
        defendants: ['Defendant Dave'],
        judges: ['HHJ M. Hussain KC'],
        transcript_file_name: 'C20220620001_0.docx',
        hearing_date: '2023-09-01',
        transcription_id: 9,
        transcription_object_id: 109,
        is_manual: true,
        hearing_id: 1,
        transcription_urgency: {
          transcription_urgency_id: 1,
          description: 'Standard',
          priority_order: 4,
        },
        request_type: 'Specified Times',
        transcription_start_ts: '2023-06-26T13:00:00Z',
        transcription_end_ts: '2023-06-26T16:00:00Z',
        is_archived: isArchived,
      };

      const result = service.mapBaseTranscriptionDetails(transcription);

      expect(result.isArchived).toBe(expected);
    });
  });

  describe('#mapAnnotationsDataToAnnotations', () => {
    it('should map correctly', () => {
      const annotations: AnnotationsData[] = [
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
      const result = service.mapAnnotationsDataToAnnotations(annotations);
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
