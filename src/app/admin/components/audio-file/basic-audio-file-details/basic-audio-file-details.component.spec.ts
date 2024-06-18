import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFile } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { DateTime } from 'luxon';
import { BasicAudioFileDetailsComponent } from './basic-audio-file-details.component';

export const mockAudioFile: AudioFile = {
  id: 0,
  startAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
  endAt: DateTime.fromISO('2021-01-02T00:00:00.000Z'),
  channel: 0,
  totalChannels: 0,
  mediaType: '',
  mediaFormat: '',
  fileSizeBytes: 0,
  filename: '',
  mediaObjectId: '',
  contentObjectId: '',
  clipId: '',
  referenceId: '',
  checksum: '',
  mediaStatus: '',
  isHidden: false,
  isDeleted: false,
  adminAction: {
    id: 0,
    reasonId: 0,
    hiddenById: 0,
    hiddenByName: '',
    hiddenAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 0,
    markedForManualDeletionBy: '',
    markedForManualDeletionAt: DateTime.fromISO('2021-01-07T00:00:00.000Z'),
    ticketReference: '',
    comments: '',
  },
  version: '',
  chronicleId: '',
  antecedentId: '',
  retainUntil: DateTime.fromISO('2021-01-04T00:00:00.000Z'),
  createdAt: DateTime.fromISO('2021-01-05T00:00:00.000Z'),
  createdById: 0,
  lastModifiedAt: DateTime.fromISO('2021-01-06T00:00:00.000Z'),
  lastModifiedById: 0,
  courthouse: {
    id: 0,
    displayName: '',
  },
  courtroom: {
    id: 0,
    name: '',
  },
  hearings: [
    {
      id: 0,
      hearingDate: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
      caseId: 0,
    },
  ],
};

describe('BasicAudioFileDetailsComponent', () => {
  let component: BasicAudioFileDetailsComponent;
  let fixture: ComponentFixture<BasicAudioFileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicAudioFileDetailsComponent],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicAudioFileDetailsComponent);
    component = fixture.componentInstance;
    component.audioFile = mockAudioFile;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
