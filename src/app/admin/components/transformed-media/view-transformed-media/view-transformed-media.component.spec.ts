import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@admin-types/index';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { TransformedMediaAdmin } from '@admin-types/transformed-media/transformed-media-admin';
import { TransformedMediaRequest } from '@admin-types/transformed-media/transformed-media-request';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Case } from '@portal-types/index';
import { CaseService } from '@services/case/case.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ViewTransformedMediaComponent } from './view-transformed-media.component';

const mockUsers: User[] = [
  { id: 1, fullName: 'Dean', emailAddress: 'dean@local.com' } as User,
  { id: 2, fullName: 'Dave', emailAddress: 'dave@local.com' } as User,
];
const mockCase: Case = { id: 1, caseNumber: 'case-number' } as unknown as Case;
const mockTransformedMedia: TransformedMediaAdmin = {
  id: 1,
  fileName: 'file-name',
  fileFormat: 'file-format',
  fileSizeBytes: 1234,
  mediaRequest: {
    id: 1,
    requestedAt: DateTime.fromISO('2020-01-01'),
    ownerUserId: 1,
    requestedByUserId: 2,
  },
  case: {
    id: 1,
    caseNumber: 'case-number',
  },
  courthouse: {
    id: 1,
    displayName: 'courthouse',
  },
  hearing: {
    id: 1,
    hearingDate: DateTime.fromISO('2020-01-01'),
  },
  lastAccessedAt: DateTime.fromISO('2020-01-01'),
};

const mockAssociatedMedia: AssociatedMedia[] = [
  {
    id: 1,
    channel: 1,
    startAt: DateTime.fromISO('2020-01-01T01:00:00Z'),
    endAt: DateTime.fromISO('2020-01-01T02:00:00Z'),
    case: {
      id: 1,
      caseNumber: 'case-number',
    },
    hearing: {
      id: 1,
      hearingDate: DateTime.fromISO('2020-01-01'),
    },
    courthouse: {
      id: 1,
      displayName: 'courthouse',
    },
    courtroom: {
      id: 1,
      name: 'courtroom',
    },
  },
];

const mockMediaRequest: TransformedMediaRequest = {
  id: 1,
  startAt: DateTime.fromISO('2020-01-01T01:00:00Z'),
  endAt: DateTime.fromISO('2020-01-01T02:00:00Z'),
  requestedAt: DateTime.fromISO('2020-01-01T01:00:00Z'),
  hearing: {
    id: 1,
    hearingDate: DateTime.fromISO('2020-01-01'),
  },
  courtroom: {
    id: 1,
    name: '',
  },
  requestedById: 1,
  ownerId: 2,
};

describe('ViewTransformedMediaComponent', () => {
  let component: ViewTransformedMediaComponent;
  let fixture: ComponentFixture<ViewTransformedMediaComponent>;
  let fakeTransformedMediaService!: Partial<TransformedMediaService>;
  let fakeCaseService!: Partial<CaseService>;
  let fakeUserAdminService!: Partial<UserAdminService>;
  let fakeActivatedRoute!: Partial<ActivatedRoute>;

  beforeEach(async () => {
    fakeTransformedMediaService = {
      getTransformedMediaById: jest.fn().mockReturnValue(of(mockTransformedMedia)),
      getAssociatedMediaByTransformedMediaId: jest.fn().mockReturnValue(of(mockAssociatedMedia)),
      getMediaRequestById: jest.fn().mockReturnValue(of(mockMediaRequest)),
    };

    fakeCaseService = {
      getCase: jest.fn().mockReturnValue(of(mockCase)),
    };

    fakeUserAdminService = {
      getUsersById: jest.fn().mockReturnValue(of(mockUsers)),
    };

    fakeActivatedRoute = {
      snapshot: {
        params: {
          id: 1,
        },
      },
      queryParams: of(null),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [ViewTransformedMediaComponent],
      providers: [
        { provide: TransformedMediaService, useValue: fakeTransformedMediaService },
        { provide: CaseService, useValue: fakeCaseService },
        { provide: UserAdminService, useValue: fakeUserAdminService },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTransformedMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data$ stream', () => {
    it('call service methods', () => {
      const getTransformedMediaByIdSpy = jest.spyOn(fakeTransformedMediaService, 'getTransformedMediaById');
      const getAssociatedMediaByTransformedMediaIdSpy = jest.spyOn(
        fakeTransformedMediaService,
        'getAssociatedMediaByTransformedMediaId'
      );
      const getCaseSpy = jest.spyOn(fakeCaseService, 'getCase');
      const getUsersByIdSpy = jest.spyOn(fakeUserAdminService, 'getUsersById');

      component.data$.subscribe();

      expect(getTransformedMediaByIdSpy).toHaveBeenCalledWith(1);
      expect(getAssociatedMediaByTransformedMediaIdSpy).toHaveBeenCalledWith(1);
      expect(getCaseSpy).toHaveBeenCalledWith(1);
      expect(getUsersByIdSpy).toHaveBeenCalledWith([1, 2]);
    });

    it('should return view model containing mapped transformedMedia, associatedAudioRows, mediaRequest, case and users', () => {
      let streamResult = {};

      component.data$.subscribe((data) => (streamResult = data));

      const expectedAssociatedAudioRows = [
        {
          audioId: 1,
          caseId: 1,
          hearingDate: DateTime.fromISO('2020-01-01'),
          courthouse: 'courthouse',
          startTime: DateTime.fromISO('2020-01-01T01:00:00Z'),
          endTime: DateTime.fromISO('2020-01-01T02:00:00Z'),
          courtroom: 'courtroom',
          channelNumber: 1,
        },
      ];

      expect(streamResult).toEqual({
        transformedMedia: mockTransformedMedia,
        associatedAudioRows: expectedAssociatedAudioRows,
        mediaRequest: mockMediaRequest,
        case: mockCase,
        users: { owner: mockUsers[0], requestedBy: mockUsers[1] },
      });
    });
  });
});
