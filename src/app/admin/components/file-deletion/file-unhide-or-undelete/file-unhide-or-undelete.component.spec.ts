import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Navigation, provideRouter, Router } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { FileUnhideOrUndeleteComponent } from './file-unhide-or-undelete.component';

let router: Router;
const dateTime = DateTime.fromISO('2024-07-04T11:24:12.101+01:00');
const media: AssociatedMedia[] = [
  {
    id: 100,
    channel: 0,
    startAt: dateTime,
    endAt: dateTime,
    case: {
      id: 100,
      caseNumber: 'case number',
    },
    hearing: {
      id: 100,
      hearingDate: dateTime,
    },
    courthouse: {
      id: 100,
      displayName: 'display name',
    },
    courtroom: {
      id: 100,
      displayName: 'display name',
    },
    isHidden: false,
    isCurrent: false,
    courthouseName: 'courthouse name',
    courtroomName: 'courtroom name',
  },
  {
    id: 101,
    channel: 0,
    startAt: dateTime,
    endAt: dateTime,
    case: {
      id: 101,
      caseNumber: 'case number',
    },
    hearing: {
      id: 101,
      hearingDate: dateTime,
    },
    courthouse: {
      id: 101,
      displayName: 'display name',
    },
    courtroom: {
      id: 101,
      displayName: 'display name',
    },
    isHidden: false,
    isCurrent: false,
    courthouseName: 'courthouse name',
    courtroomName: 'courtroom name',
  },
];

const fileHide = {
  id: 100,
  isHidden: false,
  isDeleted: false,
  adminAction: {
    id: 0,
    reasonId: 0,
    hiddenById: 99,
    hiddenAt: dateTime,
    isMarkedForManualDeletion: false,
    markedForManualDeletionById: 99,
    markedForManualDeletionAt: dateTime,
    ticketReference: 'refy ref',
    comments: 'commenty comment',
  },
};

describe('FileUnhideOrUndeleteComponent', () => {
  let component: FileUnhideOrUndeleteComponent;
  let fixture: ComponentFixture<FileUnhideOrUndeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUnhideOrUndeleteComponent],
      providers: [
        DatePipe,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 100 } } } },
        {
          provide: HeaderService,
          useValue: {
            hideNavigation: jest.fn(),
          },
        },
        {
          provide: TransformedMediaService,
          useValue: {
            unhideAudioFile: jest.fn().mockReturnValue(of(fileHide)),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { media: media } } } as unknown as Navigation);

    fixture = TestBed.createComponent(FileUnhideOrUndeleteComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should initialize media from router state', () => {
    expect(component.media).toEqual(media);
  });

  it('should hide navigation on init', () => {
    const headerService = TestBed.inject(HeaderService);
    expect(headerService.hideNavigation).toHaveBeenCalled();
  });

  it('should handle selection confirmation', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const transformedMediaSpy = jest.spyOn(component.transformedMediaService, 'unhideAudioFile');

    const selectedIds = [100, 101];
    component.onSelectionConfirmed(selectedIds);

    expect(transformedMediaSpy).toHaveBeenCalledTimes(2);
    expect(transformedMediaSpy).toHaveBeenCalledWith(100);
    expect(transformedMediaSpy).toHaveBeenCalledWith(101);

    expect(routerSpy).toHaveBeenCalledWith(['../../'], {
      relativeTo: component.route,
      queryParams: { unhiddenOrUnmarkedForDeletion: true, backUrl: null },
    });
  });
});
