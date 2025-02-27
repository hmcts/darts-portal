import { TestBed } from '@angular/core/testing';

import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { AudioFileMarkedDeletionData } from '@admin-types/file-deletion/audio-file-marked-deletion.interface';
import { AudioFileMarkedDeletion } from '@admin-types/file-deletion/audio-file-marked-deletion.type';
import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { FileHideData } from '@admin-types/hidden-reasons/file-hide-data.interface';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { FileDeletionService } from './file-deletion.service';

const mockTranscriptionDocuments: TranscriptionDocumentForDeletion[] = [
  {
    transcriptionDocumentId: 1,
    transcriptionId: 2,
    caseNumber: 'cn',
    hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    courthouse: 'ch',
    courtroom: 'cr',
    hiddenById: 3,
    comments: 'cm',
    ticketReference: 'tr',
    reasonId: 4,
  },
];

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
            getTranscriptionsMarkedForDeletion: jest.fn().mockReturnValue(of(mockTranscriptionDocuments)),
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
        media: [
          {
            id: 123,
            channel: 11,
            total_channels: 4,
            is_current: true,
            version_count: 1,
          },
          {
            id: 124,
            channel: 12,
            total_channels: 4,
            is_current: true,
            version_count: 1,
          },
        ],
        start_at: '2022-01-01T00:00:00.000Z',
        end_at: '2022-01-01T01:00:00.000Z',
        courthouse: { id: 1, display_name: 'Courthouse' },
        courtroom: { id: 1, name: 'Courtroom' },
        admin_action: {
          comments: ['Comments', 'Comments 1'],
          ticket_reference: 'Ticket Reference',
          reason_id: 2,
          hidden_by_id: 1,
        },
      };

      const expectedAudioFile: AudioFileMarkedDeletion = {
        media: [
          {
            id: 123,
            channel: 11,
            totalChannels: 4,
            isCurrent: true,
            versionCount: 1,
          },
          {
            id: 124,
            channel: 12,
            totalChannels: 4,
            isCurrent: true,
            versionCount: 1,
          },
        ],
        startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
        courthouse: 'Courthouse',
        courtroom: 'Courtroom',
        hiddenById: 1,
        comments: ['Comments', 'Comments 1'],
        ticketReference: 'Ticket Reference',
        reasonId: 2,
      };

      const result = service['mapMarkedAudioFiles'](audioFileData);

      expect(result).toEqual(expectedAudioFile);
    });
  });

  describe('getAudioFilesMarkedForDeletion', () => {
    it('should return an observable of marked audio files with additional information', () => {
      const mockAudioFiles: AudioFileMarkedDeletionData[] = [
        {
          media: [
            {
              id: 1,
              channel: 1,
              total_channels: 4,
              is_current: true,
              version_count: 1,
            },
            {
              id: 2,
              channel: 2,
              total_channels: 4,
              is_current: true,
              version_count: 1,
            },
          ],
          start_at: '2024-03-03T15:00:00Z',
          end_at: '2024-03-03T15:22:00Z',
          courthouse: {
            id: 0,
            display_name: 'Manchester',
          },
          courtroom: {
            id: 0,
            name: '11',
          },
          admin_action: {
            reason_id: 2,
            hidden_by_id: 5,
            ticket_reference: '122REF224',
            comments: ['Manchester audio file marked for deletion'],
          },
        },
      ];

      const expectedMappedAudioFiles = [
        {
          media: [
            {
              id: 1,
              channel: 1,
              totalChannels: 4,
              isCurrent: true,
              versionCount: 1,
            },
            {
              id: 2,
              channel: 2,
              totalChannels: 4,
              isCurrent: true,
              versionCount: 1,
            },
          ],
          startAt: DateTime.fromISO('2024-03-03T15:00:00.000Z'),
          endAt: DateTime.fromISO('2024-03-03T15:22:00.000Z'),
          courthouse: 'Manchester',
          courtroom: '11',
          hiddenById: 5,
          comments: ['Manchester audio file marked for deletion'],
          ticketReference: '122REF224',
          reasonId: 2,
          markedHiddenBy: 'System',
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

  describe('approveAudioFileDeletion', () => {
    it('should send a POST request to approve audio file deletion', () => {
      const mediaId = 123;
      const expectedUrl = '/api/admin/medias/123/approve-deletion';

      service.approveAudioFileDeletion(mediaId).subscribe();

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({});
    });

    it('should map the response correctly', () => {
      const mediaId = 123;
      const mockResponse: FileHideData = {
        id: 1,
        is_hidden: true,
        is_deleted: false,
        admin_action: {
          id: 1,
          reason_id: 2,
          hidden_by_id: 3,
          hidden_at: '2022-01-01T00:00:00.000Z',
          is_marked_for_manual_deletion: false,
          marked_for_manual_deletion_by_id: 4,
          marked_for_manual_deletion_at: '2022-01-01T00:00:00.000Z',
          ticket_reference: 'Ticket Reference',
          comments: 'Comments',
        },
      };
      const expectedResponse: FileHide = {
        id: 1,
        isHidden: true,
        isDeleted: false,
        adminAction: {
          id: 1,
          reasonId: 2,
          hiddenById: 3,
          hiddenAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
          isMarkedForManualDeletion: false,
          markedForManualDeletionById: 4,
          markedForManualDeletionAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
          ticketReference: 'Ticket Reference',
          comments: 'Comments',
        },
      };

      let approvalResponse: FileHide | undefined;
      service.approveAudioFileDeletion(mediaId).subscribe((response) => {
        approvalResponse = response;
      });

      const req = httpMock.expectOne('/api/admin/medias/123/approve-deletion');
      req.flush(mockResponse);

      expect(approvalResponse).toEqual(expectedResponse);
    });
  });

  describe('getTranscriptionDocumentsMarkedForDeletion', () => {
    it('gets data and resolves users and reasons', () => {
      const expectedMappedTranscriptionDocuments: TranscriptionDocumentForDeletion[] = [
        {
          transcriptionDocumentId: 1,
          transcriptionId: 2,
          caseNumber: 'cn',
          hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
          courthouse: 'ch',
          courtroom: 'cr',
          hiddenById: 3,
          comments: 'cm',
          ticketReference: 'tr',
          reasonId: 4,
          markedHiddenBy: 'John Doe',
          reasonName: 'Reason 4',
        },
      ];

      service.getTranscriptionDocumentsMarkedForDeletion().subscribe((transcriptions) => {
        expect(transcriptions).toEqual(expectedMappedTranscriptionDocuments);
      });
    });
  });
});
