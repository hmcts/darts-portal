import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { AdminCaseSearchResult } from '@admin-types/search/admin-case-search-result';
import { AdminEventSearchResult } from '@admin-types/search/admin-event-search-result';
import { AdminHearingSearchResult } from '@admin-types/search/admin-hearing-search-result';
import { AdminMediaSearchResult } from '@admin-types/search/admin-media-search-result';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppInsightsService } from '@services/app-insights/app-insights.service';
import { UserService } from '@services/user/user.service';
import { DateTime } from 'luxon';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';
import {
  ADMIN_CASE_SEARCH_PATH,
  ADMIN_EVENT_SEARCH_PATH,
  ADMIN_HEARING_SEARCH_PATH,
  ADMIN_MEDIA_SEARCH_PATH,
  AdminSearchService,
} from './admin-search.service';

const mockCaseSearchResponse = [
  {
    id: 2,
    case_number: '654321',
    courthouse: {
      id: 2,
      display_name: 'Courthouse 2',
    },
    courtrooms: [
      {
        id: 2,
        name: 'Courtroom 2',
      },
    ],
    judges: ['Judge 3'],
    defendants: ['Defendant 3'],
  },
];

const mockSearchFormValues: AdminSearchFormValues = {
  caseId: '654321',
  courtroom: '2',
  courthouses: [{ id: 2, displayName: 'Courthouse 2' } as Courthouse],
  hearingDate: {
    type: 'specific',
    specific: '01/01/2021',
    from: '',
    to: '',
  },
  resultsFor: 'Cases',
};

describe('AdminSearchService', () => {
  let service: AdminSearchService;
  let httpMock: HttpTestingController;
  let appInsightsService: AppInsightsService;

  beforeEach(() => {
    const fakeAppInsightsService = {
      logEvent: jest.fn().mockImplementation(),
    };
    const fakeUserService = {
      userState: jest.fn().mockReturnValue({ userId: 1 }),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppInsightsService, useValue: fakeAppInsightsService },
        { provide: UserService, useValue: fakeUserService },
      ],
    });

    service = TestBed.inject(AdminSearchService);
    httpMock = TestBed.inject(HttpTestingController);
    appInsightsService = TestBed.inject(AppInsightsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCases', () => {
    it('should call the correct endpoint', () => {
      service.getCases(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_CASE_SEARCH_PATH, method: 'POST' });
    });

    it('map response', fakeAsync(() => {
      service.getCases(mockSearchFormValues).subscribe((cases) => {
        expect(cases).toEqual([
          {
            id: 2,
            number: '654321',
            courthouse: 'Courthouse 2',
            courtrooms: ['Courtroom 2'],
            judges: ['Judge 3'],
            defendants: ['Defendant 3'],
          },
        ]);
      });

      const req = httpMock.expectOne(ADMIN_CASE_SEARCH_PATH);
      req.flush(mockCaseSearchResponse);

      tick();
    }));

    it('logs event', () => {
      service.getCases(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_CASE_SEARCH_PATH, method: 'POST' });
      expect(appInsightsService.logEvent).toHaveBeenCalledWith('ADMIN_PORTAL::CASE_SEARCH', {
        userId: 1,
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_end_at: '2021-01-01',
        hearing_start_at: '2021-01-01',
      });
    });

    it('should handle HTTP error in getCases and return an empty array', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 500,
        error: { type: 'COMMON_105' },
      });

      service.getCases(mockSearchFormValues).subscribe((res) => {
        expect(res).toEqual([]);
        expect(service.searchError()).toBe('COMMON_105');
      });

      const req = httpMock.expectOne(ADMIN_CASE_SEARCH_PATH);
      req.flush({ type: 'COMMON_105' }, { status: 500, statusText: 'Server Error' });

      tick();
    }));
  });

  describe('getEvents', () => {
    it('should call the correct endpoint', () => {
      service.getEvents(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_EVENT_SEARCH_PATH, method: 'POST' });
    });

    it('map response', fakeAsync(() => {
      service.getEvents(mockSearchFormValues).subscribe((events) => {
        expect(events).toEqual([
          {
            id: 2,
            eventTs: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
            name: 'Event 2',
            text: 'Event 2 text',
            chronicleId: 2,
            antecedentId: 2,
            courthouse: 'Courthouse 2',
            courtroom: 'Courtroom 2',
          },
        ]);
      });

      const req = httpMock.expectOne(ADMIN_EVENT_SEARCH_PATH);
      req.flush([
        {
          id: 2,
          event_ts: '2021-01-01T00:00:00.000Z',
          created_at: '2021-01-01T00:00:00.000Z',
          name: 'Event 2',
          text: 'Event 2 text',
          chronicle_id: 2,
          antecedent_id: 2,
          courthouse: {
            id: 2,
            display_name: 'Courthouse 2',
          },
          courtroom: {
            id: 2,
            name: 'Courtroom 2',
          },
        },
      ]);

      tick();
    }));

    it('logs event', () => {
      service.getEvents(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_EVENT_SEARCH_PATH, method: 'POST' });
      expect(appInsightsService.logEvent).toHaveBeenCalledWith('ADMIN_PORTAL::EVENT_SEARCH', {
        userId: 1,
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_end_at: '2021-01-01',
        hearing_start_at: '2021-01-01',
      });
    });

    it('should handle HTTP error in getEvents and return an empty array', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 500,
        error: { type: 'COMMON_105' },
      });

      service.getEvents(mockSearchFormValues).subscribe((res) => {
        expect(res).toEqual([]);
        expect(service.searchError()).toBe('COMMON_105');
      });

      const req = httpMock.expectOne(ADMIN_EVENT_SEARCH_PATH);
      req.flush({ type: 'COMMON_105' }, { status: 500, statusText: 'Server Error' });

      tick();
    }));
  });

  describe('getHearings', () => {
    it('should call the correct endpoint', () => {
      service.getHearings(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_HEARING_SEARCH_PATH, method: 'POST' });
    });

    it('map response', fakeAsync(() => {
      service.getHearings(mockSearchFormValues).subscribe((hearings) => {
        expect(hearings).toEqual([
          {
            caseId: 2,
            caseNumber: '654321',
            hearingId: 2,
            hearingDate: DateTime.fromFormat('2021-01-01', 'yyyy-MM-dd'),
            courthouse: 'Courthouse 2',
            courtroom: 'Courtroom 2',
          },
        ]);
      });

      const req = httpMock.expectOne(ADMIN_HEARING_SEARCH_PATH);
      req.flush([
        {
          id: 2,
          case: {
            id: 2,
            case_number: '654321',
          },
          hearing_date: '2021-01-01',
          courthouse: {
            id: 2,
            display_name: 'Courthouse 2',
          },
          courtroom: {
            id: 2,
            name: 'Courtroom 2',
          },
        },
      ]);

      tick();
    }));

    it('logs event', () => {
      service.getHearings(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_HEARING_SEARCH_PATH, method: 'POST' });
      expect(appInsightsService.logEvent).toHaveBeenCalledWith('ADMIN_PORTAL::HEARING_SEARCH', {
        userId: 1,
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_end_at: '2021-01-01',
        hearing_start_at: '2021-01-01',
      });
    });

    it('should handle HTTP error in getHearings and return an empty array', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 500,
        error: { type: 'COMMON_105' },
      });

      service.getHearings(mockSearchFormValues).subscribe((res) => {
        expect(res).toEqual([]);
        expect(service.searchError()).toBe('COMMON_105');
      });

      const req = httpMock.expectOne(ADMIN_HEARING_SEARCH_PATH);
      req.flush({ type: 'COMMON_105' }, { status: 500, statusText: 'Server Error' });

      tick();
    }));
  });

  describe('getAudioMedia', () => {
    it('should call the correct endpoint', () => {
      service.getAudioMedia(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_MEDIA_SEARCH_PATH, method: 'POST' });
    });

    it('map response', fakeAsync(() => {
      service.getAudioMedia(mockSearchFormValues).subscribe((media) => {
        expect(media).toEqual([
          {
            id: 2,
            courthouse: 'Courthouse 2',
            courtroom: 'Courtroom 2',
            startAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
            endAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
            channel: 'Channel 2',
            isHidden: false,
            hearingDate: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
          },
        ]);
      });

      const req = httpMock.expectOne(ADMIN_MEDIA_SEARCH_PATH);
      req.flush([
        {
          id: 2,
          courthouse: {
            id: 2,
            display_name: 'Courthouse 2',
          },
          courtroom: {
            id: 2,
            name: 'Courtroom 2',
          },
          start_at: '2021-01-01T00:00:00.000Z',
          end_at: '2021-01-01T00:00:00.000Z',
          channel: 'Channel 2',
          is_hidden: false,
          hearingDate: '2021-01-01T00:00:00.000Z',
        },
      ]);

      tick();
    }));

    it('logs event', () => {
      service.getAudioMedia(mockSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_MEDIA_SEARCH_PATH, method: 'POST' });
      expect(appInsightsService.logEvent).toHaveBeenCalledWith('ADMIN_PORTAL::AUDIO_SEARCH', {
        userId: 1,
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_end_at: '2021-01-01',
        hearing_start_at: '2021-01-01',
      });
    });

    it('should handle HTTP error in getAudioMedia and return an empty array', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 500,
        error: { type: 'COMMON_105' },
      });

      service.getAudioMedia(mockSearchFormValues).subscribe((res) => {
        expect(res).toEqual([]);
        expect(service.searchError()).toBe('COMMON_105');
      });

      const req = httpMock.expectOne(ADMIN_MEDIA_SEARCH_PATH);
      req.flush({ type: 'COMMON_105' }, { status: 500, statusText: 'Server Error' });

      tick();
    }));
  });

  describe('mapAdminSearchFormValuesToSearchRequest', () => {
    it('should map the form values to request object ', () => {
      const result = service['mapAdminSearchFormValuesToSearchRequest'](mockSearchFormValues);

      expect(result).toEqual({
        case_number: '654321',
        courtroom_name: '2',
        courthouse_ids: [2],
        hearing_start_at: '2021-01-01',
        hearing_end_at: '2021-01-01',
      });
    });

    it('should map the form values to request object with empty values', () => {
      const result = service['mapAdminSearchFormValuesToSearchRequest']({
        caseId: '',
        courtroom: '',
        courthouses: [],
        hearingDate: {
          type: '',
          specific: '',
          from: '',
          to: '',
        },
        resultsFor: 'Cases',
      });

      expect(result).toEqual({
        case_number: null,
        courtroom_name: null,
        courthouse_ids: [],
        hearing_start_at: null,
        hearing_end_at: null,
      });
    });
  });

  describe('clearSearch', () => {
    it('should clear the search results', () => {
      service.cases.set([{} as AdminCaseSearchResult]);
      service.events.set([{} as AdminEventSearchResult]);
      service.hearings.set([{} as AdminHearingSearchResult]);
      service.audio.set([{} as AdminMediaSearchResult]);
      service.searchError.set('error');
      service.isLoading.set(true);
      service.formValues.set(mockSearchFormValues);

      service.clearSearch();

      expect(service.cases()).toEqual([]);
      expect(service.events()).toEqual([]);
      expect(service.hearings()).toEqual([]);
      expect(service.audio()).toEqual([]);
      expect(service.searchError()).toBeNull();
      expect(service.isLoading()).toBe(false);
      expect(service.formValues()).toEqual({
        caseId: '',
        courtroom: '',
        courthouses: [],
        hearingDate: {
          type: '',
          specific: '',
          from: '',
          to: '',
        },
        resultsFor: 'Cases',
      });
    });
  });

  describe('handleSearchError', () => {
    it('should set searchError with the error type if provided', fakeAsync(() => {
      const mockResponse = {
        error: { type: 'COMMON_105' },
      } as HttpErrorResponse;

      service['handleSearchError'](mockResponse).subscribe((result) => {
        expect(result).toEqual([]);
        expect(service.searchError()).toBe('COMMON_105');
      });

      tick();
    }));

    it('should set default error message if type is missing', fakeAsync(() => {
      const mockResponse = {
        error: {},
      } as HttpErrorResponse;

      service['handleSearchError'](mockResponse).subscribe((result) => {
        expect(result).toEqual([]);
        expect(service.searchError()).toBe('Error occurred while searching');
      });

      tick();
    }));

    it('should not set searchError if response is null', fakeAsync(() => {
      // Clear any existing error first
      service.searchError.set(null);

      service['handleSearchError'](null).subscribe((result) => {
        expect(result).toEqual([]);
        expect(service.searchError()).toBeNull();
      });

      tick();
    }));
  });
});
