import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionDetails } from '@portal-types/transcriptions/transcription-details.type';
import { ErrorMessageService } from '@services/error/error-message.service';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AssignTranscriptComponent } from './assign-transcript.component';

describe('AssignTranscriptComponent', () => {
  let component: AssignTranscriptComponent;
  let fixture: ComponentFixture<AssignTranscriptComponent>;
  let fakeTranscriptionService: Partial<TranscriptionService>;

  const mockActivatedRoute = {
    snapshot: {
      data: {
        userState: {
          userId: 123,
          userName: 'dev@local',
          roles: [
            {
              roleId: 123,
              roleName: 'local dev',
              permissions: [
                {
                  permissionId: 1,
                  permissionName: 'local dev permissions',
                },
              ],
            },
          ],
        },
      },
      params: {
        hearing_id: '1',
        transcriptId: '2',
      },
    },
  };

  const transcriptionDetail: TranscriptionDetails = {
    caseId: 2,
    caseNumber: 'C20220620001',
    courthouse: 'Swansea',
    status: 'Rejected',
    from: 'MoJ CH Swansea',
    received: undefined,
    requestorComments: 'Please expedite my request',
    rejectionReason: undefined,
    defendants: ['Defendant Dave', 'Defendant Bob'],
    judges: ['HHJ M. Hussain KC\t', 'Ray Bob'],
    transcriptFileName: 'C20220620001_0.docx',
    hearingDate: DateTime.fromISO('2023-11-08'),
    urgency: {
      transcription_urgency_id: 2,
      description: 'Standard',
      priority_order: 2,
    },
    requestType: 'Specified Times',
    transcriptionId: 123456789,
    transcriptionStartTs: DateTime.fromISO('2023-11-26T13:00:00Z'),
    transcriptionEndTs: DateTime.fromISO('2023-11-26T16:00:00Z'),
    isManual: false,
    hearingId: 1,
    courthouseId: 1,
  };

  beforeEach(async () => {
    fakeTranscriptionService = { getTranscriptionDetails: jest.fn(), assignTranscript: jest.fn() };
    jest.spyOn(fakeTranscriptionService, 'getTranscriptionDetails').mockReturnValue(of(transcriptionDetail));

    await TestBed.configureTestingModule({
      imports: [AssignTranscriptComponent, HttpClientModule, RouterTestingModule],
      providers: [
        DatePipe,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TranscriptionService, useValue: fakeTranscriptionService },
        LuxonDatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignTranscriptComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const getTranscriptionDetailsSpy = jest.spyOn(component.transcriptionService, 'getTranscriptionDetails');
    fixture.detectChanges();
    expect(getTranscriptionDetailsSpy).toHaveBeenCalledWith('2');
  });

  it('should set the Transcript ID', () => {
    expect(component.transcriptId).toEqual('2');
  });

  it('should assign transcript to self and navigate to /work', fakeAsync(() => {
    component.selectedOption.setValue(component.ASSIGN_TO_ME);
    const assignTranscriptSpy = jest.spyOn(component.transcriptionService, 'assignTranscript').mockReturnValue(of({}));
    const routerNavigateSpy = jest.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onAssignTranscript();
    tick();

    expect(component.isSubmitted).toBe(true);
    expect(component.errors).toEqual([]);
    expect(assignTranscriptSpy).toHaveBeenCalledWith(component.transcriptId);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/work']);
  }));

  it('should assign transcript and navigate to /case/:caseId/hearing/:hearingId with audio query params', fakeAsync(() => {
    component.selectedOption.setValue(component.ASSIGN_GET_AUDIO);
    const assignTranscriptSpy = jest.spyOn(component.transcriptionService, 'assignTranscript').mockReturnValue(of({}));
    const routerNavigateSpy = jest.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onAssignTranscript();
    tick();

    expect(component.isSubmitted).toBe(true);
    expect(component.errors).toEqual([]);
    expect(assignTranscriptSpy).toHaveBeenCalledWith(component.transcriptId);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/case', component.caseId, 'hearing', component.hearingId], {
      queryParams: component.getAudioQueryParams,
    });
  }));

  it('should assign transcript and navigate to /work/:transcriptId', fakeAsync(() => {
    component.selectedOption.setValue(component.ASSIGN_UPLOAD);
    const assignTranscriptSpy = jest.spyOn(component.transcriptionService, 'assignTranscript').mockReturnValue(of({}));
    const routerNavigateSpy = jest.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onAssignTranscript();
    tick();

    expect(component.isSubmitted).toBe(true);
    expect(component.errors).toEqual([]);
    expect(assignTranscriptSpy).toHaveBeenCalledWith(component.transcriptId);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/work', component.transcriptId]);
  }));

  it('should set errors when selectedOption is invalid', () => {
    component.selectedOption.setValue(null);

    component.onAssignTranscript();

    expect(component.isSubmitted).toBe(true);
    expect(component.errors).toEqual([
      { fieldId: 'transcriptionOptions', message: 'Select an action to progress this request.' },
    ]);
  });

  it('should clear error message on destroy', () => {
    const errorMessageService = TestBed.inject(ErrorMessageService);
    const clearErrorMessageSpy = jest.spyOn(errorMessageService, 'clearErrorMessage');
    component.ngOnDestroy();
    expect(clearErrorMessageSpy).toHaveBeenCalled();
  });
});
