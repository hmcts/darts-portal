import { TranscriptionDocumentForDeletion } from '@admin-types/file-deletion';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation, provideRouter, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserService } from '@services/user/user.service';
import { of } from 'rxjs';
import { TranscriptFileDeleteComponent } from './transcript-file-delete.component';

describe('TranscriptFileDeleteComponent', () => {
  let component: TranscriptFileDeleteComponent;
  let fixture: ComponentFixture<TranscriptFileDeleteComponent>;
  let router: Router;

  const mockFileDeletion = {
    transcriptionDocumentId: 123,
    hiddenById: 1,
  } as TranscriptionDocumentForDeletion;

  const setup = (noTranscript = false, matchingUserId = false) => {
    const userServiceMock = {
      hasMatchingUserId: jest.fn().mockReturnValue(matchingUserId),
    };

    const headerServiceMock = {
      hideNavigation: jest.fn(),
    };

    const fileDeletionServiceMock = {
      approveTranscriptFileDeletion: jest.fn().mockReturnValue(of(null)),
    };

    const transcriptionServiceMock = {
      unhideTranscriptionDocument: jest.fn().mockReturnValue(of(null)),
    };

    TestBed.configureTestingModule({
      imports: [TranscriptFileDeleteComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: HeaderService, useValue: headerServiceMock },
        { provide: FileDeletionService, useValue: fileDeletionServiceMock },
        { provide: TranscriptionAdminService, useValue: transcriptionServiceMock },
        LuxonDatePipe,
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({
      extras: { state: { file: noTranscript ? null : mockFileDeletion } },
    } as unknown as Navigation);

    fixture = TestBed.createComponent(TranscriptFileDeleteComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  };

  describe('ngOnInit', () => {
    it('should redirect to /admin/file-deletion if transcriptFile is null', () => {
      setup(true, false);
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion']);
    });

    it('should redirect to /admin/file-deletion/unauthorised if the user is the one who hid the file', () => {
      setup(false, true);
      const routerSpy = jest.spyOn(component.router, 'navigate');

      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion/unauthorised'], {
        state: { type: 'transcript' },
      });
    });

    it('should hide the navigation using the HeaderService', () => {
      setup();
      const headerSpy = jest.spyOn(component.headerService, 'hideNavigation');

      component.ngOnInit();
      expect(headerSpy).toHaveBeenCalled();
    });
  });

  describe('confirmTranscript', () => {
    it('should call approveTranscriptFileDeletion if approveDeletion is true', () => {
      setup();
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const approveTranscriptFileDeletionSpy = jest.spyOn(
        component.fileDeletionService,
        'approveTranscriptFileDeletion'
      );

      component.confirmTranscript(true);

      expect(approveTranscriptFileDeletionSpy).toHaveBeenCalledWith(mockFileDeletion.transcriptionDocumentId);

      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion'], {
        queryParams: { approvedForDeletion: true, type: 'Transcript' },
      });
    });

    it('should call unhideTranscriptionDocument if approveDeletion is false', () => {
      setup();
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const unhideTranscriptionDocumentSpy = jest.spyOn(component.transcriptionService, 'unhideTranscriptionDocument');

      component.confirmTranscript(false);

      expect(unhideTranscriptionDocumentSpy).toHaveBeenCalledWith(mockFileDeletion.transcriptionDocumentId);

      expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion'], {
        queryParams: { unmarkedAndUnhidden: true, type: 'Transcript' },
      });
    });
  });

  describe('getErrorSummary', () => {
    it('should set errorSummary correctly when there are errors', () => {
      const errors = [{ fieldId: 'deletionApproval', message: 'Error 1' }];
      component.getErrorSummary(errors);
      expect(component.errorSummary).toEqual([{ fieldId: 'deletionApproval', message: 'Error 1' }]);
    });

    it('should clear errorSummary when there are no errors', () => {
      component.getErrorSummary([]);
      expect(component.errorSummary).toEqual([]);
    });
  });
});
