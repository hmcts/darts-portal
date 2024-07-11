import { TestBed } from '@angular/core/testing';
import { TransformedMediaRequestData } from './../../models/transformed-media/transformed-media-request-data.interface';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { FileHideOrDeleteFormValues } from '@admin-types/hidden-reasons/file-hide-or-delete-form-values';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaRequest } from '@admin-types/transformed-media/transformed-media-request';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TransformedMediaService, defaultFormValues } from './transformed-media.service';

describe('TransformedMediaService', () => {
  let service: TransformedMediaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransformedMediaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchTransformedMedia', () => {
    it('call search endpoint with mapped request body (specific date)', () => {
      const mockCriteria: TransformedMediaSearchFormValues = {
        requestId: '123',
        caseId: '456',
        courthouse: 'courthouse',
        hearingDate: '01/01/2021',
        owner: 'owner',
        requestedBy: 'requestedBy',
        requestedDate: {
          specific: '02/02/2022',
        },
      };

      const mockBody = {
        media_request_id: '123',
        case_number: '456',
        courthouse_display_name: 'courthouse',
        hearing_date: '2021-01-01',
        owner: 'owner',
        requested_by: 'requestedBy',
        requested_at_from: '2022-02-02',
        requested_at_to: '2022-02-02',
      };

      service.searchTransformedMedia(mockCriteria).subscribe();

      const req = httpMock.expectOne({ url: '/api/admin/transformed-medias/search', method: 'POST' });
      expect(req.request.body).toEqual(mockBody);
      req.flush([]);
    });

    it('call search endpoint with mapped request body (date range)', () => {
      const mockCriteria = {
        requestedDate: {
          from: '01/01/2021',
          to: '02/02/2022',
        },
      } as TransformedMediaSearchFormValues;

      const mockBody = {
        case_number: null,
        courthouse_display_name: null,
        hearing_date: null,
        media_request_id: null,
        owner: null,
        requested_at_from: '2021-01-01',
        requested_at_to: '2022-02-02',
        requested_by: null,
      };

      service.searchTransformedMedia(mockCriteria).subscribe();

      const req = httpMock.expectOne({ url: '/api/admin/transformed-medias/search', method: 'POST' });
      expect(req.request.body).toEqual(mockBody);

      req.flush([]);
    });

    it('maps response to TransformedMedia[]', () => {
      const mockCriteria = {} as TransformedMediaSearchFormValues;
      const mockResponse = [
        {
          id: 1,
          file_name: 'filename.mp3',
          file_format: 'MP3',
          file_size_bytes: 2097152,
          media_request: {
            id: 1,
            requested_at: '2024-01-01T00:00:00Z',
            owner_user_id: 1,
            requested_by_user_id: 1,
          },
          case: {
            id: 1,
            case_number: 'CASE123',
          },
          courthouse: {
            id: 1,
            display_name: 'Swansea',
          },
          hearing: {
            id: 1,
            hearing_date: '2024-01-01',
          },
          last_accessed_at: '2024-01-01T00:00:00Z',
        },
      ];

      const expectedMappedType: TransformedMediaAdmin[] = [
        {
          id: 1,
          fileName: 'filename.mp3',
          fileFormat: 'MP3',
          fileSizeBytes: 2097152,
          mediaRequest: {
            id: 1,
            requestedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
            ownerUserId: 1,
            requestedByUserId: 1,
          },
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2024-01-01'),
          },
          lastAccessedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        },
      ];

      let result: TransformedMediaAdmin[] = [];
      service.searchTransformedMedia(mockCriteria).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne({ url: '/api/admin/transformed-medias/search', method: 'POST' });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });

    it('sets formValues with search criteria', () => {
      const mockCriteria = {
        caseId: '123',
        courthouse: 'courthouse',
        hearingDate: '01/01/2021',
        owner: 'owner',
        requestedBy: 'requestedBy',
        requestedDate: {
          specific: '02/02/2022',
        },
      } as TransformedMediaSearchFormValues;

      service.searchTransformedMedia(mockCriteria).subscribe();

      httpMock.expectOne({ url: '/api/admin/transformed-medias/search', method: 'POST' });

      expect(service.searchFormValues()).toEqual(mockCriteria);
    });
  });

  describe('getTransformedMediaById', () => {
    it('should call get endpoint with id', () => {
      const mockId = 1;
      service.getTransformedMediaById(mockId).subscribe();

      const req = httpMock.expectOne({ url: `/api/admin/transformed-medias/${mockId}`, method: 'GET' });
      req.flush({});
    });

    it('should map response to TransformedMedia', () => {
      const mockId = 1;
      const mockResponse = {
        id: 1,
        file_name: 'filename.mp3',
        file_format: 'MP3',
        file_size_bytes: 2097152,
        case_id: 1,
        media_request_id: 1,
      };

      const expectedMappedType: TransformedMediaAdmin = {
        id: 1,
        fileName: 'filename.mp3',
        fileFormat: 'MP3',
        fileSizeBytes: 2097152,
        mediaRequest: {
          id: 1,
        },
        case: {
          id: 1,
        },
      };

      let result: TransformedMediaAdmin = {} as TransformedMediaAdmin;
      service.getTransformedMediaById(mockId).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne({ url: `/api/admin/transformed-medias/${mockId}`, method: 'GET' });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });
  });

  describe('getMediaRequestById', () => {
    it('should call get endpoint with id', () => {
      const mockId = 1;
      service.getMediaRequestById(mockId).subscribe();

      const req = httpMock.expectOne({ url: `/api/admin/media-requests/${mockId}`, method: 'GET' });
      req.flush({});
    });

    it('should map response to MediaRequest', () => {
      const mockId = 1;
      const mockResponse: TransformedMediaRequestData = {
        id: 3,
        start_at: '2024-01-01T15:00:00Z',
        end_at: '2024-01-01T16:00:00Z',
        requested_at: '2024-01-01T00:00:00Z',
        hearing: {
          id: 3,
          hearing_date: '2024-01-01',
        },
        courtroom: {
          id: 3,
          name: '',
        },
        requested_by_id: 3,
        owner_id: 3,
      };

      const expectedMappedType: TransformedMediaRequest = {
        id: 3,
        startAt: DateTime.fromISO('2024-01-01T15:00:00Z'),
        endAt: DateTime.fromISO('2024-01-01T16:00:00Z'),
        requestedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        hearing: {
          id: 3,
          hearingDate: DateTime.fromISO('2024-01-01'),
        },
        courtroom: {
          id: 3,
          name: '',
        },
        requestedById: 3,
        ownerId: 3,
      };

      let result = {} as TransformedMediaRequest;
      service.getMediaRequestById(mockId).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne({ url: `/api/admin/media-requests/${mockId}`, method: 'GET' });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });
  });

  describe('getAssociatedMediaByTransformedMediaId', () => {
    it('should call get endpoint with transformed_media_id', () => {
      const mockId = 1;
      service.getAssociatedMediaByTransformedMediaId(mockId).subscribe();

      const req = httpMock.expectOne({ url: '/api/admin/medias?transformed_media_id=1', method: 'GET' });
      req.flush([]);
    });

    it('should map response to AssociatedMedia[]', () => {
      const mockId = 9;
      const mockResponse = [
        {
          id: 1,
          channel: 'channel',
          start_at: '2024-01-01T00:00:00Z',
          end_at: '2024-01-01T00:00:00Z',
          case: {
            id: 1,
            case_number: 'CASE123',
          },
          hearing: {
            id: 1,
            hearing_date: '2024-01-01',
          },
          courthouse: {
            id: 1,
            display_name: 'Swansea',
          },
          courtroom: {
            id: 1,
            display_name: 'room',
          },
        },
      ];

      const expectedMappedType = [
        {
          id: 1,
          channel: 'channel',
          startAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2024-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },
      ];

      let result: AssociatedMedia[] = [];
      service.getAssociatedMediaByTransformedMediaId(mockId).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne({ url: '/api/admin/medias?transformed_media_id=9', method: 'GET' });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });
  });

  describe('changeMediaRequestOwner', () => {
    it('should call patch endpoint with mediaRequestId and newOwnerId', () => {
      const mockMediaRequestId = 1;
      const mockNewOwnerId = 2;

      service.changeMediaRequestOwner(mockMediaRequestId, mockNewOwnerId).subscribe();

      const req = httpMock.expectOne({ url: `/api/admin/media-requests/${mockMediaRequestId}`, method: 'PATCH' });
      expect(req.request.body).toEqual({ owner_id: mockNewOwnerId });
      req.flush({});
    });
  });

  describe('getAssociatedMediaByTranscriptionDocumentId', () => {
    it('should call get endpoint with transcription_document_id', () => {
      service.getAssociatedMediaByTranscriptionDocumentId(1).subscribe();

      const req = httpMock.expectOne({ url: '/api/admin/medias?transcription_document_id=1', method: 'GET' });
      req.flush([]);
    });

    it('should map response to AssociatedMedia[]', () => {
      const mockId = 9;
      const mockResponse = [
        {
          id: 1,
          channel: 'channel',
          start_at: '2024-01-01T00:00:00Z',
          end_at: '2024-01-01T00:00:00Z',
          case: {
            id: 1,
            case_number: 'CASE123',
          },
          hearing: {
            id: 1,
            hearing_date: '2024-01-01',
          },
          courthouse: {
            id: 1,
            display_name: 'Swansea',
          },
          courtroom: {
            id: 1,
            display_name: 'room',
          },
        },
      ];

      const expectedMappedType = [
        {
          id: 1,
          channel: 'channel',
          startAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2024-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },
      ];

      let result: AssociatedMedia[] = [];
      service.getAssociatedMediaByTranscriptionDocumentId(mockId).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne({ url: '/api/admin/medias?transcription_document_id=9', method: 'GET' });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });
  });

  describe('checkAssociatedAudioExists', () => {
    it('should return exists as true if there are associated media', () => {
      const mediaId = 1;
      const hearingIds = [1, 2, 3];
      const startAt = '2022-01-01';
      const endAt = '2022-01-02';

      const mockAssociatedMedia: AssociatedMedia[] = [
        {
          id: 1,
          channel: 1,
          startAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 2,
            hearingDate: DateTime.fromISO('2022-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },
        {
          id: 2,
          channel: 1,
          startAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2022-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },

        {
          id: 5,
          channel: 1,
          startAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 3,
            hearingDate: DateTime.fromISO('2022-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },
      ];

      jest.spyOn(service, 'getAssociatedMediaByHearingId').mockReturnValue(of(mockAssociatedMedia));

      let result = {} as { exists: boolean; media: AssociatedMedia[]; audioFile: AssociatedMedia[] };
      service.checkAssociatedAudioExists(mediaId, hearingIds, startAt, endAt).subscribe((res) => {
        result = res;
      });

      expect(result.exists).toBe(true);
      expect(result.media).toEqual(mockAssociatedMedia.filter((media) => mediaId !== media.id));
      expect(result.audioFile).toEqual(mockAssociatedMedia.filter((media) => mediaId === media.id));
    });

    it('should return exists as false if there are no associated media', () => {
      const mediaId = 1;
      const hearingIds = [1, 2, 3];
      const startAt = '2022-01-01';
      const endAt = '2022-01-02';

      const mockAssociatedMedia: AssociatedMedia[] = [];

      jest.spyOn(service, 'getAssociatedMediaByHearingId').mockReturnValue(of(mockAssociatedMedia));

      let result = {} as { exists: boolean; media: AssociatedMedia[]; audioFile: AssociatedMedia[] };
      service.checkAssociatedAudioExists(mediaId, hearingIds, startAt, endAt).subscribe((res) => {
        result = res;
      });

      expect(result.exists).toBe(false);
      expect(result.media).toEqual(mockAssociatedMedia);
    });
  });

  describe('getAssociatedMediaByHearingId', () => {
    it('should call get endpoint with hearing_ids, start_at, and end_at', () => {
      const mockIds = '1,2,3';
      const mockStartAt = '2022-01-01';
      const mockEndAt = '2022-01-02';

      service.getAssociatedMediaByHearingId(mockIds, mockStartAt, mockEndAt).subscribe();

      const req = httpMock.expectOne((req) => {
        return (
          req.url === '/api/admin/medias' &&
          req.method === 'GET' &&
          req.params.get('hearing_ids') === mockIds &&
          req.params.get('start_at') === mockStartAt &&
          req.params.get('end_at') === mockEndAt
        );
      });
      req.flush([]);
    });

    it('should map response to AssociatedMedia[]', () => {
      const mockIds = '1,2,3';
      const mockStartAt = '2022-01-01';
      const mockEndAt = '2022-01-02';
      const mockResponse = [
        {
          id: 1,
          channel: 'channel',
          start_at: '2024-01-01T00:00:00Z',
          end_at: '2024-01-01T00:00:00Z',
          case: {
            id: 1,
            case_number: 'CASE123',
          },
          hearing: {
            id: 1,
            hearing_date: '2024-01-01',
          },
          courthouse: {
            id: 1,
            display_name: 'Swansea',
          },
          courtroom: {
            id: 1,
            display_name: 'room',
          },
        },
      ];

      const expectedMappedType = [
        {
          id: 1,
          channel: 'channel',
          startAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          endAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
          case: {
            id: 1,
            caseNumber: 'CASE123',
          },
          hearing: {
            id: 1,
            hearingDate: DateTime.fromISO('2024-01-01'),
          },
          courthouse: {
            id: 1,
            displayName: 'Swansea',
          },
          courtroom: {
            id: 1,
            displayName: 'room',
          },
        },
      ];

      let result: AssociatedMedia[] = [];
      service.getAssociatedMediaByHearingId(mockIds, mockStartAt, mockEndAt).subscribe((media) => {
        result = media;
      });

      const req = httpMock.expectOne((req) => {
        return (
          req.url === '/api/admin/medias' &&
          req.method === 'GET' &&
          req.params.get('hearing_ids') === mockIds &&
          req.params.get('start_at') === mockStartAt &&
          req.params.get('end_at') === mockEndAt
        );
      });
      req.flush(mockResponse);

      expect(result).toEqual(expectedMappedType);
    });
  });

  describe('hideAudioFile', () => {
    it('should hide the audio file', () => {
      const mockId = 1;
      const mockFormValues: FileHideOrDeleteFormValues = {
        reason: 1,
        ticketReference: 'TICKET123',
        comments: 'This file needs to be hidden.',
      };

      const mockRequestBody = {
        is_hidden: true,
        admin_action: {
          reason_id: mockFormValues.reason,
          ticket_reference: mockFormValues.ticketReference,
          comments: mockFormValues.comments,
        },
      };

      const mockResponse: FileHideData = {
        id: mockId,
        is_hidden: true,
        is_deleted: false,
        admin_action: {
          id: 1,
          reason_id: mockFormValues.reason,
          hidden_by_id: 1,
          hidden_at: '2022-01-01T00:00:00Z',
          is_marked_for_manual_deletion: false,
          marked_for_manual_deletion_by_id: 0,
          marked_for_manual_deletion_at: '2022-01-01T00:00:00Z',
          ticket_reference: mockFormValues.ticketReference,
          comments: mockFormValues.comments,
        },
      };

      let result: FileHide = {} as FileHide;
      service.hideAudioFile(mockId, mockFormValues).subscribe((fileHide) => {
        result = fileHide;
      });

      const req = httpMock.expectOne({ url: `api/admin/medias/${mockId}/hide`, method: 'POST' });
      expect(req.request.body).toEqual(mockRequestBody);
      req.flush(mockResponse);

      expect(result).toEqual({
        id: mockId,
        isHidden: true,
        isDeleted: false,
        adminAction: {
          id: 1,
          reasonId: mockFormValues.reason,
          hiddenById: 1,
          hiddenAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          isMarkedForManualDeletion: false,
          markedForManualDeletionById: 0,
          markedForManualDeletionAt: DateTime.fromISO('2022-01-01T00:00:00Z'),
          ticketReference: mockFormValues.ticketReference,
          comments: mockFormValues.comments,
        },
      });
    });
  });

  describe('unhideAudioFile', () => {
    it('should unhide the audio file', () => {
      const mockId = 1;
      service.unhideAudioFile(mockId).subscribe();
      const req = httpMock.expectOne({ url: `api/admin/medias/${mockId}/hide`, method: 'POST' });
      req.flush({});
    });
  });

  describe('clearSearch', () => {
    it('should clear search results and reset search for state', () => {
      service.searchResults.set([{} as TransformedMediaAdmin]);
      service.isSearchFormSubmitted.set(true);
      service.isAdvancedSearch.set(true);
      service.searchFormValues.set({} as TransformedMediaSearchFormValues);

      service.clearSearch();

      expect(service.searchResults()).toEqual([]);
      expect(service.isSearchFormSubmitted()).toBe(false);
      expect(service.isAdvancedSearch()).toBe(false);
      expect(service.searchFormValues()).toEqual(defaultFormValues);
    });
  });
});
