import { HearingAudio } from '@admin-types/hearing/hearing-audio.type';
import { AdminHearingEvent } from '@admin-types/hearing/hearing-events.type';
import { AdminHearing } from '@admin-types/hearing/hearing.type';
import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Transcript } from '@portal-types/transcriptions';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { AdminHearingService } from '@services/admin-hearing/admin-hearing.service';
import { CaseService } from '@services/case/case.service';
import { HistoryService } from '@services/history/history.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { HearingComponent } from './hearing.component';

describe('HearingComponent', () => {
  let component: HearingComponent;
  let fixture: ComponentFixture<HearingComponent>;
  let mockAdminHearingService: jest.Mocked<AdminHearingService>;
  let mockUserAdminService: jest.Mocked<UserAdminService>;
  let mockActiveTabService: jest.Mocked<ActiveTabService>;
  let mockCaseService: jest.Mocked<CaseService>;

  const mockHearing: AdminHearing = {
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
    createdBy: 'Alice Johnson',
    lastModifiedAt: DateTime.fromISO('2024-02-01T00:00:00Z'),
    lastModifiedById: 102,
    lastModifiedBy: 'Bob Smith',
  };

  const mockAudios: HearingAudio[] = [
    {
      id: 1,
      filename: 'audio1.mp3',
      startAt: DateTime.fromISO('2025-01-21T08:00:00Z'),
      endAt: DateTime.fromISO('2025-01-21T09:00:00Z'),
      totalChannels: 3,
      channel: 5,
    },
  ];

  const mockEvents: AdminHearingEvent[] = [
    { id: 1, name: 'Event 1', timestamp: DateTime.fromISO('2025-01-23T09:30:00Z') },
  ];

  const mockTranscripts: Transcript[] = [
    {
      id: 1,
      type: 'Sentencing Remarks',
      requestedByName: 'Joe Bloggs',
      requestedOn: DateTime.fromISO('2024-01-01'),
      status: 'Requested',
      hearingId: 2,
      hearingDate: DateTime.fromISO('2025-01-23'),
    },
  ];

  beforeEach(async () => {
    mockAdminHearingService = {
      getHearing: jest.fn().mockReturnValue(of(mockHearing)),
      getHearingAudios: jest.fn().mockReturnValue(of(mockAudios)),
      getEvents: jest.fn().mockReturnValue(of(mockEvents)),
    } as unknown as jest.Mocked<AdminHearingService>;

    mockUserAdminService = {
      getUsersById: jest.fn().mockReturnValue(
        of([
          { id: 101, fullName: 'Alice Johnson' },
          { id: 102, fullName: 'Bob Smith' },
        ])
      ),
    } as unknown as jest.Mocked<UserAdminService>;

    mockActiveTabService = {
      setActiveTab: jest.fn(),
      activeTabs: jest.fn().mockReturnValue({}),
    } as unknown as jest.Mocked<ActiveTabService>;

    mockCaseService = {
      getHearingTranscripts: jest.fn().mockReturnValue(of(mockTranscripts)),
    } as unknown as jest.Mocked<CaseService>;

    await TestBed.configureTestingModule({
      imports: [HearingComponent],
      providers: [
        provideRouter([]),
        { provide: AdminHearingService, useValue: mockAdminHearingService },
        { provide: UserAdminService, useValue: mockUserAdminService },
        { provide: ActiveTabService, useValue: mockActiveTabService },
        { provide: CaseService, useValue: mockCaseService },
        { provide: HistoryService, useValue: { getBackUrl: jest.fn() } },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize hearing$ with mapped user names', (done) => {
      component.hearing$.subscribe((hearing) => {
        expect(hearing).toEqual(mockHearing);
        expect(mockAdminHearingService.getHearing).toHaveBeenCalled();
        expect(mockUserAdminService.getUsersById).toHaveBeenCalled();
        done();
      });
    });

    it('should initialize audios$', (done) => {
      component.audios$.subscribe((audios) => {
        expect(audios).toEqual(mockAudios);
        expect(mockAdminHearingService.getHearingAudios).toHaveBeenCalled();
        done();
      });
    });

    it('should initialize events$', (done) => {
      component.events$.subscribe((events) => {
        expect(events).toEqual(mockEvents);
        expect(mockAdminHearingService.getEvents).toHaveBeenCalled();
        done();
      });
    });

    it('should initialize transcripts$', (done) => {
      component.transcripts$.subscribe((transcripts) => {
        expect(transcripts).toEqual(mockTranscripts);
        expect(mockCaseService.getHearingTranscripts).toHaveBeenCalled();
        done();
      });
    });

    it('should initialize data$', (done) => {
      component.data$.subscribe((data) => {
        expect(data).toEqual({
          hearing: mockHearing,
          audios: mockAudios,
          events: mockEvents,
          transcripts: mockTranscripts,
        });
        done();
      });
    });
  });

  describe('onTabChange', () => {
    it('should update the active tab in ActiveTabService', () => {
      component.onTabChange('Events');
      expect(mockActiveTabService.setActiveTab).toHaveBeenCalledWith('admin-hearing-details', 'Events');
    });
  });
});
