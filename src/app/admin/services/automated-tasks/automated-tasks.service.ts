import { AutomatedTask, AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { AutomatedTaskData, AutomatedTaskDetailsData } from '@admin-types/automated-task/automated-task.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutomatedTasksService {
  http = inject(HttpClient);

  getTasks(): Observable<AutomatedTask[]> {
    return this.http
      .get<AutomatedTaskData[]>('/api/admin/automated-tasks')
      .pipe(map((data) => data.map((task) => this.mapTask(task))));
  }

  getTask(taskId: number): Observable<AutomatedTaskDetails> {
    return this.http
      .get<AutomatedTaskDetailsData>(`/api/admin/automated-tasks/${taskId}`)
      .pipe(map((task) => this.mapTaskDetails(task)));
  }

  runTask(taskId: number): Observable<HttpResponse<void>> {
    return this.http.post<void>(`/api/admin/automated-tasks/${taskId}/run`, {}, { observe: 'response' });
  }

  toggleTaskActiveStatus(task: AutomatedTaskDetails): Observable<AutomatedTaskDetails> {
    return this.http
      .patch<AutomatedTaskDetailsData>(`/api/admin/automated-tasks/${task.id}`, { is_active: !task.isActive })
      .pipe(map((task) => this.mapTaskDetails(task)));
  }

  private mapTask(task: AutomatedTaskData): AutomatedTask {
    return {
      id: task.id,
      name: task.name,
      description: task.description,
      cronExpression: task.cron_expression,
      isActive: task.is_active,
    };
  }

  private mapTaskDetails(task: AutomatedTaskDetailsData): AutomatedTaskDetails {
    return {
      id: task.id,
      name: task.name,
      description: task.description,
      cronExpression: task.cron_expression,
      isActive: task.is_active,
      isCronEditable: task.is_cron_editable,
      createdAt: DateTime.fromISO(task.created_at),
      createdBy: task.created_by,
      lastModifiedAt: DateTime.fromISO(task.last_modified_at),
      lastModifiedBy: task.last_modified_by,
    };
  }
}
