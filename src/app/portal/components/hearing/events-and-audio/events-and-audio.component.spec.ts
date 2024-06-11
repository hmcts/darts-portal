import { CommonModule } from '@angular/common';
import { QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from '@common/audio-player/audio-player.component';
import { AudioEventRow, HearingAudio, HearingEvent } from '@portal-types/index';
import { AudioPreviewService } from '@services/audio-preview/audio-preview.service';
import { Subscription, of } from 'rxjs';
import { EventsAndAudioComponent } from './events-and-audio.component';

describe('EventsAndAudioComponent', () => {
  let component: EventsAndAudioComponent;
  let fixture: ComponentFixture<EventsAndAudioComponent>;
  let audioPreviewService: Partial<AudioPreviewService>;

  beforeEach(() => {
    audioPreviewService = {
      isAudioPreviewReady: jest.fn().mockReturnValue(of(200)),
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, EventsAndAudioComponent],
      providers: [{ provide: AudioPreviewService, useValue: audioPreviewService }],
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
        type: 'audio',
        audioIsReady$: of(200),
        checkboxLabel: 'Select audio from 11:00:01 to 15:32:24',
      },
      {
        id: 8,
        timestamp: '2023-07-31T10:00:02.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
        checkboxLabel: 'Select event at 11:00:02',
      },
      {
        id: 9,
        timestamp: '2023-07-31T10:00:03.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
        checkboxLabel: 'Select event at 11:00:03',
      },
      {
        id: 2,
        media_start_timestamp: '2023-07-31T10:00:04.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:04.620Z',
        type: 'audio',
        audioIsReady$: of(200),
        checkboxLabel: 'Select audio from 11:00:04 to 15:32:24',
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T10:00:06.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        timestamp: '2023-07-31T10:00:06.620Z',
        type: 'audio',
        audioIsReady$: of(200),
        checkboxLabel: 'Select audio from 11:00:06 to 15:32:24',
      },
      {
        id: 10,
        timestamp: '2023-07-31T10:00:07.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
        checkboxLabel: 'Select event at 11:00:07',
      },
    ];

    //assertion to check that the table is constructed correctly omitting the audioSourceUrl$ property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(component.rows.map(({ audioIsReady$, ...rest }) => rest)).toEqual(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      expectedTable.map(({ audioIsReady$, ...rest }) => rest)
    );
  });

  it('should toggle row selection', () => {
    const row: AudioEventRow = {
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
    const row: AudioEventRow = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: 'audio',
    };

    component.selectedRows.push(row);

    expect(component.isRowSelected(row)).toBeTruthy();
  });

  describe('#onSelectAllChanged', () => {
    it('should check all the rows on the table', () => {
      const eventsSelectSpy = jest.spyOn(component.eventsSelect, 'emit');
      const filteredTable: AudioEventRow[] = [
        {
          id: 1,
          timestamp: '2023-07-31T01:00:00.620Z',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
        {
          id: 1,
          media_start_timestamp: '2023-07-31T02:32:24.620Z',
          media_end_timestamp: '2023-07-31T14:32:24.620Z',
          type: 'audio',
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
    const eventRow: AudioEventRow = { id: 1, type: 'event' };
    component.rows = [{ id: 2, type: 'audio' }, eventRow, { id: 3, type: 'audio' }];

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

    expect(component.filteredRows).toEqual(component.rows.filter((row) => row.type === 'event'));
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

  it('should add audio id to audioInPreview array', () => {
    const id = 1;
    component.onPreviewAudio(id);
    expect(component.audioInPreview).toContain(id);
  });

  it('should not add audio id to audioInPreview array if it already exists', () => {
    const id = 1;
    component.audioInPreview = [1, 2, 3];
    component.onPreviewAudio(id);
    expect(component.audioInPreview).toEqual([1, 2, 3]);
  });

  describe('#isAudioInPreview', () => {
    it('should return true if the audio id is in the audioInPreview array', () => {
      // Arrange
      const id = 1;
      component.audioInPreview = [1, 2, 3];

      // Act
      const result = component.isAudioInPreview(id);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if the audio id is not in the audioInPreview array', () => {
      // Arrange
      const id = 4;
      component.audioInPreview = [1, 2, 3];

      // Act
      const result = component.isAudioInPreview(id);

      // Assert
      expect(result).toBe(false);
    });
  });

  it('should emit selected rows when onRowSelect is called', () => {
    jest.spyOn(component.eventsSelect, 'emit');
    const rows: AudioEventRow[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        type: 'audio',
      },
      {
        id: 2,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
    ];

    component.onRowSelect(rows);

    expect(component.eventsSelect.emit).toHaveBeenCalledWith(rows);
  });

  it('should map events and audio to table', () => {
    const audio: HearingAudio[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T10:00:01.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
    ];
    const events: HearingEvent[] = [
      {
        id: 1,
        timestamp: '2023-07-31T10:00:02.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
    ];

    component.audio = audio;
    component.events = events;

    // Act
    component['mapEventsAndAudioToTable']();

    // Assert
    const expectedRows = [
      ...audio.map((audioItem) => ({
        ...audioItem,
        type: 'audio',
        timestamp: audioItem.media_start_timestamp,
        audioIsReady$: expect.anything(),
        checkboxLabel: 'Select audio from 11:00:01 to 15:32:24',
      })),
      ...events.map((eventItem) => ({
        ...eventItem,
        type: 'event',
        checkboxLabel: 'Select event at 11:00:02',
      })),
    ];
    expect(component.rows).toEqual(expectedRows);
  });

  describe('#sortTableByTimeStamp', () => {
    it('should sort the table by timestamp in ascending order', () => {
      const table: AudioEventRow[] = [
        {
          id: 1,
          timestamp: '2023-07-31T10:00:02',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
        {
          id: 2,
          timestamp: '2023-07-31T10:00:01',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
        {
          id: 3,
          timestamp: '2023-07-31T10:00:03',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
      ];

      component['sortTableByTimeStamp'](table);

      expect(table).toEqual([
        {
          id: 2,
          timestamp: '2023-07-31T10:00:01',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
        {
          id: 1,
          timestamp: '2023-07-31T10:00:02',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
        {
          id: 3,
          timestamp: '2023-07-31T10:00:03',
          name: 'Case called on',
          text: 'Record: New Case',
          type: 'event',
        },
      ]);
    });
  });
});
