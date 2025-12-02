import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { TranscriptionService } from '@services/transcription/transcription.service';

import { ChangeTranscriptStatusComponent } from './change-transcript-status.component';

describe('ChangeTranscriptStatusComponent', () => {
  let component: ChangeTranscriptStatusComponent;
  let fixture: ComponentFixture<ChangeTranscriptStatusComponent>;

  const headerServiceMock = {
    hideNavigation: jest.fn(),
  };

  const transcriptionAdminServiceMock = {
    updateTranscriptionStatus: jest.fn().mockReturnValue(of({})),
    getTranscriptionStatuses: jest.fn(),
    getAllowableTranscriptionStatuses: jest.fn().mockReturnValue(of([])),
    fetchNewTranscriptions: { set: jest.fn() },
  };

  const transcriptionServiceMock = {
    unfulfillTranscriptionRequest: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeTranscriptStatusComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { transcriptionId: 1 },
              queryParams: { status: 'With Transcriber', manual: 'true' },
            },
          },
        },
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: TranscriptionAdminService, useValue: transcriptionAdminServiceMock },
        { provide: TranscriptionService, useValue: transcriptionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeTranscriptStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides navigation on init', () => {
    expect(headerServiceMock.hideNavigation).toHaveBeenCalled();
  });

  it('requests allowable statuses with correct args', () => {
    expect(transcriptionAdminServiceMock.getAllowableTranscriptionStatuses).toHaveBeenCalledWith(
      'With Transcriber',
      true
    );
  });

  describe('non-unfulfilled submit path', () => {
    it('calls updateTranscriptionStatus with id, status, and comments', () => {
      const spy = jest.spyOn(transcriptionAdminServiceMock, 'updateTranscriptionStatus');

      component.form.controls.status.setValue('2');
      component.form.controls.comments.setValue('commented');

      component.onSubmit();

      expect(spy).toHaveBeenCalledWith(1, 2, 'commented');
    });

    it('navigates to the transcript and flags fetchNewTranscriptions', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const fetchNewSpy = jest.spyOn(transcriptionAdminServiceMock.fetchNewTranscriptions, 'set');

      component.form.controls.status.setValue('2');
      component.form.controls.comments.setValue('Some comment');

      component.onSubmit();

      expect(fetchNewSpy).toHaveBeenCalledWith(true);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/transcripts', 1], { queryParams: { updatedStatus: true } });
    });
  });

  describe('unfulfilled submit path', () => {
    const UNFULFILLED_STATUS = '8';

    it('does not submit when unfulfilled reason/details missing', () => {
      const unfulfillSpy = jest.spyOn(transcriptionServiceMock, 'unfulfillTranscriptionRequest');

      component.form.controls.status.setValue(UNFULFILLED_STATUS);
      component.reasonControl.setValue('');
      component.detailsControl.setValue('');

      component.onSubmit();

      expect(unfulfillSpy).not.toHaveBeenCalled();
      expect(component.errors.length).toBeGreaterThan(0);
    });

    it('submits when reason is not "other" (details optional) and navigates', () => {
      const unfulfillSpy = jest.spyOn(transcriptionServiceMock, 'unfulfillTranscriptionRequest');
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const fetchNewSpy = jest.spyOn(transcriptionAdminServiceMock.fetchNewTranscriptions, 'set');

      component.form.controls.status.setValue(UNFULFILLED_STATUS);
      component.reasonControl.setValue('inaudible');
      component.detailsControl.setValue('');

      component.onSubmit();

      expect(unfulfillSpy).toHaveBeenCalledWith(1, 'Inaudible / unintelligible');
      expect(fetchNewSpy).toHaveBeenCalledWith(true);
      expect(routerSpy).toHaveBeenCalledWith(['/admin/transcripts', 1], { queryParams: { updatedStatus: true } });
    });

    it('requires details when reason is "other"', () => {
      const unfulfillSpy = jest.spyOn(transcriptionServiceMock, 'unfulfillTranscriptionRequest');

      component.form.controls.status.setValue(UNFULFILLED_STATUS);
      component.reasonControl.setValue('other');
      component.detailsControl.setValue('');

      component.onSubmit();

      expect(unfulfillSpy).not.toHaveBeenCalled();
      const hasDetailsError = component.errors.some((e) => e.fieldId === 'details');
      expect(hasDetailsError).toBe(true);
    });

    it('submits with "Other - <details>" when reason is "other" and details provided', () => {
      const unfulfillSpy = jest.spyOn(transcriptionServiceMock, 'unfulfillTranscriptionRequest');
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.form.controls.status.setValue(UNFULFILLED_STATUS);
      component.reasonControl.setValue('other');
      component.detailsControl.setValue('Something specific');

      component.onSubmit();

      expect(unfulfillSpy).toHaveBeenCalledWith(1, 'Other - Something specific');
      expect(routerSpy).toHaveBeenCalledWith(['/admin/transcripts', 1], { queryParams: { updatedStatus: true } });
    });
  });
});
