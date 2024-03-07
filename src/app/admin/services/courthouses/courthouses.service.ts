import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { CreateCourthouseRequest } from '@admin-types/courthouses/create-courthouse-request.type';
import { Region } from '@admin-types/courthouses/region.interface';
import { CreateUpdateCourthouseFormValues } from '@admin-types/index';
import { SecurityGroupData } from '@admin-types/users/security-group.interface';
import { SecurityGroup } from '@admin-types/users/security-group.type';
import { SecurityRole } from '@admin-types/users/security-role.type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

export const GET_COURTHOUSE_REGIONS_PATH = '/api/admin/regions';
export const GET_COURTHOUSES_PATH = '/api/courthouses';
export const COURTHOUSES_ADMIN_PATH = '/api/admin/courthouses';
export const GET_SECURITY_GROUPS_PATH = '/api/admin/security-groups';
export const GET_SECURITY_ROLES_PATH = '/api/admin/security-roles';

@Injectable({
  providedIn: 'root',
})
export class CourthouseService {
  constructor(private readonly http: HttpClient) {}

  createCourthouse(courthouse: CreateUpdateCourthouseFormValues): Observable<CourthouseData> {
    return this.http.post<CourthouseData>(`${COURTHOUSES_ADMIN_PATH}`, this.mapToCreateCourthouseRequest(courthouse));
  }

  updateCourthouse(courthouseId: number, courthouse: CreateUpdateCourthouseFormValues): Observable<CourthouseData> {
    const updatedCourthouse = {
      courthouse_name: courthouse?.courthouseName,
      display_name: courthouse?.displayName,
      region_id: courthouse?.regionId,
    };
    return this.http.patch<CourthouseData>(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`, {
      updatedCourthouse,
    });
  }

  getCourthouse(courthouseId: number): Observable<CourthouseData> {
    return this.http.get<CourthouseData>(`${COURTHOUSES_ADMIN_PATH}/${courthouseId}`);
  }

  getCourthouses(): Observable<CourthouseData[]> {
    return this.http.get<CourthouseData[]>(GET_COURTHOUSES_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCourthouseRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(GET_COURTHOUSE_REGIONS_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCourthouseSecurityGroups(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityGroup[]>(`${GET_SECURITY_GROUPS_PATH}`);
  }

  getCourthouseTranscriptionCompanies(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityRole[]>(`${GET_SECURITY_ROLES_PATH}`).pipe(
      switchMap((securityGroups) => {
        const transcriberRole = securityGroups.find(
          (securityGroup: SecurityRole) => securityGroup.name === 'TRANSCRIBER'
        );
        if (transcriberRole) {
          return this.http
            .get<SecurityGroupData[]>(`${GET_SECURITY_GROUPS_PATH}/?role-ids=${transcriberRole.id}`)
            .pipe(map((securityGroups) => this.mapToSecurityGroupData(securityGroups)));
        }
        return of([]);
      })
    );
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

  mapRegionsToCourthouses(regions: Region[], courthouses: CourthouseData[]): Courthouse[] {
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

  private mapToCreateCourthouseRequest(courthouse: CreateUpdateCourthouseFormValues): CreateCourthouseRequest {
    return {
      courthouse_name: courthouse.courthouseName!,
      display_name: courthouse.displayName!,
      region_id: courthouse?.regionId ? parseInt(courthouse.regionId) : undefined,
      security_group_ids: courthouse?.securityGroupIds.map((securityGroupId) => parseInt(securityGroupId)),
    };
  }

  private mapToSecurityGroupData(securityGroups: SecurityGroupData[]): SecurityGroup[] {
    return securityGroups.map((group) => {
      return {
        id: group.id!,
        name: group.name!,
        displayName: group.display_name,
      };
    });
  }

  mapRegionAndSecurityGroupsToCourthouse(
    courthouse: CourthouseData,
    regions: Region[],
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
      // Provide 'No region' object if none provided
      region: matchingRegion || { name: 'No region' },
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
        ? courthouse?.region?.name?.toLowerCase().includes(query.region.toLowerCase())
        : true;

      return matchesCourthouseName && matchesDisplayName && matchesRegionName;
    });

    return of(filteredCourthouses);
  }
}
