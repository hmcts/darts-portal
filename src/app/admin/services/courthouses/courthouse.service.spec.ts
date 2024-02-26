import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Courthouse } from '@core-types/index';
import { CourthouseService, GET_COURTHOUSES_PATH } from './courthouses.service';

describe('CourthouseService', () => {
  let service: CourthouseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CourthouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCourthouses', () => {
    const mockCourthouses: Courthouse[] = [];

    service.getCourthouses().subscribe((courthouses: Courthouse[]) => {
      expect(courthouses).toEqual(mockCourthouses);
    });

    const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouses);
  });
});
