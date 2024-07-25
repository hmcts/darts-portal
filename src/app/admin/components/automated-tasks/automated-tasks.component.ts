import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-automated-tasks',
  standalone: true,
  imports: [GovukHeadingComponent, DataTableComponent, TableRowTemplateDirective, RouterLink, LoadingComponent],
  templateUrl: './automated-tasks.component.html',
  styleUrl: './automated-tasks.component.scss',
})
export class AutomatedTasksComponent {
  automatedTasksService = inject(AutomatedTasksService);

  isLoading = signal(true);
  automatedTasks = toSignal(this.automatedTasksService.getTasks().pipe(tap(() => this.isLoading.set(false))), {
    initialValue: [],
  });

  @Output() taskRun = new EventEmitter<AutomatedTaskStatus>();

  columns: DatatableColumn[] = [
    { name: 'ID', prop: 'id', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Description', prop: 'description', sortable: true },
    { name: 'Cron expression', prop: 'cronExpression' },
    { name: 'Status', prop: 'isActive', sortable: true },
    { name: 'Run task', prop: '', hidden: true }, // Empty column header for run task buttons
  ];

  onRunTaskButtonClicked(taskId: number, taskName: string) {
    this.automatedTasksService.runTask(taskId).subscribe({
      next: () => this.taskRun.emit([taskName, 'success']),
      error: (error) => this.taskRun.emit([taskName, error.status === 404 ? 'not-found' : 'already-running']),
    });
  }
}
