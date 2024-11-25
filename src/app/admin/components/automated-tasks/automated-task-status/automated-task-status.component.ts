import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { Component, computed, input } from '@angular/core';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';

@Component({
  selector: 'app-automated-task-status',
  standalone: true,
  imports: [GovukBannerComponent],
  templateUrl: './automated-task-status.component.html',
  styleUrl: './automated-task-status.component.scss',
})
export class AutomatedTaskStatusComponent {
  latestTaskStatus = input.required<AutomatedTaskStatus | null>();

  text = computed(() => {
    const taskId = this.latestTaskStatus()?.taskId;
    const taskName = this.latestTaskStatus()?.taskName;
    const status = this.latestTaskStatus()?.status;

    switch (status) {
      case 'success':
        return `Task start request sent: ${taskName}`;
      case 'not-found':
        return `Task not found: ${taskName}`;
      case 'already-running':
        return `Task is already running: ${taskName}`;
      case 'inactive':
        return `Task ${taskId} is inactive: ${taskName}`;
      case 'active':
        return `Task ${taskId} is active: ${taskName}`;
      default:
        return '';
    }
  });

  banner = computed(() =>
    this.latestTaskStatus()?.status === 'not-found' || this.latestTaskStatus()?.status === 'already-running'
      ? 'warning'
      : 'success'
  );
}
