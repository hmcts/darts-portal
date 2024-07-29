import { AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@common/details-table/details-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
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
  ],
  templateUrl: './view-automated-tasks.component.html',
  styleUrl: './view-automated-tasks.component.scss',
})
export class ViewAutomatedTasksComponent {
  taskService = inject(AutomatedTasksService);
  userAdminService = inject(UserAdminService);
  route = inject(ActivatedRoute);

  taskId = this.route.snapshot.params.id;

  task = signal<AutomatedTaskDetails | null>(null);
  taskRunStatus = signal<AutomatedTaskStatus | null>(null);

  constructor() {
    this.taskService
      .getTask(this.taskId)
      .pipe(switchMap((task) => this.addUserDetailsToTask(task)))
      .subscribe((task) => this.task.set(task));
  }

  readonly dateFormat = "EEE d LLL yyyy 'at' HH:mm:ss";

  details = computed(() => ({
    ID: this.task()?.id,
    Name: this.task()?.name,
    Description: this.task()?.description,
    'Cron expression': this.task()?.cronExpression,
    'Cron editable': this.task()?.isCronEditable ? 'Yes' : 'No',
    'Date created': this.task()?.createdAt.toFormat(this.dateFormat),
    'Created by': this.task()?.createdByFullName,
    'Date modified': this.task()?.lastModifiedAt.toFormat(this.dateFormat),
    'Modified by': this.task()?.modifiedByFullName,
  }));

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
}
