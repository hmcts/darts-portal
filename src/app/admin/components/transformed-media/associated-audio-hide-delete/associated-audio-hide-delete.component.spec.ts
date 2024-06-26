import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AssociatedAudioHideDeleteComponent } from './associated-audio-hide-delete.component';

describe('AssociatedAudioHideDeleteComponent', () => {
  let component: AssociatedAudioHideDeleteComponent;
  let fixture: ComponentFixture<AssociatedAudioHideDeleteComponent>;

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
      providers: [{ provide: TransformedMediaService, useValue: transformedMediaService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociatedAudioHideDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when goBack is called', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const id = 123;
    component.id = id;

    component.goBack();

    expect(routerSpy).toHaveBeenCalledWith(['/admin/audio-file', id]);
  });

  it('should not hide audio files if the form is valid but no selected rows and includeSelectedFiles is true', () => {
    const hideAudioFileSpy = jest.spyOn(transformedMediaService, 'hideAudioFile');
    component.form.setValue({ selectedFileChoice: 'true' });
    component.selectedRows = [];
    component.associatedAudioSubmit();
    expect(hideAudioFileSpy).not.toHaveBeenCalled();
  });

  it('should emit errors if the form is invalid', () => {
    const errorsEmitSpy = jest.spyOn(component.errors, 'emit');
    component.form.setValue({ selectedFileChoice: '' });
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
    component.form.setValue({ selectedFileChoice: 'true' });
    component.selectedRows = [
      {
        audioId: 4,
        caseId: 1,
        caseNumber: '123',
        hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        hearingId: 0,
        courthouse: 'Manchester',
        startTime: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endTime: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        courtroom: '6',
        channelNumber: 3,
      },
      {
        audioId: 5,
        caseId: 1,
        caseNumber: '124',
        hearingDate: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        hearingId: 0,
        courthouse: 'Reading',
        startTime: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        endTime: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
        courtroom: '11',
        channelNumber: 2,
      },
    ];
    component.associatedAudioSubmit();
    expect(component.isSubmitted).toBe(false);
    expect(hideAudioFileSpy).toHaveBeenCalledWith(4, component.fileFormValues);
    expect(hideAudioFileSpy).toHaveBeenCalledWith(5, component.fileFormValues);
    expect(hideAudioFileSpy).toHaveBeenCalledWith(component.id, component.fileFormValues);
    expect(successResponseSpy).toHaveBeenCalledWith(true);
  });

  it('should hide audio file if the form is valid and includeSelectedFiles is false', () => {
    const hideAudioFileSpy = jest.spyOn(transformedMediaService, 'hideAudioFile');
    hideAudioFileSpy.mockReturnValue(of({ id: component.id, isHidden: true }));
    component.form.setValue({ selectedFileChoice: 'false' });
    component.associatedAudioSubmit();
    expect(hideAudioFileSpy).toHaveBeenCalledWith(component.id, component.fileFormValues);
  });
});
