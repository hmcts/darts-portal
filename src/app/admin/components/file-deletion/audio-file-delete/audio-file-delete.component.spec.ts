import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Navigation, provideRouter, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { FileDeletionService } from '@services/file-deletion/file-deletion.service';
import { HeaderService } from '@services/header/header.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { AudioFileDeleteComponent } from './audio-file-delete.component';

describe('AudioFileDeleteComponent', () => {
  let component: AudioFileDeleteComponent;
  let fixture: ComponentFixture<AudioFileDeleteComponent>;
  let router: Router;

  const audioFileState = {
    mediaId: 123,
    markedById: 1,
    startAt: '2022-01-01T00:00:00.000Z',
    endAt: '2022-01-01T01:00:00.000Z',
    courthouse: '',
    courtroom: '',
    channel: 11,
    comments: '',
    ticketReference: '',
    reasonId: 3,
  };

  const audioFile = {
    mediaId: 123,
    markedById: 1,
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: '',
    courtroom: '',
    channel: 11,
    comments: '',
    ticketReference: '',
    reasonId: 3,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioFileDeleteComponent, ReactiveFormsModule],
      providers: [
        { provide: HeaderService, useValue: { hideNavigation: jest.fn() } },
        { provide: FileDeletionService, useValue: { approveAudioFileDeletion: jest.fn() } },
        { provide: TransformedMediaService, useValue: { unhideAudioFile: jest.fn() } },
        LuxonDatePipe,
        DatePipe,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    jest
      .spyOn(router, 'getCurrentNavigation')
      .mockReturnValue({ extras: { state: { isPermitted: true, file: audioFileState } } } as unknown as Navigation);

    fixture = TestBed.createComponent(AudioFileDeleteComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide navigation on initialization', () => {
    const headerServiceSpy = jest.spyOn(component.headerService, 'hideNavigation');
    component.ngOnInit();
    expect(headerServiceSpy).toHaveBeenCalled();
  });

  it('should parse audio file dates on initialization', () => {
    component.audioFileState = audioFileState;
    component.ngOnInit();
    expect(component.audioFile).toEqual(audioFile);
  });

  it('should return approval choice errors', () => {
    component.deletionApproval.setErrors({ required: true });
    component.confirm();
    const errors = component.getApprovalChoiceErrors();
    expect(errors).toContain('Select your decision');
  });

  it('should navigate to /admin/file-deletion with approvedForDeletion query param when deletionApproval is true', () => {
    const approveRadioButton: HTMLInputElement = fixture.nativeElement.querySelector('#approve-option');
    approveRadioButton.click();
    fixture.detectChanges();

    const touchedSpy = jest.spyOn(component.deletionApproval, 'markAllAsTouched');
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const fileDeletionServiceSpy = jest
      .spyOn(component.fileDeletionService, 'approveAudioFileDeletion')
      .mockReturnValue(of({} as FileHide));

    component.confirm();
    expect(touchedSpy).toHaveBeenCalled();
    expect(fileDeletionServiceSpy).toHaveBeenCalledWith(component.audioFile.mediaId);
    expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion'], { queryParams: { approvedForDeletion: true } });
  });

  it('should navigate to /admin/file-deletion with unmarkedAndUnhidden query param when deletionApproval is false', () => {
    const unmarkRadioButton: HTMLInputElement = fixture.nativeElement.querySelector('#reject-unhide-option');
    unmarkRadioButton.click();
    fixture.detectChanges();

    const touchedSpy = jest.spyOn(component.deletionApproval, 'markAllAsTouched');
    const routerSpy = jest.spyOn(component.router, 'navigate');
    const transformedMediaServiceSpy = jest
      .spyOn(component.transformedMediaService, 'unhideAudioFile')
      .mockReturnValue(of({} as FileHide));

    component.confirm();
    expect(touchedSpy).toHaveBeenCalled();
    expect(transformedMediaServiceSpy).toHaveBeenCalledWith(component.audioFile.mediaId);
    expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion'], { queryParams: { unmarkedAndUnhidden: true } });
  });

  it('should return error summary with approval choice error', () => {
    component.deletionApproval.setErrors({ required: true });
    component.confirm();
    const errorSummary = component.getErrorSummary();
    expect(errorSummary).toEqual([{ fieldId: 'deletionApproval', message: 'Select your decision' }]);
  });
});
