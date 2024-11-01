import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { DateTime } from 'luxon';
import { EventSearchResultsComponent } from './event-search-results.component';

describe('EventSearchResultsComponent', () => {
  let component: EventSearchResultsComponent;
  let fixture: ComponentFixture<EventSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSearchResultsComponent],
      providers: [DatePipe, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty events array by default', () => {
    expect(component.events()).toEqual([]);
  });

  it('should compute caption correctly for single event', () => {
    const events = [
      {
        id: 1,
        eventTs: DateTime.fromISO('2023-10-01T00:00:00Z'),
        name: 'Event 1',
        courthouse: 'Courthouse 1',
        courtroom: 'Courtroom 1',
        text: 'Text 1',
      },
    ];
    fixture.componentRef.setInput('events', events);
    fixture.detectChanges();
    expect(component.caption()).toBe('event result');
  });

  it('should compute caption correctly for multiple events', () => {
    const events = [
      {
        id: 1,
        eventTs: DateTime.fromISO('2023-10-01T00:00:00Z'),
        name: 'Event 1',
        courthouse: 'Courthouse 1',
        courtroom: 'Courtroom 1',
        text: 'Text 1',
      },
      {
        id: 2,
        eventTs: DateTime.fromISO('2023-10-02T00:00:00Z'),
        name: 'Event 2',
        courthouse: 'Courthouse 2',
        courtroom: 'Courtroom 2',
        text: 'Text 2',
      },
    ];
    fixture.componentRef.setInput('events', events);
    fixture.detectChanges();
    expect(component.caption()).toBe('event results');
  });
});
