import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AdminSearchService } from '@services/admin-search/admin-search.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { of } from 'rxjs';
import { FileHideOrDeleteComponent } from './file-hide-or-delete.component';

describe('FileHideOrDeleteComponent', () => {
  let component: FileHideOrDeleteComponent;
  let fixture: ComponentFixture<FileHideOrDeleteComponent>;

  const hiddenReasons = [
    {
      id: 1,
      reason: 'PUBLIC_INTEREST_IMMUNITY',
      displayName: 'Public interest immunity',
      displayState: true,
      displayOrder: 0,
      markedForDeletion: true,
    },
    {
      id: 3,
      reason: 'OTHER_REASON_TO_DELETE',
      displayName: 'Other reason to delete',
      displayState: true,
      displayOrder: 2,
      markedForDeletion: true,
    },
    {
      id: 4,
      reason: 'FAKE_REASON_DO_NOT_DISPLAY',
      displayName: 'Do not display',
      displayState: false,
      displayOrder: 4,
      markedForDeletion: false,
    },
    {
      id: 5,
      reason: 'OTHER_REASON_TO_HIDE',
      displayName: 'Other reason to hide only',
      displayState: true,
      displayOrder: 3,
      markedForDeletion: false,
    },
  ];

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        id: 1,
      },
    },
  } as unknown as ActivatedRoute;

  const fakeRouter = {
    getCurrentNavigation: jest.fn().mockReturnValue({
      extras: {
        state: {
          fileType: 'transcription_document',
          hearingIds: [12322, 1232],
          dates: { startAt: '2021-01-01T00:00:00Z', endAt: '2021-01-01T00:00:00Z' },
        },
      },
    }),
    navigate: jest.fn(),
  } as unknown as Router;

  const fakeTranscriptionAdminService = {
    hideTranscriptionDocument: jest.fn().mockReturnValue(of({})),
    getHiddenReasons: jest.fn().mockReturnValue(of(hiddenReasons)),
  } as unknown as TranscriptionAdminService;

  const fakeTransformedMediaService = {
    checkAssociatedAudioExists: jest.fn().mockReturnValue(
      of({
        exists: true,
        media: [{ id: 2 }, { id: 3 }] as AssociatedMedia[],
        audioFile: [{ id: 1 }] as AssociatedMedia[],
      })
    ),
    hideAudioFile: jest.fn().mockReturnValue(of({} as FileHide)),
  } as unknown as TransformedMediaService;

  const fakeAdminSearchService = {
    fetchNewAudio: {
      set: jest.fn(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileHideOrDeleteComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: TranscriptionAdminService, useValue: fakeTranscriptionAdminService },
        { provide: TransformedMediaService, useValue: fakeTransformedMediaService },
        { provide: AdminSearchService, useValue: fakeAdminSearchService },
        { provide: Router, useValue: fakeRouter },
        DatePipe,
        LuxonDatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileHideOrDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call hideTranscriptionDocument when form is invalid', () => {
    component.form.reset();

    const hideTranscriptionDocumentSpy = jest.spyOn(fakeTranscriptionAdminService, 'hideTranscriptionDocument');

    component.onSubmit();

    expect(hideTranscriptionDocumentSpy).not.toHaveBeenCalled();
  });

  it('should mark form as touched and call hideTranscriptionDocument when form is valid', () => {
    component.form.markAllAsTouched();
    component.form.setValue({
      ticketReference: 'ABC123',
      comments: 'Test comments',
      reason: '1',
    });

    const hideTranscriptionDocumentSpy = jest.spyOn(fakeTranscriptionAdminService, 'hideTranscriptionDocument');
    const markAllAsTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');

    component.onSubmit();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(hideTranscriptionDocumentSpy).toHaveBeenCalledWith(component.id, {
      ...component.form.value,
      reason: Number(component.form.value.reason),
    });
  });

  it('should call location back when goBack is called', () => {
    component.fileType = 'transcription_document';

    const locationSpy = jest.spyOn(component.location, 'back');

    component.goBack();

    expect(locationSpy).toHaveBeenCalled();
  });

  it('should return media with matching id', () => {
    const media = [{ id: 1 }, { id: 2 }, { id: 3 }] as Partial<AssociatedMedia[]>;
    component.id = 2;
    const results = component.getMediaById(media as AssociatedMedia[]);

    expect(results).toEqual([{ id: 2 }]);
  });

  it('should return an empty array if no media with matching id', () => {
    const media = [{ id: 1 }, { id: 2 }, { id: 3 }] as Partial<AssociatedMedia[]>;
    component.id = 4;
    const results = component.getMediaById(media as AssociatedMedia[]);

    expect(results).toEqual([]);
  });

  it('should show associated audio files if they exist', () => {
    component.associatedAudioSearch = {
      hearingIds: [12322, 1232],
      startAt: '2021-01-01T00:00:00Z',
      endAt: '2021-01-01T00:00:00Z',
    };
    component.fileType = 'audio_file';
    component.form.markAllAsTouched();
    component.form.setValue({
      ticketReference: 'ABC123',
      comments: 'Test comments',
      reason: '1',
    });

    const checkAssociatedAudioExistsSpy = jest.spyOn(fakeTransformedMediaService, 'checkAssociatedAudioExists');

    component.onSubmit();

    expect(component.media).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(checkAssociatedAudioExistsSpy).toHaveBeenCalledWith(
      component.id,
      component.associatedAudioSearch.hearingIds,
      component.associatedAudioSearch.startAt,
      component.associatedAudioSearch.endAt
    );
    expect(component.isSubmitted()).toBe(true);
    expect(component.isAssociatedAudio()).toBe(true);
  });

  it('should set fetchNewAudio to true when hiding an audio file with no associated audio', () => {
    component.fileType = 'audio_file';
    component.associatedAudioSearch = {
      hearingIds: [12322, 1232],
      startAt: '2021-01-01T00:00:00Z',
      endAt: '2021-01-01T00:00:00Z',
    };

    const formData = {
      ticketReference: 'ABC123',
      comments: 'Some comments',
      reason: '1',
    };

    component.form.setValue(formData);

    const expectedFormValues = {
      ...formData,
      reason: 1,
    };

    jest.spyOn(fakeTransformedMediaService, 'checkAssociatedAudioExists').mockReturnValue(
      of({
        exists: false,
        audioFile: [],
        media: [],
      })
    );

    const hideAudioSpy = jest.spyOn(fakeTransformedMediaService, 'hideAudioFile').mockReturnValue(of({} as FileHide));

    component.onSubmit();

    expect(hideAudioSpy).toHaveBeenCalledWith(component.id, expectedFormValues);
    expect(fakeAdminSearchService.fetchNewAudio.set).toHaveBeenCalledWith(true);
  });
});
