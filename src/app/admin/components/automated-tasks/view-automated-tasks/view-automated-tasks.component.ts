import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { optionalStringToBooleanOrNull } from '@utils/transform.utils';
import { Observable, map, switchMap } from 'rxjs';
import { AutomatedTaskStatusComponent } from '../automated-task-status/automated-task-status.component';

@Component({
  selector: 'app-view-automated-tasks',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    GovukHeadingComponent,
    DetailsTableComponent,
    GovukBannerComponent,
    AutomatedTaskStatusComponent,
    GovukTagComponent,
    RouterLink,
    LuxonDatePipe,
    GovukSummaryListDirectives,
  ],
  templateUrl: './view-automated-tasks.component.html',
  styleUrl: './view-automated-tasks.component.scss',
})
export class ViewAutomatedTasksComponent {
  taskService = inject(AutomatedTasksService);
  userAdminService = inject(UserAdminService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  taskId = this.route.snapshot.params.id;

  task = signal<AutomatedTaskDetails | null>(null);
  taskRunStatus = signal<AutomatedTaskStatus | null>(null);
  batchSizeChanged = input(null, { transform: optionalStringToBooleanOrNull });
  dateChanged = input(null, { transform: optionalStringToBooleanOrNull });
  label = input(null);

  constructor() {
    this.taskService
      .getTask(this.taskId)
      .pipe(switchMap((task) => this.addUserDetailsToTask(task)))
      .subscribe((task) => this.task.set(task));
  }

  readonly dateFormat = "EEE d LLL yyyy 'at' HH:mm:ss";

  onRunTaskButtonClicked(taskName: string): void {
    this.taskService.runTask(this.taskId).subscribe({
      next: () => this.taskRunStatus.set([taskName, 'success']),
      error: (error) => this.taskRunStatus.set([taskName, error.status === 404 ? 'not-found' : 'already-running']),
    });
  }

  onActivateDeactiveButtonClicked(taskName: string): void {
    this.taskService
      .toggleTaskActiveStatus(this.task()!)
      .pipe(switchMap((task) => this.addUserDetailsToTask(task)))
      .subscribe((updatedTask) => {
        this.taskRunStatus.set([taskName, updatedTask.isActive ? 'active' : 'inactive']);
        this.task.set(updatedTask);
      });
  }

  private addUserDetailsToTask(task: AutomatedTaskDetails): Observable<AutomatedTaskDetails> {
    return this.userAdminService.getUsersById([task.createdBy, task.lastModifiedBy]).pipe(
      map(([createdBy, lastModifiedBy]) => ({
        ...task,
        createdByFullName: createdBy?.fullName || 'System',
        modifiedByFullName: lastModifiedBy?.fullName || createdBy?.fullName || 'System',
      }))
    );
  }

  //Required as DateTime is changed when passed through state
  stringifyDates(task: AutomatedTaskDetails) {
    return {
      ...task,
      rpoCsvStartHour: task.rpoCsvStartHour?.toISO(),
      rpoCsvEndHour: task.rpoCsvEndHour?.toISO(),
      armReplayStartTs: task.armReplayStartTs?.toISO(),
      armReplayEndTs: task.armReplayEndTs?.toISO(),
    };
  }
}
