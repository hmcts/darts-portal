import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '@services/header/header.service';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { of } from 'rxjs';
import { ChangeTranscriptStatusComponent } from './change-transcript-status.component';

describe('ChangeTranscriptStatusComponent', () => {
  let component: ChangeTranscriptStatusComponent;
  let fixture: ComponentFixture<ChangeTranscriptStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeTranscriptStatusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { transcriptionId: 1 }, queryParams: { status: 'With Transcriber', manual: true } },
          },
        },
        {
          provide: TranscriptionAdminService,
          useValue: {
            updateTranscriptionStatus: jest.fn().mockReturnValue(of({})),
            getTranscriptionStatuses: jest.fn(),
            getAllowableTranscriptionStatuses: jest.fn().mockReturnValue(of([])),
          },
        },
        { provide: HeaderService, useValue: { hideNavigation: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeTranscriptStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hide navigation on init', () => {
    expect(TestBed.inject(HeaderService).hideNavigation).toHaveBeenCalled();
  });

  it('should call updateTranscriptionStatus on submit', () => {
    const updateTranscriptionStatusSpy = jest.spyOn(component.transcriptionAdminService, 'updateTranscriptionStatus');

    component.form.controls.status.setValue('2');
    component.form.controls.comments.setValue('commented');
    component.onSubmit();
    expect(updateTranscriptionStatusSpy).toHaveBeenCalledWith(1, 2, 'commented');
  });

  it('should navigate to view transcript on submit', () => {
    const routerSpy = jest.spyOn(component.router, 'navigate');
    component.form.controls.status.setValue('2');
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/transcripts', 1], { queryParams: { updatedStatus: true } });
  });
});
