import { CourthouseSearchFormValues } from '@admin-types/courthouses/courthouse-search-form-values.type';
import { Courthouse } from '@admin-types/courthouses/courthouse.type';
import { RegionData } from '@admin-types/courthouses/region.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourthouseData } from '@core-types/index';
import { DateTime } from 'luxon';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

export const GET_COURTHOUSE_REGIONS_PATH = '/api/admin/regions';
export const GET_COURTHOUSES_PATH = '/api/courthouses';

@Injectable({
  providedIn: 'root',
})
export class CourthouseService {
  constructor(private readonly http: HttpClient) {}

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

  getCourthousesWithRegions() {
    return forkJoin({
      courthouses: this.getCourthouses(),
      regions: this.getCourthouseRegions(),
    }).pipe(map(({ courthouses, regions }) => this.mapRegionsToCourthouses(regions, courthouses)));
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
