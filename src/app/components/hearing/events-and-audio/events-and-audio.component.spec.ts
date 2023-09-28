import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingAudio, HearingAudioEventViewModel, HearingEvent, HearingEventTypeEnum } from '@darts-types/index';
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

    const expectedTable: HearingAudioEventViewModel[] = [
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

    expect(component.table).toEqual(expectedTable);
  });

  it('should toggle row selection', () => {
    const row: HearingAudioEventViewModel = {
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
    const row: HearingAudioEventViewModel = {
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
      component.filteredTable = filteredTable;
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
    component.eventsFilterForm.get('selectedOption')?.setValue('event');

    fixture.detectChanges();

    expect(component.filteredTable).toEqual(component.table.filter((row) => row.type === HearingEventTypeEnum.Event));
  });

  it('should filter by all', () => {
    component.eventsFilterForm.get('selectedOption')?.setValue('all');

    fixture.detectChanges();

    expect(component.filteredTable).toEqual(component.table);
  });

  describe('#onPreviewAudio', () => {
    it('add audio to preview when not already in preview', () => {
      const idToAdd = 1;
      component.audioInPreview = [2, 3];

      component.onPreviewAudio(idToAdd);

      expect(component.audioInPreview).toEqual([2, 3, idToAdd]);
    });

    it('do not add audio to preview if it is already in preview', () => {
      const idToAdd = 1;
      component.audioInPreview = [1, 2, 3];

      component.onPreviewAudio(idToAdd);

      expect(component.audioInPreview).toEqual([1, 2, 3]);
    });
  });

  describe('#isAudioInPreview', () => {
    it('should return true when audio is in preview', () => {
      const idToCheck = 1;
      component.audioInPreview = [1, 2, 3];

      const result = component.isAudioInPreview(idToCheck);

      expect(result).toBe(true);
    });

    it('should return false when audio is not in preview', () => {
      const idToCheck = 4;
      component.audioInPreview = [1, 2, 3];

      const result = component.isAudioInPreview(idToCheck);

      expect(result).toBe(false);
    });
  });
});
