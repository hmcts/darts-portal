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
  status = input<AutomatedTaskStatus | null>(null);
  taskId = input<number | null>(null);

  text = computed(() => {
    const statusGroup = this.status();
    const taskName = statusGroup ? statusGroup[0] : null;
    const status = statusGroup ? statusGroup[1] : null;
    switch (status) {
      case 'success':
        return `Task start request sent: ${taskName}`;
      case 'not-found':
        return `Task not found: ${taskName}`;
      case 'already-running':
        return `Task is already running: ${taskName}`;
      case 'inactive':
        return `Task ${this.taskId()} is inactive: ${taskName}`;
      case 'active':
        return `Task ${this.taskId()} is active: ${taskName}`;
      default:
        return '';
    }
  });

  banner = computed(() => {
    const statusGroup = this.status();
    const status = statusGroup ? statusGroup[1] : null;
    // const taskName = statusGroup ? statusGroup[0] : null;
    return status === 'not-found' || status === 'already-running' ? 'warning' : 'success';
  });
}
