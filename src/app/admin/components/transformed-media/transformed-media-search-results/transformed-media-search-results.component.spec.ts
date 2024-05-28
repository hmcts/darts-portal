import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { DateTime } from 'luxon';
import { TransformedMediaSearchResultsComponent } from './transformed-media-search-results.component';

describe('TransformedMediaSearchResultsComponent', () => {
  let component: TransformedMediaSearchResultsComponent;
  let fixture: ComponentFixture<TransformedMediaSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformedMediaSearchResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransformedMediaSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should call mapRows', () => {
      const mapRowsSpy = jest.spyOn(component, 'mapRows');

      component.ngOnChanges();

      expect(mapRowsSpy).toHaveBeenCalled();
    });
  });

  describe('mapRows', () => {
    it('should map results to rows', () => {
      const results = [
        {
          id: 1,
          case: { caseNumber: 'caseNumber' },
          courthouse: { displayName: 'courthouse' },
          hearing: { hearingDate: DateTime.fromISO('2020-04-04') },
          mediaRequest: { ownerUserName: 'ownerUserName', requestedAt: DateTime.fromISO('2020-01-01') },
          lastAccessedAt: DateTime.fromISO('2020-03-03'),
          fileFormat: 'fileFormat',
          fileSizeBytes: 1234,
          fileName: 'fileName',
        },
      ] as TransformedMediaAdmin[];

      const expectedRows = [
        {
          id: 1,
          caseNumber: 'caseNumber',
          courthouse: 'courthouse',
          hearingDate: DateTime.fromISO('2020-04-04'),
          owner: 'ownerUserName',
          requestedBy: 'ownerUserName',
          requestedDate: DateTime.fromISO('2020-01-01'),
          lastAccessed: DateTime.fromISO('2020-03-03'),
          fileType: 'fileFormat',
          size: 1234,
          filename: 'fileName',
        },
      ];

      expect(component.mapRows(results)).toEqual(expectedRows);
    });
  });
});
