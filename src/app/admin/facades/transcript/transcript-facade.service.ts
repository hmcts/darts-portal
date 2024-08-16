import { SecurityGroup, TranscriptionStatus, User } from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { inject, Injectable, signal } from '@angular/core';
import { TimelineItem } from '@core-types/index';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranscriptFacadeService {
  transcriptionAdminService = inject(TranscriptionAdminService);
  userAdminService = inject(UserAdminService);

  history = signal<TimelineItem[]>([]);
  transcript = signal<TranscriptionAdminDetails | null>(null);

  getHistory(transcriptionId: number) {
    const history$ = this.transcriptionAdminService.getTranscriptionWorkflows(transcriptionId).pipe(
      switchMap((workflows) => {
        const userIds = workflows.map((workflow) => workflow.workflowActor);
        return forkJoin({
          workflows: of(workflows),
          users: this.userAdminService.getUsersById(userIds),
          statuses: this.transcriptionAdminService.getTranscriptionStatuses(),
        }).pipe(map(({ workflows, statuses, users }) => this.mapWorkflowsToTimeline(workflows, statuses, users)));
      })
    );

    history$.subscribe((history) => this.history.set(history));

    return this.history.asReadonly();
  }

  getTranscript(transcriptionId: number) {
    const transcript$ = this.transcriptionAdminService.getTranscriptionDetails(transcriptionId).pipe(
      switchMap((transcription) => {
        if (!transcription.requestor && !transcription.courthouseId) {
          return of(transcription);
        } else {
          return this.getAdditionalTranscriptionDetails(transcription);
        }
      })
    );

    transcript$.subscribe((transcript) => this.transcript.set(transcript));

    return this.transcript.asReadonly();
  }

  private getAdditionalTranscriptionDetails(transcription: TranscriptionAdminDetails) {
    return this.transcriptionAdminService.getLatestTranscriptionWorkflowActor(transcription.transcriptionId, true).pipe(
      switchMap((workflowUserId) => {
        const userIds = transcription.requestor?.userId
          ? [workflowUserId, transcription.requestor?.userId]
          : [workflowUserId];

        return forkJoin({
          users: this.userAdminService.getUsersById(userIds),
          securityGroups: this.transcriptionAdminService.getTranscriptionSecurityGroups(transcription.courthouseId!),
        }).pipe(
          map(({ users, securityGroups }) =>
            this.mapUsersAndSecurityGroupsToTranscription(users, securityGroups, transcription, workflowUserId)
          )
        );
      })
    );
  }

  private mapUsersAndSecurityGroupsToTranscription(
    users: User[],
    securityGroups: SecurityGroup[] | null,
    transcription: TranscriptionAdminDetails,
    workflowUserId: number
  ) {
    const requestor = users.find((u) => u.id === transcription.requestor?.userId);
    const assignee = users.find((u) => u.id === workflowUserId);
    return {
      ...transcription,
      assignedGroups: securityGroups || [],
      requestor: {
        email: requestor?.emailAddress,
        userId: transcription.requestor?.userId,
        fullName: transcription.requestor?.fullName,
      },
      assignedTo: {
        email: assignee?.emailAddress,
        userId: assignee?.id,
        fullName: assignee?.fullName,
      },
    };
  }

  private mapWorkflowsToTimeline(
    workflows: TranscriptionWorkflow[],
    statuses: TranscriptionStatus[],
    users: User[]
  ): TimelineItem[] {
    return workflows.map((workflow) => ({
      title: statuses.find((s) => workflow.statusId === s.id)?.displayName || 'Comment',
      descriptionLines: workflow.comments.map((c) => c.comment),
      dateTime: workflow.workflowTimestamp,
      user: users.find((u) => workflow.workflowActor === u.id) as Pick<User, 'id' | 'fullName' | 'emailAddress'>,
    }));
  }
}
