import { AudioFile } from '@admin-types/index';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation, provideRouter, Router } from '@angular/router';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { SetCurrentVersionComponent } from './set-current-version.component';

describe('SetCurrentVersionComponent', () => {
  let component: SetCurrentVersionComponent;
  let fixture: ComponentFixture<SetCurrentVersionComponent>;
  let router: Router;
  let routerNavigateSpy: jest.SpyInstance;
  let mockTransformedMediaService: Partial<TransformedMediaService>;

  const mockAudio: AudioFile = {
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
    cases: [
      {
        id: 1,
        courthouse: {
          id: 1,
          displayName: 'Courthouse A',
        },
        caseNumber: 'CASE123',
        source: 'Source A',
      },
    ],
    hearings: [
      {
        id: 1,
        hearingDate: DateTime.fromISO('2021-01-03T00:00:00.000Z'),
        caseId: 1,
        caseNumber: 'CASE123',
        courthouse: {
          id: 1,
          displayName: 'Courthouse A',
        },
        courtroom: {
          id: 1,
          name: 'Courtroom 1',
        },
      },
    ],
  };

  beforeEach(async () => {
    mockTransformedMediaService = {
      getMediaById: jest.fn().mockReturnValue(of(mockAudio)),
      setCurrentVersion: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [SetCurrentVersionComponent],
      providers: [
        {
          provide: TransformedMediaService,
          useValue: mockTransformedMediaService as TransformedMediaService,
        },
        DatePipe,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetCurrentVersionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { selectedAudioId: 1 } } } as unknown as Navigation);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should navigate away on ngOnInit if selectedAudioId is missing', () => {
    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({} as unknown as Navigation);
    fixture.detectChanges();

    component.ngOnInit();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: expect.anything() });
  });
});
