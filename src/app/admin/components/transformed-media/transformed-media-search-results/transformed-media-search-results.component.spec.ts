import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { DateTime } from 'luxon';
import {
  TransformedMediaRow,
  TransformedMediaSearchResultsComponent,
} from './transformed-media-search-results.component';
import { By } from '@angular/platform-browser';

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

  it('displays no data message and not the delete button when no results exist', () => {
    const noDataMsgElem = fixture.debugElement.query(By.css('#no-data-message')).nativeElement;
    expect(noDataMsgElem.textContent).toBe('No data to display.');
    expect(fixture.debugElement.query(By.css('#delete-button'))).toBeNull();
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
          mediaRequest: {
            ownerUserName: 'ownerUserName',
            requestedAt: DateTime.fromISO('2020-01-01'),
            requestedByName: 'requestedByName',
          },
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
          requestedBy: 'requestedByName',
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

  describe('onDeleteClicked', () => {
    it('emits to delete', () => {
      const emitSpy = jest.spyOn(component.delete, 'emit');
      component.onDeleteClicked();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onSelectedMedia', () => {
    it('assigns selectedMedia', () => {
      component.selectedMedia = [{ id: 999, size: 1020 }];
      const media: TransformedMediaRow[] = [
        {
          id: 1,
          size: 1234,
        },
        {
          id: 2,
          size: 12345,
        },
      ];
      const emitSpy = jest.spyOn(component.selectedMediaChange, 'emit');
      component.onSelectedMedia(media);

      expect(emitSpy).toHaveBeenCalled();
      expect(component.selectedMedia).toEqual(media);
    });
  });
});
