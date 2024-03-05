import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { RegionData } from '@admin-types/courthouses/region.interface';
import { SecurityGroup } from '@admin-types/users/security-group.type';
import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

export const GET_COURTHOUSE_REGIONS_PATH = '/api/admin/regions';
export const GET_COURTHOUSES_PATH = '/api/courthouses';
export const GET_COURTHOUSES_ADMIN_PATH = '/api/admin/courthouses';
export const GET_SECURITY_GROUPS_PATH = 'api/admin/security-groups';

@Injectable({
  providedIn: 'root',
})
export class CourthouseService {
  constructor(private readonly http: HttpClient) {}

  createCourthouse(courthouse: CreateUpdateCourthouseFormValues): Observable<CourthouseData> {
    return this.http.post<CourthouseData>(`${GET_COURTHOUSES_ADMIN_PATH}`, courthouse);
  }

  updateCourthouse(courthouseId: number, courthouse: CreateUpdateCourthouseFormValues): Observable<CourthouseData> {
    return this.http.post<CourthouseData>(`${GET_COURTHOUSES_ADMIN_PATH}/${courthouseId}`, courthouse);
  }

  getCourthouse(courthouseId: number): Observable<CourthouseData> {
    return this.http.get<CourthouseData>(`${GET_COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
  }

  getCourthouses(): Observable<CourthouseData[]> {
    return this.http.get<CourthouseData[]>(GET_COURTHOUSES_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCourthouseRegions(): Observable<RegionData[]> {
    return this.http.get<RegionData[]>(GET_COURTHOUSE_REGIONS_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCourthouseSecurityGroups(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityGroup[]>(`${GET_SECURITY_GROUPS_PATH}`);
  }

  getCourthousesWithRegions() {
    return forkJoin({
      courthouses: this.getCourthouses(),
      regions: this.getCourthouseRegions(),
    }).pipe(map(({ courthouses, regions }) => this.mapRegionsToCourthouses(regions, courthouses)));
  }

  getCourthouseWithRegionsAndSecurityGroups(courthouseId: number) {
    return forkJoin({
      courthouse: this.getCourthouse(courthouseId),
      regions: this.getCourthouseRegions(),
      securityGroups: this.getCourthouseSecurityGroups(),
    }).pipe(
      map(({ courthouse, regions, securityGroups }) =>
        this.mapRegionAndSecurityGroupsToCourthouse(courthouse, regions, securityGroups)
      )
    );
  }

  doesCourthouseNameExist(courthouseName: string): Observable<boolean> {
    return this.http
      .get<CourthouseData[]>(GET_COURTHOUSES_PATH)
      .pipe(map((courthouses) => !!courthouses.find((courthouse) => courthouse.courthouse_name === courthouseName)));
  }

  doesDisplayNameExist(displayName: string): Observable<boolean> {
    return this.http
      .get<CourthouseData[]>(GET_COURTHOUSES_PATH)
      .pipe(map((courthouses) => !!courthouses.find((courthouse) => courthouse.display_name === displayName)));
  }

  mapRegionsToCourthouses(regions: RegionData[], courthouses: CourthouseData[]): Courthouse[] {
    return courthouses.map((courthouse) => {
      const matchingRegion = regions.find((region) => region.id === courthouse.region_id);
      return {
        id: courthouse.id,
        courthouseName: courthouse.courthouse_name,
        displayName: courthouse.display_name,
        code: courthouse.code,
        createdDateTime: DateTime.fromISO(courthouse.created_date_time),
        lastModifiedDateTime: courthouse.last_modified_date_time
          ? DateTime.fromISO(courthouse.last_modified_date_time)
          : undefined,
        regionName: matchingRegion ? matchingRegion.name : undefined,
      };
    });
  }

  mapRegionAndSecurityGroupsToCourthouse(
    courthouse: CourthouseData,
    regions: RegionData[],
    securityGroups: SecurityGroup[]
  ): Courthouse {
    const matchingRegion = regions.find((region) => region.id === courthouse.region_id);
    const matchingGroups = securityGroups.filter((securityGroup) =>
      courthouse.security_group_ids?.includes(securityGroup.id)
    );
    return {
      id: courthouse.id,
      courthouseName: courthouse.courthouse_name,
      displayName: courthouse.display_name,
      code: courthouse.code,
      createdDateTime: DateTime.fromISO(courthouse.created_date_time),
      lastModifiedDateTime: courthouse.last_modified_date_time
        ? DateTime.fromISO(courthouse.last_modified_date_time)
        : undefined,
      // Provide 'No region' string if none provided
      regionName: matchingRegion?.name || 'No region',
      securityGroups: matchingGroups,
    };
  }

  searchCourthouses(courthouses: Courthouse[], query: CourthouseSearchFormValues): Observable<Courthouse[]> {
    const filteredCourthouses = courthouses.filter((courthouse) => {
      const matchesCourthouseName = query.courthouseName
        ? courthouse.courthouseName.toLowerCase().includes(query.courthouseName.toLowerCase())
        : true;
      const matchesDisplayName = query.displayName
        ? courthouse.displayName.toLowerCase().includes(query.displayName.toLowerCase())
        : true;
      const matchesRegionName = query.region
        ? courthouse.regionName?.toLowerCase().includes(query.region.toLowerCase())
        : true;

      return matchesCourthouseName && matchesDisplayName && matchesRegionName;
    });

    return of(filteredCourthouses);
  }
}
