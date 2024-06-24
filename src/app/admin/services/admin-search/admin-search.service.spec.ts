import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminSearchFormValues } from '../../components/search/search-form/search-form.component';
import { ADMIN_CASE_SEARCH_PATH, AdminSearchService } from './admin-search.service';

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

const mockCaseSearchFormValues: AdminSearchFormValues = {
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
      service.getCases(mockCaseSearchFormValues).subscribe();
      httpMock.expectOne({ url: ADMIN_CASE_SEARCH_PATH, method: 'POST' });
    });

    it('map response', fakeAsync(() => {
      service.getCases(mockCaseSearchFormValues).subscribe((cases) => {
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
      service.getCases(mockCaseSearchFormValues).subscribe();

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
          ...mockCaseSearchFormValues,
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
});
