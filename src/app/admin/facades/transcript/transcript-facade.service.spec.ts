import { fakeAsync, TestBed, tick } from '@angular/core/testing';

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
    it('should return mapped transcript if requester and courthouseId is present', fakeAsync(() => {
      mockTranscription = {
        ...mockTranscription,
        requestor: { userId: 1, fullName: 'Test Requester', email: 'email@test.com' },
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

      service.getTranscript(1).subscribe((result) =>
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
            fullName: 'Test Requester',
            userId: 1,
          },
        })
      );
      tick();
    }));
  });

  describe('#getHistory', () => {
    const mockUsers = [
      { id: 1, fullName: 'Test User 1', emailAddress: 'email1@test.com' } as User,
      { id: 2, fullName: 'Test User 2', emailAddress: 'email2@test.com' } as User,
    ];

    it('should return mapped workflows to timeline', fakeAsync(() => {
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

      const mockStatuses: TranscriptionStatus[] = [{ id: 1, displayName: 'Requested', type: 'Requested' }];

      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionWorkflows').mockReturnValue(of(mockWorkflows));
      jest.spyOn(fakeUserAdminService, 'getUsersById').mockReturnValue(of(mockUsers));
      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionStatuses').mockReturnValue(of(mockStatuses));

      service.getHistory(1).subscribe((history) =>
        expect(history).toEqual([
          {
            title: 'Requested',
            descriptionLines: ['Test Comment'],
            dateTime: DateTime.fromISO('2021-01-01T00:00:00Z'),
            user: { id: 1, fullName: 'Test User', emailAddress: 'email@test.com' },
          },
        ])
      );
      tick();
    }));
    it('should return mapped comments to timeline if workflow status not present', fakeAsync(() => {
      const mockWorkflows: TranscriptionWorkflow[] = [
        {
          workflowActor: 1,
          workflowTimestamp: DateTime.fromISO('2022-01-01T00:00:00Z'),
          comments: [
            {
              comment: 'Test Comment',
              commentedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
              authorId: 2,
            },
          ],
        },
      ];

      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionWorkflows').mockReturnValue(of(mockWorkflows));
      jest.spyOn(fakeUserAdminService, 'getUsersById').mockReturnValue(of(mockUsers));

      service.getHistory(1).subscribe((history) =>
        expect(history).toEqual([
          {
            title: 'Comment',
            descriptionLines: ['Test Comment'],
            dateTime: DateTime.fromISO('2021-01-01T00:00:00Z'),
            user: { id: 2, fullName: 'Test User 2', emailAddress: 'email2@test.com' },
          },
        ])
      );
      tick();
    }));

    it('should return mapped comments to timeline if workflow status not present and multiple comments', fakeAsync(() => {
      const mockWorkflows: TranscriptionWorkflow[] = [
        {
          workflowActor: 1,
          workflowTimestamp: DateTime.fromISO('2022-01-01T00:00:00Z'),
          comments: [
            {
              comment: 'Test Comment 1',
              commentedAt: DateTime.fromISO('2021-01-01T00:00:00Z'),
              authorId: 2,
            },
            {
              comment: 'Test Comment 2',
              commentedAt: DateTime.fromISO('2024-01-01T00:00:00Z'),
              authorId: 1,
            },
          ],
        },
      ];

      jest.spyOn(fakeTranscriptionAdminService, 'getTranscriptionWorkflows').mockReturnValue(of(mockWorkflows));
      jest.spyOn(fakeUserAdminService, 'getUsersById').mockReturnValue(of(mockUsers));

      service.getHistory(1).subscribe((history) =>
        expect(history).toEqual([
          {
            title: 'Comment',
            descriptionLines: ['Test Comment 1'],
            dateTime: DateTime.fromISO('2021-01-01T00:00:00Z'),
            user: { id: 2, fullName: 'Test User 2', emailAddress: 'email2@test.com' },
          },
          {
            title: 'Comment',
            descriptionLines: ['Test Comment 2'],
            dateTime: DateTime.fromISO('2024-01-01T00:00:00Z'),
            user: { id: 1, fullName: 'Test User 1', emailAddress: 'email1@test.com' },
          },
        ])
      );
      tick();
    }));

    describe('#sortWorkflowsByTimestampAndStatus', () => {
      it('should sort workflows by timestamp in descending order', () => {
        const workflows: TranscriptionWorkflow[] = [
          {
            workflowActor: 1,
            statusId: 1,
            workflowTimestamp: DateTime.fromISO('2021-01-02T00:00:00Z'),
            comments: [],
          },
          {
            workflowActor: 2,
            statusId: 2,
            workflowTimestamp: DateTime.fromISO('2021-01-01T00:00:00Z'),
            comments: [],
          },
        ];

        const sortedWorkflows = service.sortWorkflowsByTimestampAndStatus(workflows);

        expect(sortedWorkflows[0].workflowTimestamp.toISO()).toBe('2021-01-02T00:00:00.000+00:00');
        expect(sortedWorkflows[1].workflowTimestamp.toISO()).toBe('2021-01-01T00:00:00.000+00:00');
      });

      it('should sort workflows by statusId if timestamps are equal', () => {
        const workflows: TranscriptionWorkflow[] = [
          {
            workflowActor: 1,
            statusId: 2,
            workflowTimestamp: DateTime.fromISO('2021-01-01T00:00:00Z'),
            comments: [],
          },
          {
            workflowActor: 2,
            statusId: 1,
            workflowTimestamp: DateTime.fromISO('2021-01-01T00:00:00Z'),
            comments: [],
          },
        ];

        const sortedWorkflows = service.sortWorkflowsByTimestampAndStatus(workflows);

        expect(sortedWorkflows[0].statusId).toBe(2);
        expect(sortedWorkflows[1].statusId).toBe(1);
      });

      it('should handle empty workflows array', () => {
        const workflows: TranscriptionWorkflow[] = [];

        const sortedWorkflows = service.sortWorkflowsByTimestampAndStatus(workflows);

        expect(sortedWorkflows).toEqual([]);
      });
    });
  });
});
