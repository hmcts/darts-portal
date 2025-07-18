import { SecurityGroup, TranscriptionStatus, User } from '@admin-types/index';
import { TranscriptionAdminDetails } from '@admin-types/transcription/transcription-details';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { inject, Injectable } from '@angular/core';
import { TimelineItem } from '@core-types/index';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranscriptFacadeService {
  transcriptionAdminService = inject(TranscriptionAdminService);
  userAdminService = inject(UserAdminService);

  getHistory(transcriptionId: number) {
    return this.transcriptionAdminService.getTranscriptionWorkflows(transcriptionId).pipe(
      switchMap((workflows) => {
        const userIds = workflows.map((workflow) => workflow.workflowActor);
        return forkJoin({
          workflows: of(workflows),
          users: this.userAdminService.getUsersById(userIds, true),
          statuses: this.transcriptionAdminService.getTranscriptionStatuses(),
        }).pipe(map(({ workflows, statuses, users }) => this.mapWorkflowsToTimeline(workflows, statuses, users)));
      })
    );
  }

  sortTimelineItemByTimestampAndStatus(timelineItems: TimelineItem[]): TimelineItem[] {
    return timelineItems.sort((a, b) => {
      const dateComparison = b.dateTime.toMillis() - a.dateTime.toMillis();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.title.localeCompare(b.title);
    });
  }

  getTranscript(transcriptionId: number) {
    return this.transcriptionAdminService.getTranscriptionDetails(transcriptionId).pipe(
      switchMap((transcription) => {
        if (!transcription.requestor && !transcription.courthouseId) {
          return of(transcription);
        } else {
          return this.getAdditionalTranscriptionDetails(transcription);
        }
      })
    );
  }

  private getAdditionalTranscriptionDetails(transcription: TranscriptionAdminDetails) {
    return this.transcriptionAdminService.getLatestTranscriptionWorkflowActor(transcription.transcriptionId, true).pipe(
      switchMap((workflowUserId) => {
        const userIds = transcription.requestor?.userId
          ? [workflowUserId, transcription.requestor?.userId]
          : [workflowUserId];

        return forkJoin({
          users: this.userAdminService.getUsersById(userIds, true),
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
        isSystemUser: requestor?.isSystemUser,
      },
      assignedTo: {
        email: assignee?.emailAddress,
        userId: assignee?.id,
        fullName: assignee?.fullName,
        isSystemUser: requestor?.isSystemUser,
      },
    };
  }

  private mapWorkflowsToTimeline(
    workflows: TranscriptionWorkflow[],
    statuses: TranscriptionStatus[],
    users: User[]
  ): TimelineItem[] {
    const userMap = new Map<number, User>();
    users.forEach((user) => userMap.set(user.id, user));

    const statusMap = new Map<number, TranscriptionStatus>();
    statuses.forEach((status) => statusMap.set(status.id, status));

    const workflowTimelineData = workflows
      .filter((workflow) => workflow.statusId !== undefined && statusMap.get(workflow.statusId))
      .map((workflow) => ({
        // @ts-expect-error False positive statusId must be present at this stage
        title: statusMap.get(workflow.statusId).displayName || 'Unknown',
        descriptionLines: workflow.comments.map((c) => c.comment),
        dateTime: workflow.workflowTimestamp,
        user: userMap.get(workflow.workflowActor) as Pick<User, 'id' | 'fullName' | 'emailAddress' | 'isSystemUser'>,
      }));

    const commentTimelineData = workflows
      .filter((workflow) => workflow.statusId === undefined || !statusMap.get(workflow.statusId))
      .flatMap((workflow) =>
        workflow.comments.map((value) => {
          return {
            comment: value,
            workflow: workflow,
          };
        })
      )
      .map((data) => {
        const comment = data.comment;
        let user = userMap.get(comment.authorId);
        if (!user) {
          user = userMap.get(data.workflow.workflowActor);
        }
        let dateTime = comment.commentedAt;
        if (!dateTime) {
          dateTime = data.workflow.workflowTimestamp;
        }
        return {
          title: 'Comment',
          descriptionLines: [comment.comment],
          dateTime: dateTime,
          user: (user as Pick<User, 'id' | 'fullName' | 'emailAddress' | 'isSystemUser'>) || null,
        };
      });
    return this.sortTimelineItemByTimestampAndStatus(workflowTimelineData.concat(commentTimelineData));
  }
}
