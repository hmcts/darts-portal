import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { TranscriptionService } from 'src/app/portal/services/transcription/transcription.service';

import { ApproveTranscriptButtonsComponent } from './approve-transcript-buttons.component';

describe('ApproveTranscriptButtonsComponent', () => {
  let component: ApproveTranscriptButtonsComponent;
  let fixture: ComponentFixture<ApproveTranscriptButtonsComponent>;
  const fakeTranscriptionService = {
    approveTranscriptionRequest: jest.fn().mockReturnValue(of({})),
    rejectTranscriptionRequest: jest.fn().mockReturnValue(of({})),
  } as unknown as TranscriptionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveTranscriptButtonsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: TranscriptionService, useValue: fakeTranscriptionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveTranscriptButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onChange if option changed', () => {
    component.errors.emit = jest.fn();
    const compiled = fixture.nativeElement;
    const approveRadio = compiled.querySelector('#approve-radio');
    approveRadio.click();
    expect(component.errors.emit).toHaveBeenCalledWith([]);
  });

  it('should render reject-reason box if options are not selected', () => {
    const compiled = fixture.nativeElement;
    component.onSubmit();
    fixture.detectChanges();
    const errorRejectReason = compiled.querySelector('#error-reject-reason');
    expect(errorRejectReason).toBeTruthy();
    expect(errorRejectReason.textContent).toEqual(' Select if you approve this request or not ');
  });

  it('should render reject-reason box if "No" selected', () => {
    const compiled = fixture.nativeElement;
    component.approveFormControl.setValue('No');
    component.onSubmit();
    fixture.detectChanges();
    const rejectReason = compiled.querySelector('#reject-reason');
    expect(rejectReason).toBeTruthy();
    const errorRejectReason = compiled.querySelector('#error-reject-reason');
    expect(errorRejectReason).toBeTruthy();
    expect(errorRejectReason.textContent).toEqual(' You must explain why you cannot approve this request ');
  });

  it('should call rejectTranscriptionRequest from transcriptionService when reason populated', () => {
    const request = { id: 1, reason: "I don't like this transcription" };
    component.transcriptId = request.id;
    component.approveFormControl.setValue('No');
    component.rejectReasonFormControl.setValue(request.reason);
    component.onSubmit();
    expect(fakeTranscriptionService.rejectTranscriptionRequest).toHaveBeenCalledWith(request.id, request.reason);
  });

  it('should call approveTranscriptionRequest from transcriptionService', () => {
    const request = { id: 1 };
    component.approveFormControl.setValue('Yes');
    component.transcriptId = request.id;
    component.onSubmit();
    expect(fakeTranscriptionService.approveTranscriptionRequest).toHaveBeenCalledWith(request.id);
  });
});
