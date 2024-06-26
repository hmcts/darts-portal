import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DateTime } from 'luxon';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';
import {
  ADMIN_CASE_SEARCH_PATH,
  ADMIN_EVENT_SEARCH_PATH,
  ADMIN_HEARING_SEARCH_PATH,
  AdminSearchService,
} from './admin-search.service';

const mockCaseSearchRespone = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });

    service = TestBed.inject(AdminSearchService);
    httpMock = TestBed.inject(HttpTestingController);
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
      req.flush(mockCaseSearchRespone);

      tick();
    }));

    it('map specific date request', () => {
      service.getCases(mockSearchFormValues).subscribe();

      const req = httpMock.expectOne(ADMIN_CASE_SEARCH_PATH);
      expect(req.request.body).toEqual({
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_end_at: '2021-01-01',
        hearing_start_at: '2021-01-01',
      });
    });

    it('map range date request', () => {
      service
        .getCases({
          ...mockSearchFormValues,
          hearingDate: {
            type: 'range',
            specific: '',
            from: '01/01/2021',
            to: '02/01/2021',
          },
        })
        .subscribe();

      const req = httpMock.expectOne(ADMIN_CASE_SEARCH_PATH);
      expect(req.request.body).toEqual({
        case_number: '654321',
        courthouse_ids: [2],
        courtroom_name: '2',
        hearing_start_at: '2021-01-01',
        hearing_end_at: '2021-01-02',
      });
    });
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
            createdAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
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
  });
});
