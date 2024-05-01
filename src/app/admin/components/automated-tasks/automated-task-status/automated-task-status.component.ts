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
    switch (this.status()) {
      case 'success':
        return 'Task start request sent';
      case 'not-found':
        return 'Task not found';
      case 'already-running':
        return 'Task is already running';
      case 'inactive':
        return `Task ${this.taskId()} is inactive`;
      case 'active':
        return `Task ${this.taskId()} is active`;
      default:
        return '';
    }
  });

  banner = computed(() => {
    return this.status() === 'not-found' || this.status() === 'already-running' ? 'warning' : 'success';
  });
}
