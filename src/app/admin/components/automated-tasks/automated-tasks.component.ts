import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';

export type TaskRunStatus = 'success' | 'not-found' | 'already-running';

@Component({
  selector: 'app-automated-tasks',
  standalone: true,
  imports: [GovukHeadingComponent, JsonPipe, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './automated-tasks.component.html',
  styleUrl: './automated-tasks.component.scss',
})
export class AutomatedTasksComponent {
  automatedTasksService = inject(AutomatedTasksService);

  automatedTasks = toSignal(this.automatedTasksService.getTasks(), { initialValue: [] });

  @Output() taskRun = new EventEmitter<TaskRunStatus>();

  coloumns: DatatableColumn[] = [
    { name: 'ID', prop: 'id', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Description', prop: 'description', sortable: true },
    { name: 'Cron expression', prop: 'cronExpression' },
    { name: 'Status', prop: 'isActive', sortable: true },
    { name: '', prop: '' }, // Empty column for run task button
  ];

  onRunTaskButtonClicked(taskId: number) {
    this.automatedTasksService.runTask(taskId).subscribe({
      next: () => this.taskRun.emit('success'),
      error: (error) => this.taskRun.emit(error.status === 404 ? 'not-found' : 'already-running'),
    });
  }
}
