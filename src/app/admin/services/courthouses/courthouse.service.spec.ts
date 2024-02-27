import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { RegionData } from '@admin-types/courthouses/region.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CourthouseService, GET_COURTHOUSES_PATH } from './courthouses.service';

describe('CourthouseService', () => {
  let service: CourthouseService;
  let httpMock: HttpTestingController;

  const courthouses = [
    {
      courthouseName: 'READING',
      displayName: 'Reading',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'South West',
    },
    {
      courthouseName: 'SLOUGH',
      displayName: 'Slough',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'South',
    },
    {
      courthouseName: 'KINGSTON',
      displayName: 'Kingston',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'London',
    },
  ] as unknown as Courthouse[];

  const regions = [
    {
      id: 0,
      name: 'South West',
    },
    {
      id: 1,
      name: 'South',
    },
    {
      id: 2,
      name: 'London',
    },
  ] as RegionData[];

  const courthouseData = [
    {
      courthouse_name: 'READING',
      display_name: 'Reading',
      code: 0,
      region_id: 0,
      created_date_time: '2023-08-18T09:48:29.728Z',
      last_modified_date_time: '2023-08-18T09:48:29.728Z',
    },
    {
      courthouse_name: 'SLOUGH',
      display_name: 'Slough',
      code: 0,
      region_id: 1,
      created_date_time: '2023-08-18T09:48:29.728Z',
      last_modified_date_time: '2023-08-18T09:48:29.728Z',
    },
    {
      courthouse_name: 'KINGSTON',
      display_name: 'Kingston',
      code: 0,
      region_id: 2,
      created_date_time: '2023-08-18T09:48:29.728Z',
      last_modified_date_time: '2023-08-18T09:48:29.728Z',
    },
  ] as CourthouseData[];

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
    const mockCourthouses: CourthouseData[] = [];

    service.getCourthouses().subscribe((courthouses: CourthouseData[]) => {
      expect(courthouses).toEqual(mockCourthouses);
    });

    const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouses);
  });

  describe('getCourthouseRegions', () => {
    it('should return an observable of RegionData[]', () => {
      jest.spyOn(service, 'getCourthouseRegions').mockReturnValue(of(regions));

      let result;
      service.getCourthouseRegions().subscribe((data) => {
        result = data;
      });

      expect(regions).toEqual(result);
    });
  });

  describe('getCourthousesWithRegions', () => {
    it('should return courthouses with their respective regions', () => {
      jest.spyOn(service, 'getCourthouses').mockReturnValue(of(courthouseData));
      jest.spyOn(service, 'getCourthouseRegions').mockReturnValue(of(regions));

      let result;
      service.getCourthousesWithRegions().subscribe((data) => {
        result = data;
      });
      expect(courthouses).toEqual(result);
    });
  });

  describe('mapRegionsToCourthouses', () => {
    it('should correctly map regions to courthouses', () => {
      const result = service.mapRegionsToCourthouses(regions, courthouseData);

      expect(result).toEqual(courthouses);
    });
  });

  describe('searchCourthouses', () => {
    it('should filter courthouses based on the search query', () => {
      const mockCourthousesObservable = of(courthouses);
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: 'Kingston',
        displayName: '',
        region: '',
      };

      let result;
      service.searchCourthouses(mockCourthousesObservable, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([courthouses[2]]);
    });

    it('should filter courthouses based on the search query, display name', () => {
      const mockCourthousesObservable = of(courthouses);
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: '',
        displayName: 'Slough',
        region: '',
      };

      let result;
      service.searchCourthouses(mockCourthousesObservable, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([courthouses[1]]);
    });

    it('should filter courthouses based on the search query, no results', () => {
      const mockCourthousesObservable = of(courthouses);
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: '',
        displayName: 'zzzzz',
        region: '',
      };

      let result;
      service.searchCourthouses(mockCourthousesObservable, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([]);
    });
  });
});
