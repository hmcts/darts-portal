import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingAudio, HearingEvent, HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { EventsAndAudioComponent } from './events-and-audio.component';

describe('EventsAndAudioComponent', () => {
  let component: EventsAndAudioComponent;
  let fixture: ComponentFixture<EventsAndAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, EventsAndAudioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAndAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the table correctly', () => {
    const audio: HearingAudio[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
      {
        id: 2,
        media_start_timestamp: '2022-07-31T14:32:24.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
      },
    ];
    const events: HearingEvent[] = [
      {
        id: 1,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
      {
        id: 2,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
      {
        id: 3,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
      },
    ];

    component.audio = audio;
    component.events = events;

    component.ngOnInit();

    const expectedTable: HearingAudioEventViewModel[] = [
      {
        id: 1,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        type: 'audio',
      },
      {
        id: 2,
        media_start_timestamp: '2022-07-31T14:32:24.620Z',
        media_end_timestamp: '2022-07-31T14:32:24.620Z',
        type: 'audio',
      },
      {
        id: 3,
        media_start_timestamp: '2023-07-31T14:32:24.620Z',
        media_end_timestamp: '2023-07-31T14:32:24.620Z',
        type: 'audio',
      },
      {
        id: 1,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
      {
        id: 2,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
      {
        id: 3,
        timestamp: '2023-07-31T14:32:24.620Z',
        name: 'Case called on',
        text: 'Record: New Case',
        type: 'event',
      },
    ];

    expect(component.table).toEqual(expectedTable);
  });

  it('should toggle row selection', () => {
    // Mock a row for testing
    const row: HearingAudioEventViewModel = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: 'audio',
    };

    // Call the toggleRowSelection method
    component.toggleRowSelection(row);

    // Expect the row to be in the selectedRows array
    expect(component.selectedRows).toContain(row);

    // Call the toggleRowSelection method again to deselect the row
    component.toggleRowSelection(row);

    // Expect the row to be removed from the selectedRows array
    expect(component.selectedRows).not.toContain(row);
  });

  it('should check if a row is selected', () => {
    // Mock a row for testing
    const row: HearingAudioEventViewModel = {
      id: 1,
      media_start_timestamp: '2023-07-31T14:32:24.620Z',
      media_end_timestamp: '2023-07-31T14:32:24.620Z',
      type: 'audio',
    };
    // Add the row to the selectedRows array
    component.selectedRows.push(row);

    // Call the isRowSelected method and expect it to return true
    expect(component.isRowSelected(row)).toBeTruthy();
  });
});
