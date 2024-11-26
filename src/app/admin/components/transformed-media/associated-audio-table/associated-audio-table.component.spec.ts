import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { DateTime } from 'luxon';
import { AssociatedAudioTableComponent } from './associated-audio-table.component';

describe('AssociatedAudioTableComponent', () => {
  let component: AssociatedAudioTableComponent;
  let fixture: ComponentFixture<AssociatedAudioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedAudioTableComponent],
      providers: [DatePipe, LuxonDatePipe, provideRouter([])],
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
          displayName: 'Room 1',
        },
        channel: 4,
        isHidden: false,
        isCurrent: false,
        courthouseName: 'Swansea',
        courtroomName: 'Room 1',
      },
    ]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
