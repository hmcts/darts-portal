import { CommonModule } from '@angular/common';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { AudioEventRow, HearingAudio, HearingEvent, HearingEventTypeEnum } from '@darts-types/index';
import { Subscription } from 'rxjs';
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

    const expectedTable: AudioEventRow[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T10:00:01.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:01.620Z',
        type: HearingEventTypeEnum.Audio,
      },
      {
        id: 8,
        timestamp: '2023-07-31T10:00:02.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: HearingEventTypeEnum.Event,
      },
      {
        id: 9,
        timestamp: '2023-07-31T10:00:03.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: HearingEventTypeEnum.Event,
      },
      {
        id: 2,
        media_start_timestamp: '2023-07-31T10:00:04.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:04.620Z',
        type: HearingEventTypeEnum.Audio,
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T10:00:06.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:06.620Z',
        type: HearingEventTypeEnum.Audio,
      },
      {
        id: 10,
        timestamp: '2023-07-31T10:00:07.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: HearingEventTypeEnum.Event,
      },
    ];

    expect(component.rows).toEqual(expectedTable);
  });

  it('should toggle row selection', () => {
    const row: AudioEventRow = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: HearingEventTypeEnum.Audio,
    };

    component.toggleRowSelection(row);

    expect(component.selectedRows).toContain(row);

    component.toggleRowSelection(row);

    expect(component.selectedRows).not.toContain(row);
  });

  it('should check if a row is selected', () => {
    const row: AudioEventRow = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: HearingEventTypeEnum.Audio,
    };

    component.selectedRows.push(row);

    expect(component.isRowSelected(row)).toBeTruthy();
  });

  describe('#onSelectAllChanged', () => {
    it('should check all the rows on the table', () => {
      const eventsSelectSpy = jest.spyOn(component.eventsSelect, 'emit');
      const filteredTable = [
        {
          id: 1,
          timestamp: '2023-07-31T01:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
          type: HearingEventTypeEnum.Event,
        },
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          type: HearingEventTypeEnum.Audio,
          timestamp: '2023-07-31T02:32:24.620Z',
        },
      ];
      component.filteredRows = filteredTable;
      component.onSelectAllChanged(true);
      expect(component.selectedRows).toEqual(filteredTable);
      expect(eventsSelectSpy).toHaveBeenCalledWith(component.selectedRows);
    });
    it('should uncheck all the rows on the table', () => {
      const eventsSelectSpy = jest.spyOn(component.eventsSelect, 'emit');
      component.onSelectAllChanged(false);
      expect(component.selectedRows).toEqual([]);
      expect(eventsSelectSpy).toHaveBeenCalledWith(component.selectedRows);
    });
  });

  it('should filter rows correctly', () => {
    const eventRow: AudioEventRow = { id: 1, type: HearingEventTypeEnum.Event };
    component.rows = [
      { id: 2, type: HearingEventTypeEnum.Audio },
      eventRow,
      { id: 3, type: HearingEventTypeEnum.Audio },
    ];

    component.onFilterChanged('event');
    expect(component.filteredRows).toEqual([eventRow]);

    component.onFilterChanged('all');
    expect(component.filteredRows).toEqual(component.rows);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const subSpy = new Subscription();
    jest.spyOn(subSpy, 'unsubscribe');
    component.subs.push(subSpy);

    component.ngOnDestroy();

    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should filter by events', () => {
    component.selectedOption.setValue('event');

    fixture.detectChanges();

    expect(component.filteredRows).toEqual(component.rows.filter((row) => row.type === HearingEventTypeEnum.Event));
  });

  it('should filter by all', () => {
    component.selectedOption.setValue('all');

    fixture.detectChanges();

    expect(component.filteredRows).toEqual(component.rows);
  });

  it('should pause all audio players except the one with the given id', () => {
    const id = 1;
    const audioPlayer1 = { id: 1, pausePlayer: jest.fn() } as unknown as AudioPlayerComponent;
    const audioPlayer2 = { id: 2, pausePlayer: jest.fn() } as unknown as AudioPlayerComponent;
    const audioPlayer3 = { id: 3, pausePlayer: jest.fn() } as unknown as AudioPlayerComponent;

    const audioPlayers = new QueryList<AudioPlayerComponent>();
    audioPlayers.reset([audioPlayer1, audioPlayer2, audioPlayer3]);
    component.audioPlayers = audioPlayers;

    component.onAudioPlay(id);

    expect(audioPlayer1.pausePlayer).not.toHaveBeenCalled();
    expect(audioPlayer2.pausePlayer).toHaveBeenCalled();
    expect(audioPlayer3.pausePlayer).toHaveBeenCalled();
  });
});
