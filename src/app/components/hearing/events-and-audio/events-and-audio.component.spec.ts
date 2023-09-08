import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { HearingEventTypeEnum } from 'src/app/types/enums';
import { HearingAudio, HearingEvent, HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { EventsAndAudioComponent } from './events-and-audio.component';

describe('EventsAndAudioComponent', () => {
  let component: EventsAndAudioComponent;
  let fixture: ComponentFixture<EventsAndAudioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, EventsAndAudioComponent],
    });
    fixture = TestBed.createComponent(EventsAndAudioComponent);
    component = fixture.componentInstance;
    component.audio = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
    ];
    component.events = [
      {
        id: 1,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
    ];

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should construct the table by combining audio and events in order of timestamp', () => {
    const audio: HearingAudio[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T10:00:01.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
      {
        id: 2,
        media_start_timestamp: '2023-07-31T10:00:04.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T10:00:06.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
    ];
    const events: HearingEvent[] = [
      {
        id: 8,
        timestamp: '2023-07-31T10:00:02.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
      {
        id: 9,
        timestamp: '2023-07-31T10:00:03.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
      {
        id: 10,
        timestamp: '2023-07-31T10:00:07.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
    ];

    component.audio = audio;
    component.events = events;

    component.ngOnChanges();

    const expectedTable: HearingAudioEventViewModel[] = [
      {
        id: 10,
        timestamp: '2023-07-31T10:00:07.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T10:00:06.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:06.620Z',
        type: 'audio',
      },
      {
        id: 2,
        media_start_timestamp: '2023-07-31T10:00:04.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:04.620Z',
        type: 'audio',
      },
      {
        id: 9,
        timestamp: '2023-07-31T10:00:03.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
      {
        id: 8,
        timestamp: '2023-07-31T10:00:02.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
      {
        id: 1,
        media_start_timestamp: '2023-07-31T10:00:01.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:01.620Z',
        type: 'audio',
      },
    ];

    expect(component.table).toEqual(expectedTable);
  });

  it('should toggle row selection', () => {
    const row: HearingAudioEventViewModel = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: 'audio',
    };

    component.toggleRowSelection(row);

    expect(component.selectedRows).toContain(row);

    component.toggleRowSelection(row);

    expect(component.selectedRows).not.toContain(row);
  });

  it('should check if a row is selected', () => {
    const row: HearingAudioEventViewModel = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: 'audio',
    };

    component.selectedRows.push(row);

    expect(component.isRowSelected(row)).toBeTruthy();
  });

  it('should filter rows correctly', () => {
    const eventRow: HearingAudioEventViewModel = { id: 1, type: HearingEventTypeEnum.Event };
    component.table = [
      { id: 2, type: HearingEventTypeEnum.Audio },
      eventRow,
      { id: 3, type: HearingEventTypeEnum.Audio },
    ];

    component.onFilterChanged('event');
    expect(component.filteredTable).toEqual([eventRow]);

    component.onFilterChanged('all');
    expect(component.filteredTable).toEqual(component.table);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const subSpy = new Subscription();
    jest.spyOn(subSpy, 'unsubscribe');
    component.subs.push(subSpy);

    component.ngOnDestroy();

    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should filter by events', () => {
    component.form.get('selectedOption')?.setValue('event');

    fixture.detectChanges();

    expect(component.filteredTable).toEqual(component.table.filter((row) => row.type === HearingEventTypeEnum.Event));
  });

  it('should filter by all', () => {
    component.form.get('selectedOption')?.setValue('all');

    fixture.detectChanges();

    expect(component.filteredTable).toEqual(component.table);
  });
});
