import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { Region } from '@admin-types/courthouses/region.interface';
import { SecurityGroup, SecurityRoleData } from '@admin-types/index';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import {
  COURTHOUSES_ADMIN_PATH,
  CourthouseService,
  GET_COURTHOUSES_PATH,
  GET_COURTHOUSE_REGIONS_PATH,
  GET_SECURITY_GROUPS_PATH,
  GET_SECURITY_ROLES_PATH,
} from './courthouses.service';

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
    TestBed.configureTestingModule({ imports: [], providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CourthouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createCourthouse', () => {
    it('makes POST request with courthouse data', () => {
      const newCourthouse = {
        courthouseName: 'courthouse',
        displayName: 'Courthouse',
        regionId: 1,
        securityGroupIds: ['1', '2', '3'],
      };

      service.createCourthouse(newCourthouse).subscribe();

      const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}`);
      expect(req.request.method).toBe('POST');
      expect((req.request.body as CourthouseData).courthouse_name).toEqual('COURTHOUSE');
    });
  });

  describe('#updateCourthouse', () => {
    it('makes PATCH request with courthouse data', () => {
      const newCourthouse = {
        courthouseName: 'COURTHOUSE',
        displayName: 'Courthouse',
        regionId: 1,
        securityGroupIds: ['1', '2', '3'],
      };
      const courthouseId = 1;
      service.updateCourthouse(courthouseId, newCourthouse).subscribe();

      const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
      expect(req.request.method).toBe('PATCH');
    });
  });

  describe('#getCourthouse', () => {
    it('makes GET courthouse request and returns data', () => {
      const courthouseId = 1;

      service.getCourthouse(1).subscribe();

      const req = httpMock.expectOne(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('#getCourthouses', () => {
    it('should return cached value without firing request if cache exists', () => {
      service['cachedCourthouses'] = courthouseData; // Set the cached data

      let courthouseList;
      service.getCourthouses().subscribe((courthouses: CourthouseData[]) => {
        courthouseList = courthouses;
      });
      expect(courthouseList).toEqual(courthouseData);

      httpMock.expectNone(GET_COURTHOUSES_PATH);
    });

    it('should return courthouses and send API request', () => {
      service.clearCourthouseCache();

      let courthouses: CourthouseData[] = [];

      service.getCourthouses().subscribe((response: CourthouseData[]) => {
        courthouses = response;
      });

      expect(courthouses).toEqual([]);

      const req = httpMock.expectOne(GET_COURTHOUSES_PATH);
      expect(req.request.method).toBe('GET');
      req.flush(courthouses);
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

      let regions;
      service.getCourthouseRegions().subscribe((regionResults: Region[]) => {
        regions = regionResults;
      });

      const req = httpMock.expectOne(GET_COURTHOUSE_REGIONS_PATH);
      expect(req.request.method).toBe('GET');

      req.flush(mockRegions);

      expect(regions).toEqual(mockRegions);
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
      const secGroups = [
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
      ];
      const mockSecurityRoles: SecurityRoleData[] = [
        { id: 99, role_name: 'TRANSCRIBER', display_name: 'Transcriber', display_state: true },
      ];

      let securityGroups;
      service.getCourthouseTranscriptionCompanies().subscribe((securityGroupResults: SecurityGroup[]) => {
        securityGroups = securityGroupResults;
      });

      httpMock.expectOne(`${GET_SECURITY_ROLES_PATH}`).flush(mockSecurityRoles);

      httpMock.expectOne(`${GET_SECURITY_GROUPS_PATH}?role_ids=99`).flush(secGroups);

      expect(securityGroups).toEqual([
        {
          id: 1,
          name: 'Company 1',
          securityRoleId: 1,
        },
        {
          id: 2,
          name: 'Company 2',
          securityRoleId: 2,
        },
      ]);
    });

    it('should return empty if there is not a transcriber role', () => {
      const mockSecurityRoles: SecurityRoleData[] = [
        { id: 1, role_name: 'NOT A TRANSCRIBER', display_name: 'I am not a Transcriber', display_state: true },
      ];

      let companies;
      service.getCourthouseTranscriptionCompanies().subscribe((results: SecurityGroup[]) => {
        companies = results;
      });

      httpMock.expectOne(`${GET_SECURITY_ROLES_PATH}`).flush(mockSecurityRoles);

      expect(companies).toEqual([]);

      httpMock.expectNone(`${GET_SECURITY_GROUPS_PATH}?role_ids=99`);
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

  describe('mapCourthouseDataToCourthouses', () => {
    it('should map courthouse data to courthouses', () => {
      const result = service.mapCourthouseDataToCourthouses([
        {
          id: 1,
          courthouse_name: 'READING',
          display_name: 'Reading',
          code: 0,
          region_id: 0,
          created_date_time: '2023-08-18T09:48:29.728Z',
          last_modified_date_time: '2023-08-18T09:48:29.728Z',
          has_data: true,
        },
      ]);

      expect(result).toEqual([
        {
          id: 1,
          courthouseName: 'READING',
          displayName: 'Reading',
          code: 0,
          createdDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
          lastModifiedDateTime: DateTime.fromISO('2023-08-18T09:48:29.728Z'),
          hasData: true,
        },
      ]);
    });
  });
});
