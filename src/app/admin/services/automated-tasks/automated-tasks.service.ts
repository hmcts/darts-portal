import { AutomatedTask } from '@admin-types/automated-task/automated-task';
import { AutomatedTaskData } from '@admin-types/automated-task/automated-task.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  runTask(taskId: number): Observable<HttpResponse<void>> {
    return this.http.post<void>(`/api/admin/automated-tasks/${taskId}/run`, {}, { observe: 'response' });
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
}
