import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { Component, inject, signal, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
export class AutomatedTasksComponent implements OnDestroy {
  automatedTasksService = inject(AutomatedTasksService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isLoading = signal(true);
  automatedTasks = toSignal(this.automatedTasksService.getTasks().pipe(tap(() => this.isLoading.set(false))), {
    initialValue: [],
  });

  columns: DatatableColumn[] = [
    { name: 'ID', prop: 'id', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Description', prop: 'description', sortable: true },
    { name: 'Cron expression', prop: 'cronExpression' },
    { name: 'Status', prop: 'isActive', sortable: true },
    { name: 'Run task', prop: '' },
  ];

  onRunTaskButtonClicked(task: AutomatedTask) {
    // If the task is active, run it immediately. Otherwise, navigate to the confirmation page.
    if (task.isActive) {
      this.automatedTasksService.runTask(task).subscribe();
    } else {
      this.router.navigate(['admin/system-configuration/automated-tasks', task.id, 'run'], {
        queryParams: { backUrl: this.router.url },
        state: { task },
      });
    }
  }

  ngOnDestroy(): void {
    this.automatedTasksService.clearLatestTaskStatus();
  }
}
