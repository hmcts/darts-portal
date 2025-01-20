import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHide } from '@admin-types/hidden-reasons/file-hide';
import { AudioFileMarkedDeletion } from '@admin-types/index';
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
    media: [
      {
        id: 123,
        channel: 11,
        totalChannels: 1,
        isCurrent: true,
        versionCount: 1,
      },
    ],
    markedById: 1,
    startAt: '2022-01-01T00:00:00.000Z',
    endAt: '2022-01-01T01:00:00.000Z',
    courthouse: '',
    courtroom: '',
    comments: [''],
    ticketReference: '',
    reasonId: 3,
    hiddenById: 11,
  };

  const audioFile: AudioFileMarkedDeletion = {
    media: [
      {
        id: 123,
        channel: 11,
        totalChannels: 1,
        isCurrent: true,
        versionCount: 1,
      },
    ],
    markedById: 1,
    startAt: DateTime.fromISO('2022-01-01T00:00:00.000Z'),
    endAt: DateTime.fromISO('2022-01-01T01:00:00.000Z'),
    courthouse: '',
    courtroom: '',
    comments: [''],
    ticketReference: '',
    reasonId: 3,
    hiddenById: 11,
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

  it('should navigate to /admin/file-deletion with approvedForDeletion query param when deletionApproval is true', () => {
    const approveRadioButton: HTMLInputElement = fixture.nativeElement.querySelector('#approve-option');
    approveRadioButton.click();
    fixture.detectChanges();

    const routerSpy = jest.spyOn(component.router, 'navigate');
    const fileDeletionServiceSpy = jest
      .spyOn(component.fileDeletionService, 'approveAudioFileDeletion')
      .mockReturnValue(of({} as FileHide));

    component.confirmAudio(true);
    expect(fileDeletionServiceSpy).toHaveBeenCalledWith(component.audioFile?.media?.[0].id);
    expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion'], {
      queryParams: { approvedForDeletion: true, type: 'Audio' },
    });
  });

  it('should navigate to /admin/audio-file/:id/associated-audio/unhide-or-unmark-for-deletion when deletionApproval is false and pass in associatedMedia', () => {
    const unmarkRadioButton: HTMLInputElement = fixture.nativeElement.querySelector('#reject-unhide-option');
    unmarkRadioButton.click();
    fixture.detectChanges();

    const routerSpy = jest.spyOn(component.router, 'navigate');

    component.confirmAudio(false);
    expect(routerSpy).toHaveBeenCalledWith(
      ['/admin/audio-file', 123, 'associated-audio', 'unhide-or-unmark-for-deletion'],
      {
        state: {
          media: [
            {
              channel: 11,
              courthouseName: '',
              courtroomName: '',
              endAt: DateTime.fromISO('2022-01-01T01:00:00.000+00:00'),
              id: 123,
              isCurrent: true,
              isHidden: true,
              startAt: DateTime.fromISO('2022-01-01T00:00:00.000+00:00'),
            },
          ],
        },
        queryParams: { backUrl: '/admin/file-deletion' },
      }
    );
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

  it('should navigate to /admin/file-deletion if audioFileState is not defined', () => {
    component.audioFileState = null as unknown as AudioFileMarkedDeletion;
    const routerSpy = jest.spyOn(component.router, 'navigate');
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/file-deletion']);
  });

  it('should not navigate if audioFile is defined', () => {
    component.audioFileState = audioFile as AudioFileMarkedDeletion;
    const routerSpy = jest.spyOn(component.router, 'navigate');
    component.ngOnInit();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
