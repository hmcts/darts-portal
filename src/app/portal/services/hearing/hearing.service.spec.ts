import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Annotations } from '@portal-types/annotations/annotations.type';
import { AnnotationsData, HearingAudio, HearingEvent, PostAudioRequest } from '@portal-types/index';
import { DateTime } from 'luxon';
import { HearingService } from './hearing.service';

export const GET_HEARINGS_PATH = 'api/hearings';

describe('HearingService', () => {
  let service: HearingService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HearingService],
    });
    service = TestBed.inject(HearingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getEvents', () => {
    it('should get events', () => {
      const hearingId = '123';
      const mockEvents: HearingEvent[] = [];
      let events!: HearingEvent[];

      service.getEvents(hearingId).subscribe((eventsResponse) => (events = eventsResponse));

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);

      expect(events).toEqual(mockEvents);
    });

    it('handle 404 and return empty array', () => {
      const hearingId = '123';
      let events!: HearingEvent[];

      service.getEvents(hearingId).subscribe((eventsResponse) => (events = eventsResponse));

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(events).toEqual([]);
    });

    it('should re-throw error if not 404', () => {
      const hearingId = '123';
      let error!: HttpErrorResponse;

      service.getEvents(hearingId).subscribe({ error: (err: HttpErrorResponse) => (error = err) });

      const req = httpTestingController.expectOne(`api/hearings/${hearingId}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(error.status).toEqual(500);
      expect(error.statusText).toEqual('Server Error');
    });
  });

  describe('#getAudio', () => {
    it('should get audio', () => {
      const hearingId = '123';
      const mockAudio: HearingAudio[] = [];
      let audio!: HearingAudio[];

      service.getAudio(hearingId).subscribe((audioResponse) => (audio = audioResponse));

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAudio);

      expect(audio).toEqual(mockAudio);
    });

    it('handle 404 and return empty array', () => {
      const hearingId = '123';
      let audio!: HearingAudio[];

      service.getAudio(hearingId).subscribe((audioResponse) => (audio = audioResponse));

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(audio).toEqual([]);
    });

    it('should re-throw error if not 404', () => {
      const hearingId = '123';
      let error!: HttpErrorResponse;

      service.getAudio(hearingId).subscribe({ error: (err: HttpErrorResponse) => (error = err) });

      const req = httpTestingController.expectOne(`api/audio/hearings/${hearingId}/audios`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(error.status).toEqual(500);
      expect(error.statusText).toEqual('Server Error');
    });
  });

  describe('#requestAudio', () => {
    it('should request audio for download', () => {
      let response;
      const audioRequest: PostAudioRequest = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'DOWNLOAD',
      };
      const mockResponse = {
        request_id: 141,
        case_id: 'DMP461_Case12',
        courthouse_name: 'LIVERPOOL_DMP461',
        hearing_date: '2023-08-11',
        start_time: '2023-08-11T15:30:17Z',
        end_time: '2023-08-11T15:30:17Z',
      };

      service.requestAudio(audioRequest).subscribe((res) => (response = res));

      const req = httpTestingController.expectOne((request) => {
        return request.body === audioRequest && request.url === 'api/audio-requests/download';
      });
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(response).toEqual(mockResponse);
    });
    it('should request audio for playback', () => {
      let response;
      const audioRequest: PostAudioRequest = {
        hearing_id: 1,
        requestor: 1,
        start_time: '2023-09-01T02:00:00Z',
        end_time: '2023-09-01T15:32:24Z',
        request_type: 'PLAYBACK',
      };
      const mockResponse = {
        request_id: 141,
        case_id: 'DMP461_Case12',
        courthouse_name: 'LIVERPOOL_DMP461',
        hearing_date: '2023-08-11',
        start_time: '2023-08-11T15:30:17Z',
        end_time: '2023-08-11T15:30:17Z',
      };

      service.requestAudio(audioRequest).subscribe((res) => (response = res));

      const req = httpTestingController.expectOne((request) => {
        return request.body === audioRequest && request.url === 'api/audio-requests/playback';
      });
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(response).toEqual(mockResponse);
    });
  });

  describe('#getAnnotations', () => {
    it('should map an annotation for a single annotation document', () => {
      const multipleMockAnnotations: AnnotationsData[] = [
        {
          annotation_id: 1,
          hearing_id: 2,
          hearing_date: '2023-12-14',
          annotation_ts: '2023-12-15T12:00:00.000Z',
          annotation_text: 'A summary notes of this annotation...',
          annotation_documents: [
            {
              annotation_document_id: 1,
              file_name: 'Annotation.doc',
              file_type: 'DOC',
              uploaded_by: 'Mr User McUserFace',
              uploaded_ts: '2023-12-15T12:00:00.000Z',
            },
          ],
        },
      ];
      const mockHearingId = 2;
      const mockAnnotations: AnnotationsData[] = multipleMockAnnotations;

      let annotationsResponse!: Annotations[];

      service.getAnnotations(mockHearingId).subscribe((annotations) => {
        annotationsResponse = annotations;
      });

      const req = httpTestingController.expectOne(`${GET_HEARINGS_PATH}/${mockHearingId}/annotations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAnnotations);

      expect(annotationsResponse).toEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 1,
          fileName: 'Annotation.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr User McUserFace',
          uploadedTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
        },
      ]);
    });

    it('should map an annotation for multiple annotation documents', () => {
      const multipleMockAnnotationsDocuments: AnnotationsData[] = [
        {
          annotation_id: 1,
          hearing_id: 2,
          hearing_date: '2023-12-14',
          annotation_ts: '2023-12-15T12:00:00.000Z',
          annotation_text: 'A summary notes of this annotation...',
          annotation_documents: [
            {
              annotation_document_id: 1,
              file_name: 'Annotation.doc',
              file_type: 'DOC',
              uploaded_by: 'Mr User McUserFace',
              uploaded_ts: '2023-12-15T12:00:00.000Z',
            },
            {
              annotation_document_id: 2,
              file_name: 'AnnotationBeta.doc',
              file_type: 'DOC',
              uploaded_by: 'Mr Bob Sponge',
              uploaded_ts: '2023-12-15T14:00:00.000Z',
            },
          ],
        },
      ];
      const mockHearingId = 2;
      const mockAnnotations: AnnotationsData[] = multipleMockAnnotationsDocuments;

      let annotationsResponse!: Annotations[];

      service.getAnnotations(mockHearingId).subscribe((annotations) => {
        annotationsResponse = annotations;
      });

      const req = httpTestingController.expectOne(`${GET_HEARINGS_PATH}/${mockHearingId}/annotations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAnnotations);

      expect(annotationsResponse).toEqual([
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 1,
          fileName: 'Annotation.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr User McUserFace',
          uploadedTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
        },
        {
          annotationId: 1,
          hearingId: 2,
          hearingDate: DateTime.fromISO('2023-12-14'),
          annotationTs: DateTime.fromISO('2023-12-15T12:00:00.000Z'),
          annotationText: 'A summary notes of this annotation...',
          annotationDocumentId: 2,
          fileName: 'AnnotationBeta.doc',
          fileType: 'DOC',
          uploadedBy: 'Mr Bob Sponge',
          uploadedTs: DateTime.fromISO('2023-12-15T14:00:00.000Z'),
        },
      ]);
    });
  });
});
