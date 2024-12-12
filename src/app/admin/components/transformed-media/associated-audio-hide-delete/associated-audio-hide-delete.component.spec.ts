import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { AssociatedMedia } from '@admin-types/transformed-media/associated-media';
import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AssociatedAudioHideDeleteComponent } from './associated-audio-hide-delete.component';

describe('AssociatedAudioHideDeleteComponent', () => {
  let component: AssociatedAudioHideDeleteComponent;
  let fixture: ComponentFixture<AssociatedAudioHideDeleteComponent>;

  const mockMediaInput: AssociatedMedia[] = [
    {
      id: 0,
      channel: 0,
      startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      endAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      case: {
        id: 0,
        caseNumber: '',
      },
      hearing: {
        id: 0,
        hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      },
      courthouse: {
        id: 0,
        displayName: '',
      },
      courtroom: {
        id: 0,
        displayName: '',
      },
      isHidden: false,
      isCurrent: false,
      courthouseName: '',
      courtroomName: '',
    },
  ];

  const hideResponse: FileHide = {
    id: 0,
    isHidden: true,
    isDeleted: false,
    adminAction: {
      id: 0,
      reasonId: 5,
      hiddenById: 0,
      hiddenAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      isMarkedForManualDeletion: false,
      markedForManualDeletionById: 0,
      markedForManualDeletionAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
      ticketReference: '1234',
      comments: 'Comment',
    },
  };

  const transformedMediaService = { hideAudioFile: jest.fn().mockReturnValue(of(hideResponse)) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedAudioHideDeleteComponent],
      providers: [{ provide: TransformedMediaService, useValue: transformedMediaService }, provideRouter([]), DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedAudioHideDeleteComponent);
    fixture.componentRef.setInput('media', mockMediaInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location back when goBack is called', () => {
    const locationSpy = jest.spyOn(component.location, 'back');
    component.goBack();
    expect(locationSpy).toHaveBeenCalled();
  });

  it('should not hide audio files if the form is valid but no selected rows and includeSelectedFiles is true', () => {
    const hideAudioFileSpy = jest.spyOn(transformedMediaService, 'hideAudioFile');
    component.selectedRows.set([]);
    component.associatedAudioSubmit();
    expect(hideAudioFileSpy).not.toHaveBeenCalled();
  });

  it('should emit errors if the form is invalid', () => {
    const errorsEmitSpy = jest.spyOn(component.errors, 'emit');
    component.associatedAudioSubmit();
    expect(errorsEmitSpy).toHaveBeenCalled();
  });

  it('should hide audio files if the form is valid and includeSelectedFiles is true', () => {
    const successResponseSpy = jest.spyOn(component.successResponse, 'emit');
    const selectedIds = [1, 2, 3];
    const responses = selectedIds.map((id) => {
      return { id, isHidden: true };
    });
    const hideAudioFileSpy = jest.spyOn(transformedMediaService, 'hideAudioFile');
    hideAudioFileSpy.mockReturnValue(of(responses));
    component.selectedRows.set([
      {
        id: 4,
        courthouseName: 'Manchester',
        startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        courtroomName: '6',
        channel: 3,
        isHidden: false,
        case: {
          id: 0,
          caseNumber: '',
        },
        hearing: {
          id: 0,
          hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        },
        courthouse: {
          id: 0,
          displayName: '',
        },
        courtroom: {
          id: 0,
          displayName: '',
        },
        isCurrent: false,
      },
      {
        id: 5,
        courthouseName: 'Manchester',
        startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        courtroomName: '6',
        channel: 3,
        isHidden: false,
        case: {
          id: 0,
          caseNumber: '',
        },
        hearing: {
          id: 0,
          hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        },
        courthouse: {
          id: 0,
          displayName: '',
        },
        courtroom: {
          id: 0,
          displayName: '',
        },
        isCurrent: false,
      },
    ]);
    component.associatedAudioSubmit();
    expect(component.isSubmitted()).toBe(false);
    expect(hideAudioFileSpy).toHaveBeenCalledWith(4, component.fileFormValues);
    expect(hideAudioFileSpy).toHaveBeenCalledWith(5, component.fileFormValues);
    expect(successResponseSpy).toHaveBeenCalledWith(true);
  });
});
