import { AutomatedTask, AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { Component, inject, input, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { GovukTagComponent } from '@common/govuk-tag/govuk-tag.component';
import { GovukSummaryListDirectives } from '@directives/govuk-summary-list';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { UserAdminService } from '@services/user-admin/user-admin.service';
import { map, Observable, switchMap } from 'rxjs';
import { AutomatedTaskStatusComponent } from '../automated-task-status/automated-task-status.component';

@Component({
  selector: 'app-view-automated-tasks',
  standalone: true,
  imports: [
    GovukHeadingComponent,
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
export class ViewAutomatedTasksComponent implements OnDestroy {
  taskService = inject(AutomatedTasksService);
  userAdminService = inject(UserAdminService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  taskId = this.route.snapshot.params.id;

  task = signal<AutomatedTaskDetails | null>(null);
  labelChanged = input(null);
  taskStatus = this.taskService.getLatestTaskStatus();

  constructor() {
    this.taskService
      .getTask(this.taskId)
      .pipe(switchMap((task) => this.addUserDetailsToTask(task)))
      .subscribe((task) => this.task.set(task));
  }

  readonly dateFormat = "EEE d LLL yyyy 'at' HH:mm:ss";

  onRunTaskButtonClicked(task: AutomatedTask): void {
    // If the task is active, run it immediately. Otherwise, navigate to the confirmation page.
    if (this.task()?.isActive) {
      this.taskService.runTask(task).subscribe();
    } else {
      this.router.navigate(['admin/system-configuration/automated-tasks', task.id, 'run'], {
        queryParams: { backUrl: this.router.url },
        state: { task },
      });
    }
  }

  onActivateDeactiveButtonClicked(): void {
    this.taskService
      .toggleTaskActiveStatus(this.task()!)
      .pipe(switchMap((task) => this.addUserDetailsToTask(task)))
      .subscribe((updatedTask) => this.task.set(updatedTask));
  }

  private addUserDetailsToTask(task: AutomatedTaskDetails): Observable<AutomatedTaskDetails> {
    return this.userAdminService.getUsersById([task.createdBy, task.lastModifiedBy], true).pipe(
      map((users) => {
        const createdBy = users.find((u) => u.id === task.createdBy);
        const lastModifiedBy = users.find((u) => u.id === task.lastModifiedBy);
        return {
          ...task,
          createdByFullName: createdBy?.fullName || 'System',
          modifiedByFullName: lastModifiedBy?.fullName || createdBy?.fullName || 'System',
        };
      })
    );
  }

  //Required as DateTime is changed when passed through state
  stringifyDates(task: AutomatedTaskDetails) {
    return {
      ...task,
      armReplayStartTs: task.armReplayStartTs?.toISO(),
      armReplayEndTs: task.armReplayEndTs?.toISO(),
    };
  }

  ngOnDestroy(): void {
    this.taskService.clearLatestTaskStatus();
  }
}
