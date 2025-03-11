import { HearingAudioData } from '@admin-types/hearing/hearing-audio.interface';
import { HearingAudio } from '@admin-types/hearing/hearing-audio.type';
import { AdminHearingEventData } from '@admin-types/hearing/hearing-events.interface';
import { AdminHearingEvent } from '@admin-types/hearing/hearing-events.type';
import { AdminHearingData } from '@admin-types/hearing/hearing.interface';
import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';
import { AdminHearingService } from './admin-hearing.service';

describe('AdminHearingService', () => {
  let service: AdminHearingService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [AdminHearingService, { provide: HttpClient, useValue: mockHttpClient }],
    });

    service = TestBed.inject(AdminHearingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHearing', () => {
    it('should fetch hearing data and map it correctly', (done) => {
      const mockHearingData: AdminHearingData = {
        id: 1,
        hearing_date: '2025-01-23',
        scheduled_start_time: '08:00:00',
        hearing_is_actual: true,
        case: {
          id: 1,
          case_number: 'CASE1001',
          courthouse: {
            id: 1001,
            display_name: 'SWANSEA',
          },
          defendants: ['Joe Bloggs'],
          prosecutors: ['Mrs Prosecutor'],
          defenders: ['Mr Defender'],
          judges: ['Mr Judge'],
          case_object_id: '',
          case_status: '',
          created_at: '',
          created_by: 0,
          last_modified_at: '',
          last_modified_by: 0,
          is_deleted: false,
          is_data_anonymised: false,
          is_interpreter_used: false,
        },
        courtroom: {
          id: 2,
          name: 'Courtroom 5',
        },
        judges: ['Mr Judge'],
        created_at: '2024-01-01T00:00:00Z',
        created_by: 101,
        last_modified_at: '2024-02-01T00:00:00Z',
        last_modified_by: 102,
      };

      const expectedMappedHearing: AdminHearing = {
        id: 1,
        hearingDate: DateTime.fromISO('2025-01-23'),
        scheduledStartTime: '08:00:00',
        hearingIsActual: true,
        case: {
          id: 1,
          caseNumber: 'CASE1001',
          courthouse: {
            id: 1001,
            displayName: 'SWANSEA',
          },
          defendants: ['Joe Bloggs'],
          prosecutors: ['Mrs Prosecutor'],
          defenders: ['Mr Defender'],
          judges: ['Mr Judge'],
        },
        courtroom: {
          id: 2,
          name: 'Courtroom 5',
        },
        judges: ['Mr Judge'],
        createdAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
        createdById: 101,
        lastModifiedAt: DateTime.fromISO('2024-02-01T00:00:00Z'),
        lastModifiedById: 102,
      };

      mockHttpClient.get.mockReturnValue(of(mockHearingData));

      service.getHearing(1).subscribe((hearing) => {
        expect(hearing).toEqual(expectedMappedHearing);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/admin/hearings/1');
        done();
      });
    });
  });

  describe('getHearingAudios', () => {
    it('should fetch hearing audios and map them correctly', (done) => {
      const mockAudioData: HearingAudioData[] = [
        {
          id: 1,
          start_at: '2025-01-23T08:00:00Z',
          end_at: '2025-01-23T09:00:00Z',
          filename: 'audio1.mp3',
          channel: 1,
          total_channels: 2,
        },
      ];

      const expectedMappedAudios: HearingAudio[] = [
        {
          id: 1,
          startAt: DateTime.fromISO('2025-01-23T08:00:00Z'),
          endAt: DateTime.fromISO('2025-01-23T09:00:00Z'),
          filename: 'audio1.mp3',
          channel: 1,
          totalChannels: 2,
        },
      ];

      mockHttpClient.get.mockReturnValue(of(mockAudioData));

      service.getHearingAudios(1).subscribe((audios) => {
        expect(audios).toEqual(expectedMappedAudios);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/admin/hearings/1/audios');
        done();
      });
    });
  });

  describe('getEvents', () => {
    it('should fetch hearing events and map them correctly', (done) => {
      const mockEventData: AdminHearingEventData[] = [
        {
          id: 1,
          timestamp: '2025-01-23T09:30:00Z',
          name: 'Event 1',
        },
      ];

      const expectedMappedEvents: AdminHearingEvent[] = [
        {
          id: 1,
          timestamp: DateTime.fromISO('2025-01-23T09:30:00Z'),
          name: 'Event 1',
        },
      ];

      mockHttpClient.get.mockReturnValue(of(mockEventData));

      service.getEvents(1).subscribe((events) => {
        expect(events).toEqual(expectedMappedEvents);
        expect(mockHttpClient.get).toHaveBeenCalledWith('api/hearings/1/events');
        done();
      });
    });

    it('should return an empty array if the API returns a 404 error', (done) => {
      mockHttpClient.get.mockReturnValue(throwError(() => ({ status: 404 })));

      service.getEvents(1).subscribe((events) => {
        expect(events).toEqual([]);
        done();
      });
    });

    it('should throw an error if API call fails with non-404 status', (done) => {
      const errorResponse = { status: 500, message: 'Internal Server Error' };
      mockHttpClient.get.mockReturnValue(throwError(() => errorResponse));

      service.getEvents(1).subscribe({
        next: () => fail('Should have thrown an error'),
        error: (error) => {
          expect(error).toEqual(errorResponse);
          done();
        },
      });
    });
  });
});
