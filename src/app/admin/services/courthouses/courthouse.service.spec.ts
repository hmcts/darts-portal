import { SecurityGroup } from '@core-types/courthouse/security-groups.interface';
import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { RegionData } from '@admin-types/courthouses/region.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { CourthouseService, GET_COURTHOUSES_PATH, GET_COURTHOUSES_ADMIN_PATH } from './courthouses.service';

describe('CourthouseService', () => {
  let service: CourthouseService;
  let httpMock: HttpTestingController;

  const securityGroups = [
    {
      id: 1,
      name: 'Security 1',
    },
    {
      id: 2,
      name: 'Security 2',
    },
    {
      id: 3,
      name: 'Security 3',
    },
  ] as SecurityGroup[];

  const courthouses = [
    {
      id: 1,
      courthouseName: 'READING',
      displayName: 'Reading',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'South West',
    },
    {
      id: 2,
      courthouseName: 'SLOUGH',
      displayName: 'Slough',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'South',
    },
    {
      id: 3,
      courthouseName: 'KINGSTON',
      displayName: 'Kingston',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      regionName: 'London',
    },
  ] as unknown as Courthouse[];

  const courthouse = {
    id: 1,
    courthouseName: 'READING',
    displayName: 'Reading',
    code: 0,
    createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
    lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
    regionName: 'South West',
    securityGroups: [
      {
        id: 1,
        name: 'Security 1',
      },
      {
        id: 2,
        name: 'Security 2',
      },
      {
        id: 3,
        name: 'Security 3',
      },
    ],
  };

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
      id: 1,
      courthouse_name: 'READING',
      display_name: 'Reading',
      code: 0,
      region_id: 0,
      created_date_time: '2023-08-18T09:48:29.728Z',
      last_modified_date_time: '2023-08-18T09:48:29.728Z',
      security_group_ids: [1, 2, 3],
    },
    {
      id: 2,
      courthouse_name: 'SLOUGH',
      display_name: 'Slough',
      code: 0,
      region_id: 1,
      created_date_time: '2023-08-18T09:48:29.728Z',
      last_modified_date_time: '2023-08-18T09:48:29.728Z',
    },
    {
      id: 3,
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

  it('#getCourthouse', () => {
    const mockCourthouse = {};
    const courthouseId = 1;

    service.getCourthouse(1).subscribe((courthouse: CourthouseData) => {
      expect(courthouse).toEqual(mockCourthouse);
    });

    const req = httpMock.expectOne(`${GET_COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouse);
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

  describe('getCourthouseSecurityGroups', () => {
    it('should return an observable of SecurityGroups[]', () => {
      jest.spyOn(service, 'getCourthouseSecurityGroups').mockReturnValue(of(securityGroups));

      let result;
      service.getCourthouseSecurityGroups().subscribe((data) => {
        result = data;
      });

      expect(securityGroups).toEqual(result);
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

  describe('getCourthouseWithRegionsAndSecurityGroups', () => {
    it('should return courthouse with their respective regions AND security groups', () => {
      jest.spyOn(service, 'getCourthouse').mockReturnValue(of(courthouseData[0]));
      jest.spyOn(service, 'getCourthouseRegions').mockReturnValue(of(regions));
      jest.spyOn(service, 'getCourthouseSecurityGroups').mockReturnValue(of(securityGroups));

      let result;
      service.getCourthouseWithRegionsAndSecurityGroups(1).subscribe((data) => {
        result = data;
      });
      expect(courthouse).toEqual(result);
    });
  });

  describe('mapRegionsToCourthouses', () => {
    it('should correctly map regions to courthouses', () => {
      const result = service.mapRegionsToCourthouses(regions, courthouseData);

      expect(result).toEqual(courthouses);
    });
  });

  describe('mapRegionAndSecurityGroupsToCourthouse', () => {
    it('should correctly map regions and security groups to courthouses', () => {
      const result = service.mapRegionAndSecurityGroupsToCourthouse(courthouseData[0], regions, securityGroups);

      expect(result).toEqual(courthouse);
    });
  });

  describe('searchCourthouses', () => {
    it('should filter courthouses based on the search query', () => {
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: 'Kingston',
        displayName: '',
        region: '',
      };

      let result;
      service.searchCourthouses(courthouses, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([courthouses[2]]);
    });

    it('should filter courthouses based on the search query, display name', () => {
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: '',
        displayName: 'Slough',
        region: '',
      };

      let result;
      service.searchCourthouses(courthouses, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([courthouses[1]]);
    });

    it('should filter courthouses based on the search query, no results', () => {
      const searchQuery: CourthouseSearchFormValues = {
        courthouseName: '',
        displayName: 'zzzzz',
        region: '',
      };

      let result;
      service.searchCourthouses(courthouses, searchQuery).subscribe((data) => {
        result = data;
      });
      expect(result).toEqual([]);
    });
  });
});