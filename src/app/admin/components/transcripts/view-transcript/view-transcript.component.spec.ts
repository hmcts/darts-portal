import { SecurityGroup, User } from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { DatePipe } from '@angular/common';
import { Injector, Provider, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { ViewTranscriptComponent } from './view-transcript.component';

describe('ViewTranscriptComponent', () => {
  let component: ViewTranscriptComponent;
  let providers: Provider[] = [];
  let fakeTranscriptionAdminService: TranscriptionAdminService;
  let fakeUserAdminService: UserAdminService;

  let mockTranscription: TranscriptionAdminDetails = {
    caseId: 0,
    caseNumber: '',
    courthouse: '',
    defendants: [],
    judges: [],
    transcriptFileName: '',
    hearingDate: DateTime.fromISO('2021-01-01T00:00:00Z'),
    urgency: {
      transcription_urgency_id: 1,
      description: 'Standard',
      priority_order: 1,
    },
    requestType: '',
    transcriptionId: 0,
    transcriptionStartTs: DateTime.fromISO('2021-01-01T09:00:00Z'),
    transcriptionEndTs: DateTime.fromISO('2021-01-01T10:00:00Z'),
    isManual: false,
    hearingId: 0,
  };

  beforeEach(() => {
    fakeTranscriptionAdminService = {
      getUsersById: jest.fn(),
      getTranscriptionSecurityGroups: jest.fn(),
      getTranscriptionDetails: jest.fn().mockReturnValue(of(mockTranscription)),
      getLatestTranscriptionWorkflowActor: jest.fn(),
      getCurrentStatusFromTranscript: jest.fn(),
      getRequestDetailsFromTranscript: jest.fn(),
    } as unknown as TranscriptionAdminService;

    fakeUserAdminService = { getUsersById: jest.fn() } as unknown as UserAdminService;

    providers = [
      DatePipe,
      LuxonDatePipe,
      { provide: ActivatedRoute, useValue: { snapshot: { params: { transcriptionId: '1' } } } },
      { provide: UserAdminService, useValue: fakeUserAdminService },
      { provide: TranscriptionAdminService, useValue: fakeTranscriptionAdminService },
    ];
  });

  it('should create', () => {
    runInInjectionContext(Injector.create({ providers }), () => {
      component = new ViewTranscriptComponent();
    });
    expect(component).toBeTruthy();
  });

  describe('transcript$', () => {
    it('should return transcript if requestor and courthouseId is missing', () => {
      runInInjectionContext(Injector.create({ providers }), () => {
        component = new ViewTranscriptComponent();
      });

      let result = {} as TranscriptionAdminDetails;

      component.transcript$.subscribe((res) => (result = res));

      expect(result).toEqual(mockTranscription);
    });

    it('should return mapped transcript if requestor and courthouseId is present', () => {
      let result = {} as TranscriptionAdminDetails;

      mockTranscription = {
        ...mockTranscription,
        requestor: { userId: 1, fullName: 'Test Requestor', email: 'email@test.com' },
        courthouseId: 1,
      };

      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionDetails').mockReturnValue(of(mockTranscription));
      jest.spyOn(fakeTranscriptionAdminService, 'getLatestTranscriptionWorkflowActor').mockReturnValue(of(1));
      jest
        .spyOn(fakeUserAdminService, 'getUsersById')
        .mockReturnValue(of([{ id: 1, fullName: 'Test Assignee', emailAddress: 'email@email.com' } as User]));
      jest
        .spyOn(fakeTranscriptionAdminService, 'getTranscriptionSecurityGroups')
        .mockReturnValue(of([{ id: 1 } as SecurityGroup]));

      runInInjectionContext(Injector.create({ providers }), () => {
        component = new ViewTranscriptComponent();
      });

      component.transcript$.subscribe((res) => (result = res));

      expect(result).toEqual({
        ...mockTranscription,
        assignedGroups: [{ id: 1 }],
        assignedTo: {
          email: 'email@email.com',
          fullName: 'Test Assignee',
          userId: 1,
        },
        courthouseId: 1,
        requestor: {
          email: 'email@email.com',
          fullName: 'Test Requestor',
          userId: 1,
        },
      });
    });
  });
});
