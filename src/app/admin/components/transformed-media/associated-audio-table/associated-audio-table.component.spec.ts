import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
import { AssociatedAudioTableComponent } from './associated-audio-table.component';

describe('AssociatedAudioTableComponent', () => {
  let component: AssociatedAudioTableComponent;
  let fixture: ComponentFixture<AssociatedAudioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedAudioTableComponent],
      providers: [DatePipe, LuxonDatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedAudioTableComponent);
    fixture.componentRef.setInput('rows', [
      {
        id: 1,
        case: {
          id: 1,
        },
        hearing: {
          hearingDate: DateTime.fromISO('2020-01-01'),
        },
        courthouse: {
          displayName: 'Swansea',
        },
        startAt: DateTime.fromISO('2020-01-01T12:00:00Z'),
        endAt: DateTime.fromISO('2020-01-01T14:00:00Z'),
        courtroom: {
          name: 'Room 1',
        },
        channel: '4',
      },
    ]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('transforms signal input rows', () => {
    expect(component.rows()).toEqual([
      {
        audioId: 1,
        caseId: 1,
        hearingDate: DateTime.fromISO('2020-01-01'),
        courthouse: 'Swansea',
        startTime: DateTime.fromISO('2020-01-01T12:00:00Z'),
        endTime: DateTime.fromISO('2020-01-01T14:00:00Z'),
        courtroom: 'Room 1',
        channelNumber: '4',
      },
    ]);
  });
});
