import { TestBed } from '@angular/core/testing';

import { AudioFileMarkedDeletionData } from '@admin-types/file-deletion/audio-file-marked-deletion.interface';
import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { FileDeletionService } from './file-deletion.service';

describe('FileDeletionService', () => {
  let service: FileDeletionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserAdminService,
          useValue: {
            getUsersById: jest.fn().mockReturnValue(
              of([
                { id: 1, fullName: 'John Doe' },
                { id: 2, fullName: 'Jane Doe' },
              ])
            ),
          },
        },
        {
          provide: TranscriptionAdminService,
          useValue: {
            getHiddenReasons: jest.fn().mockReturnValue(
              of([
                { id: 1, displayName: 'Reason 1' },
                { id: 2, displayName: 'Reason 2' },
              ])
            ),
          },
        },
        LuxonDatePipe,
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FileDeletionService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mapMarkedAudioFiles', () => {
    it('should map the audio file data correctly', () => {
      const audioFileData: AudioFileMarkedDeletionData = {
        media_id: 123,
        channel: 11,
        start_at: '2022-01-01T00:00:00.000Z',
        end_at: '2022-01-01T01:00:00.000Z',
        courthouse: { id: 1, display_name: 'Courthouse' },
        courtroom: { id: 1, name: 'Courtroom' },
        admin_action: {
          marked_for_manual_deletion_by_id: 3,
          comments: 'Comments',
          ticket_reference: 'Ticket Reference',
          reason_id: 2,
          id: 0,
          hidden_by_id: 1,
          hidden_at: '',
          is_marked_for_manual_deletion: false,
          marked_for_manual_deletion_at: '',
        },
      };

      const expectedAudioFile: AudioFileMarkedDeletion = {
        mediaId: 123,
        channel: 11,
        startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
        courthouse: 'Courthouse',
        courtroom: 'Courtroom',
        hiddenById: 1,
        markedById: 3,
        comments: 'Comments',
        ticketReference: 'Ticket Reference',
        reasonId: 2,
      };

      const result = service.mapMarkedAudioFiles(audioFileData);

      expect(result).toEqual(expectedAudioFile);
    });
  });

  describe('getAudioFilesMarkedForDeletion', () => {
    it('should return an observable of marked audio files with additional information', () => {
      const mockAudioFiles: AudioFileMarkedDeletionData[] = [
        {
          media_id: 123,
          channel: 11,
          start_at: '2022-01-01T00:00:00.000Z',
          end_at: '2022-01-01T01:00:00.000Z',
          courthouse: { id: 1, display_name: 'Courthouse' },
          courtroom: { id: 1, name: 'Courtroom' },
          admin_action: {
            marked_for_manual_deletion_by_id: 0,
            comments: 'Comments',
            ticket_reference: 'Ticket Reference',
            reason_id: 2,
            id: 0,
            hidden_by_id: 1,
            hidden_at: '',
            is_marked_for_manual_deletion: false,
            marked_for_manual_deletion_at: '',
          },
        },
      ];

      const expectedMappedAudioFiles = [
        {
          mediaId: 123,
          channel: 11,
          startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
          endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
          courthouse: 'Courthouse',
          courtroom: 'Courtroom',
          hiddenById: 1,
          markedById: 0,
          comments: 'Comments',
          ticketReference: 'Ticket Reference',
          reasonId: 2,
          markedByName: 'John Doe',
          reasonName: 'Reason 2',
        },
      ];

      let audioFiles: AudioFileMarkedDeletion[] = [];
      service.getAudioFilesMarkedForDeletion().subscribe((audios) => {
        audioFiles = audios;
      });

      const req = httpMock.expectOne('/api/admin/medias/marked-for-deletion');
      expect(req.request.method).toBe('GET');
      req.flush(mockAudioFiles);

      expect(audioFiles).toEqual(expectedMappedAudioFiles);
    });
  });
});
