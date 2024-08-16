import { TestBed } from '@angular/core/testing';

import { SecurityGroup, User } from '@admin-types/index';
import { TranscriptionStatus } from '@admin-types/transcription';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { TranscriptFacadeService } from './transcript-facade.service';

describe('TranscriptFacadeService', () => {
  let service: TranscriptFacadeService;

  let fakeTranscriptionAdminService: TranscriptionAdminService;
  let fakeUserAdminService: UserAdminService;

  let mockTranscription: TranscriptionAdminDetails = {
    caseId: 0,
    caseNumber: '',
    courthouse: '',
    courtroom: '',
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
    transcriptionObjectId: 0,
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
      getTranscriptionWorkflows: jest.fn().mockReturnValue(of([])),
      getTranscriptionStatuses: jest.fn().mockReturnValue(of([])),
    } as unknown as TranscriptionAdminService;

    fakeUserAdminService = { getUsersById: jest.fn() } as unknown as UserAdminService;

    TestBed.configureTestingModule({
      providers: [
        { provide: UserAdminService, useValue: fakeUserAdminService },
        { provide: TranscriptionAdminService, useValue: fakeTranscriptionAdminService },
      ],
    });
    service = TestBed.inject(TranscriptFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getTranscript', () => {
    it('should return transcript if requestor and courthouseId is missing', () => {
      service.getTranscript(1);
      expect(service.transcript()).toEqual(mockTranscription);
    });

    it('should return mapped transcript if requestor and courthouseId is present', () => {
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

      const transcriptSignal = service.getTranscript(1);

      expect(transcriptSignal()).toEqual({
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

  describe('#getHistory', () => {
    it('should return mapped workflows to timeline', () => {
      const mockWorkflows: TranscriptionWorkflow[] = [
        {
          workflowActor: 1,
          statusId: 1,
          workflowTimestamp: DateTime.fromISO('2021-01-01T00:00:00Z'),
          comments: [
            {
              comment: 'Test Comment',
              commentedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
              authorId: 0,
            },
          ],
        },
      ];

      const mockUsers = [{ id: 1, fullName: 'Test User', emailAddress: 'email@test.com' } as User];

      const mockStatuses: TranscriptionStatus[] = [{ id: 1, displayName: 'Requested', type: 'Requested' }];

      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionWorkflows').mockReturnValue(of(mockWorkflows));
      jest.spyOn(fakeUserAdminService, 'getUsersById').mockReturnValue(of(mockUsers));
      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionStatuses').mockReturnValue(of(mockStatuses));

      const history = service.getHistory(1);

      expect(history()).toEqual([
        {
          title: 'Requested',
          descriptionLines: ['Test Comment'],
          dateTime: DateTime.fromISO('2021-01-01T00:00:00Z'),
          user: { id: 1, fullName: 'Test User', emailAddress: 'email@test.com' },
        },
      ]);
    });
  });
});
