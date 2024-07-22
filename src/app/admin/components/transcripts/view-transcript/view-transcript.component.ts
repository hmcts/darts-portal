import { TranscriptionStatus, User } from '@admin-types/index';
import { TranscriptionWorkflow } from '@admin-types/transcription/transcription-workflow';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TimelineComponent } from '@common/timeline/timeline.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { TimelineItem } from '@core-types/index';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { TranscriptionAdminService } from '@services/transcription-admin/transcription-admin.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { TranscriptDetailsComponent } from './transcript-details/transcript-details.component';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  templateUrl: './view-transcript.component.html',
  styleUrl: './view-transcript.component.scss',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    BreadcrumbDirective,
    TabsComponent,
    TabDirective,
    DetailsTableComponent,
    TranscriptDetailsComponent,
    TimelineComponent,
    GovukBannerComponent,
    RouterLink,
    LoadingComponent,
  ],
})
export class ViewTranscriptComponent {
  route = inject(ActivatedRoute);
  userAdminService = inject(UserAdminService);
  transcriptionAdminService = inject(TranscriptionAdminService);
  statusUpdated$ = this.route.queryParams.pipe(map((params) => !!params.updatedStatus));

  readonly transcriptionId = this.route.snapshot.params.transcriptionId;

  history$ = this.transcriptionAdminService.getTranscriptionWorkflows(this.transcriptionId).pipe(
    switchMap((workflows) => {
      const userIds = workflows.map((workflow) => workflow.workflowActor);
      return forkJoin({
        workflows: of(workflows),
        users: this.userAdminService.getUsersById(userIds),
        statuses: this.transcriptionAdminService.getTranscriptionStatuses(),
      }).pipe(map(({ workflows, statuses, users }) => this.mapWorkflowsToTimeline(workflows, statuses, users)));
    })
  );

  transcript$ = this.transcriptionAdminService.getTranscriptionDetails(this.transcriptionId).pipe(
    switchMap((transcription) => {
      if (!transcription.requestor && !transcription.courthouseId) {
        return of(transcription);
      } else {
        return this.transcriptionAdminService.getLatestTranscriptionWorkflowActor(this.transcriptionId, true).pipe(
          switchMap((workflowUserId) => {
            const userIds = transcription.requestor?.userId
              ? [workflowUserId, transcription.requestor?.userId]
              : [workflowUserId];

            return forkJoin({
              users: this.userAdminService.getUsersById(userIds),
              securityGroups: this.transcriptionAdminService.getTranscriptionSecurityGroups(
                transcription.courthouseId!
              ),
            }).pipe(
              map(({ users, securityGroups }) => {
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
              })
            );
          })
        );
      }
    })
  );

  mapWorkflowsToTimeline(
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
