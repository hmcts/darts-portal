import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
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
        },
      },
    }),
    navigate: jest.fn(),
  } as unknown as Router;

  const fakeTranscriptionAdminService = {
    hideTranscriptionDocument: jest.fn().mockReturnValue(of({})),
    getHiddenReasons: jest.fn().mockReturnValue(of(hiddenReasons)),
  } as unknown as TranscriptionAdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileHideOrDeleteComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: TranscriptionAdminService, useValue: fakeTranscriptionAdminService },
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

  it('should navigate to the continue link when goBack is called', () => {
    const routerSpy = jest.spyOn(fakeRouter, 'navigate');
    const continueLink = '/admin/transcripts/document/1';

    component.goBack();

    expect(routerSpy).toHaveBeenCalledWith([continueLink]);
  });
});
