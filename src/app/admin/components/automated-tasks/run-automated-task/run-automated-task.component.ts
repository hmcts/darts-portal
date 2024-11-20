import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';
import { HeaderService } from '@services/header/header.service';
import { HistoryService } from '@services/history/history.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-run-automated-task',
  standalone: true,
  imports: [GovukHeadingComponent, RouterLink],
  templateUrl: './run-automated-task.component.html',
  styleUrl: './run-automated-task.component.scss',
})
export class RunAutomatedTaskComponent implements OnInit {
  router = inject(Router);
  historyService = inject(HistoryService);
  automatedTasksService = inject(AutomatedTasksService);
  headerService = inject(HeaderService);

  task?: AutomatedTask = this.router.getCurrentNavigation()?.extras?.state?.task;
  backUrl = this.historyService.getBackUrl(this.router.url) ?? '/admin/system-configuration/automated-tasks';

  constructor() {
    if (!this.task) {
      this.router.navigate([this.backUrl]);
      return;
    }
  }

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onConfirm(task: AutomatedTask) {
    this.automatedTasksService
      .runTask(task)
      .pipe(
        finalize(() => {
          this.router.navigate([this.backUrl]);
        })
      )
      .subscribe();
  }
}
