import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
import { AudioSearchResultsComponent } from './audio-search-results.component';

describe('AudioSearchResultsComponent', () => {
  let component: AudioSearchResultsComponent;
  let fixture: ComponentFixture<AudioSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioSearchResultsComponent, DataTableComponent, TableRowTemplateDirective, LuxonDatePipe, RouterLink],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have correct initial columns', () => {
    expect(component.columns).toEqual([
      { name: 'Audio ID', prop: 'id', sortable: true },
      { name: 'Courthouse', prop: 'courthouse', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'Start Time', prop: 'startAt', sortable: true },
      { name: 'End Time', prop: 'endAt', sortable: true },
      { name: 'Channel', prop: 'channel', sortable: true },
      { name: 'Hidden', prop: 'isHidden', sortable: true },
    ]);
  });

  it('should compute caption correctly for single audio result', () => {
    const audio = [
      {
        id: '1',
        courthouse: 'A',
        courtroom: 'B',
        startAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
        endAt: DateTime.fromISO('2023-01-01T01:00:00Z'),
        channel: '1',
        isHidden: false,
      },
    ];
    fixture.componentRef.setInput('audio', audio);
    fixture.detectChanges();
    expect(component.caption()).toBe('audio result');
  });

  it('should compute caption correctly for multiple audio results', () => {
    const audio = [
      {
        id: '1',
        courthouse: 'A',
        courtroom: 'B',
        startAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
        endAt: DateTime.fromISO('2023-01-01T01:00:00Z'),
        channel: '1',
        isHidden: false,
      },
      {
        id: '2',
        courthouse: 'C',
        courtroom: 'D',
        startAt: DateTime.fromISO('2023-01-02T00:00:00Z'),
        endAt: DateTime.fromISO('2023-01-02T01:00:00Z'),
        channel: '2',
        isHidden: false,
      },
    ];
    fixture.componentRef.setInput('audio', audio);
    fixture.detectChanges();
    expect(component.caption()).toBe('audio results');
  });
});
