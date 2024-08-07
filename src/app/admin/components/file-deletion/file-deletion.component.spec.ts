import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { FileDeletionComponent } from './file-deletion.component';

const audioFiles: AudioFileMarkedDeletion[] = [
  {
    mediaId: 1,
    channel: 2,
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse A',
    courtroom: 'Courtroom 1',
    markedById: 3,
    comments: 'Audio file marked for deletion',
    ticketReference: 'TICKET-001',
    reasonId: 4,
  },
  {
    mediaId: 5,
    channel: 6,
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse B',
    courtroom: 'Courtroom 2',
    markedById: 7,
    comments: 'Audio file marked for deletion',
    ticketReference: 'TICKET-002',
    reasonId: 8,
  },
  {
    mediaId: 9,
    channel: 10,
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: 'Courthouse C',
    courtroom: 'Courtroom 3',
    markedById: 11,
    comments: 'Audio file marked for deletion',
    ticketReference: 'TICKET-003',
    reasonId: 12,
  },
];

describe('FileDeletionComponent', () => {
  let component: FileDeletionComponent;
  let fixture: ComponentFixture<FileDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDeletionComponent],
      providers: [
        {
          provide: FileDeletionService,
          useValue: { getAudioFilesMarkedForDeletion: jest.fn().mockReturnValue(of(audioFiles)) },
        },
        LuxonDatePipe,
        DatePipe,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDeletionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch audio files marked for deletion', () => {
    fixture.detectChanges();

    expect(component.audioFiles()).toEqual(audioFiles);
    expect(component.audioCount()).toBe(audioFiles.length);
    expect(component.isLoading()).toBe(false);
  });
});
