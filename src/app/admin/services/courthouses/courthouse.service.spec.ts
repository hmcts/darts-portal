import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { SecurityGroup } from '@admin-types/users/security-group.type';
import { Region } from '@admin-types/courthouses/region.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import {
  CourthouseService,
  GET_COURTHOUSES_PATH,
  COURTHOUSES_ADMIN_PATH,
  GET_SECURITY_ROLES_PATH,
  GET_SECURITY_GROUPS_PATH,
  GET_COURTHOUSE_REGIONS_PATH,
} from './courthouses.service';
import { SecurityRole } from '@admin-types/index';

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
  ] as Region[];

  const courthouses = [
    {
      id: 1,
      courthouseName: 'READING',
      displayName: 'Reading',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      region: regions[0],
    },
    {
      id: 2,
      courthouseName: 'SLOUGH',
      displayName: 'Slough',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      region: regions[1],
    },
    {
      id: 3,
      courthouseName: 'KINGSTON',
      displayName: 'Kingston',
      code: 0,
      createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
      region: regions[2],
    },
  ] as unknown as Courthouse[];

  const courthouse = {
    id: 1,
    courthouseName: 'READING',
    displayName: 'Reading',
    code: 0,
    createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
    lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
    region: regions[0],
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

  it('#createCourthouse', () => {
    const newCourthouse = {
      courthouseName: 'COURTHOUSE',
      displayName: 'Courthouse',
      regionId: '1',
      securityGroupIds: ['1', '2', '3'],
    };

    service.createCourthouse(newCourthouse).subscribe((courthouse: CourthouseData) => {
      expect(courthouse).toEqual(newCourthouse);
    });

    const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}`);
    expect(req.request.method).toBe('POST');

    req.flush(newCourthouse);
  });

  it('#updateCourthouse', () => {
    const newCourthouse = {
      courthouseName: 'COURTHOUSE',
      displayName: 'Courthouse',
      regionId: '1',
      securityGroupIds: ['1', '2', '3'],
    };
    const courthouseId = 1;

    service.updateCourthouse(courthouseId, newCourthouse).subscribe((courthouse: CourthouseData) => {
      expect(courthouse).toEqual(newCourthouse);
    });

    const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
    expect(req.request.method).toBe('PATCH');

    req.flush(newCourthouse);
  });

  it('#getCourthouse', () => {
    const mockCourthouse = {};
    const courthouseId = 1;

    service.getCourthouse(1).subscribe((courthouse: CourthouseData) => {
      expect(courthouse).toEqual(mockCourthouse);
    });

    const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCourthouse);
  });

  describe('#getCourthouses', () => {
    it('should return proper courthouse data', () => {
      const mockCourthouses: CourthouseData[] = [];

      service.getCourthouses().subscribe((courthouses: CourthouseData[]) => {
        expect(courthouses).toEqual(mockCourthouses);
      });

      const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
      expect(req.request.method).toBe('GET');

      req.flush(mockCourthouses);
    });

    it('should return empty array on error', () => {
      let courthouses: CourthouseData[] = [];

      service.getCourthouses().subscribe((eventsResponse) => (courthouses = eventsResponse));

      const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(courthouses).toEqual([]);
    });
  });

  describe('#getCourthouseRegions', () => {
    it('getCourthouseRegions', () => {
      const mockRegions: Region[] = [];

      service.getCourthouseRegions().subscribe((regions: Region[]) => {
        expect(regions).toEqual(mockRegions);
      });

      const req = httpMock.expectOne(GET_COURTHOUSE_REGIONS_PATH);
      expect(req.request.method).toBe('GET');

      req.flush(mockRegions);
    });

    it('should return empty array on error', () => {
      let regions: Region[] = [];

      service.getCourthouseRegions().subscribe((eventsResponse) => (regions = eventsResponse));

      const req = httpMock.expectOne(GET_COURTHOUSE_REGIONS_PATH);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(regions).toEqual([]);
    });
  });

  it('#getCourthouseSecurityGroups', () => {
    const mockSecurityGroups: SecurityGroup[] = [];

    service.getCourthouseSecurityGroups().subscribe((groups: SecurityGroup[]) => {
      expect(groups).toEqual(mockSecurityGroups);
    });

    const req = httpMock.expectOne(GET_SECURITY_GROUPS_PATH);
    expect(req.request.method).toBe('GET');

    req.flush(mockSecurityGroups);
  });

  describe('#getCourthouseTranscriptionCompanies', () => {
    it('should return companies if there is a transcriber role', () => {
      const mockSecurityRoles: SecurityRole[] = [{ id: 99, name: 'TRANSCRIBER' }];

      service.getCourthouseTranscriptionCompanies().subscribe((securityGroups: SecurityGroup[]) => {
        expect(securityGroups).toEqual(mockSecurityRoles);
      });

      httpMock.expectOne(`${GET_SECURITY_ROLES_PATH}`).flush(mockSecurityRoles);

      httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}?role-ids=99`).flush([
        {
          id: 1,
          name: 'Company 1',
          security_role_id: 1,
        },
        {
          id: 2,
          name: 'Company 2',
          security_role_id: 2,
        },
      ]);
    });

    it('should return empty if there is not a transcriber role', () => {
      const mockSecurityRoles: SecurityRole[] = [{ id: 1, name: 'NOT A TRANSCRIBER' }];

      service.getCourthouseTranscriptionCompanies().subscribe((securityGroups: SecurityGroup[]) => {
        expect(securityGroups).toEqual(mockSecurityRoles);
      });

      httpMock.expectOne(`${GET_SECURITY_ROLES_PATH}`).flush(mockSecurityRoles);

      httpMock.expectNone(`${GET_SECURITY_GROUPS_PATH}?role-ids=99`);
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
