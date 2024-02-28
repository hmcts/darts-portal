import { SecurityGroup } from './../../core/models/courthouse/security-groups.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, catchError, map, of, forkJoin } from 'rxjs';
import { Courthouse, CourthouseData } from '@core-types/index';
import { RegionData } from '@admin-types/courthouses/region.interface';

export const COURTHOUSE_ADMIN_PATH = 'api/admin/courthouses';
export const GET_COURTHOUSE_REGIONS_PATH = '/api/admin/regions';
export const SECURITY_GROUPS_ADMIN_PATH = 'api/admin/security-groups';

@Injectable({
  providedIn: 'root',
})
export class CourthouseAdminService {
  http = inject(HttpClient);

  getCourthouse(courthouseId: number): Observable<CourthouseData> {
    return this.http.get<CourthouseData>(`${COURTHOUSE_ADMIN_PATH}/${courthouseId}`);
  }

  getCourthouseRegions(): Observable<RegionData[]> {
    return this.http.get<RegionData[]>(GET_COURTHOUSE_REGIONS_PATH).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getCourthouseSecurityGroups(): Observable<SecurityGroup[]> {
    return this.http.get<SecurityGroup[]>(`${SECURITY_GROUPS_ADMIN_PATH}`);
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
      name: courthouse.courthouse_name,
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
}
