import { TestBed } from '@angular/core/testing';

import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaSearchFormValues } from '@admin-types/transformed-media/transformed-media-search-form.values';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { TransformedMediaService } from './transformed-media.service';

describe('TransformedMediaService', () => {
  let service: TransformedMediaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
        case_number: undefined,
        courthouse_display_name: undefined,
        hearing_date: null,
        media_request_id: undefined,
        owner: undefined,
        requested_at_from: '2021-01-01',
        requested_at_to: '2022-02-02',
        requested_by: undefined,
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
  });
});
