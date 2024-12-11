import { AutomatedTask, AutomatedTaskDetails } from '@admin-types/automated-task/automated-task';
import { AutomatedTaskStatus } from '@admin-types/automated-task/automated-task-status';
import { AutomatedTaskData, AutomatedTaskDetailsData } from '@admin-types/automated-task/automated-task.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutomatedTasksService {
  http = inject(HttpClient);
  router = inject(Router);
  private latestTaskStatus = signal<AutomatedTaskStatus | null>(null);

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

  runTask({ id, name }: AutomatedTask) {
    return this.http.post<void>(`/api/admin/automated-tasks/${id}/run`, {}, { observe: 'response' }).pipe(
      tap(() => this.latestTaskStatus.set({ taskId: id, taskName: name, status: 'success' })),
      catchError((error) => {
        this.latestTaskStatus.set({
          taskId: id,
          taskName: name,
          status: error.status === 404 ? 'not-found' : 'already-running',
        });
        throw error;
      })
    );
  }

  toggleTaskActiveStatus(task: AutomatedTaskDetails): Observable<AutomatedTaskDetails> {
    return this.http
      .patch<AutomatedTaskDetailsData>(`/api/admin/automated-tasks/${task.id}`, { is_active: !task.isActive })
      .pipe(
        map((task) => this.mapTaskDetails(task)),
        tap((task) =>
          this.latestTaskStatus.set({
            taskId: task.id,
            taskName: task.name,
            status: task.isActive ? 'active' : 'inactive',
          })
        )
      );
  }

  changeFieldValue(id: number, key: string, rawValue: number | string | DateTime) {
    const value = rawValue instanceof DateTime ? rawValue.toUTC().toISO() : rawValue;
    return this.http.patch<void>(`/api/admin/automated-tasks/${id}`, { [key]: value });
  }

  getLatestTaskStatus(): Signal<AutomatedTaskStatus | null> {
    return this.latestTaskStatus.asReadonly();
  }

  clearLatestTaskStatus() {
    this.latestTaskStatus.set(null);
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
      batchSize: task.batch_size,
      createdAt: DateTime.fromISO(task.created_at),
      createdBy: task.created_by,
      lastModifiedAt: DateTime.fromISO(task.last_modified_at),
      lastModifiedBy: task.last_modified_by,
      armAttributeType: task.arm_attribute_type,
      rpoCsvStartHour: task.rpo_csv_start_hour,
      rpoCsvEndHour: task.rpo_csv_end_hour,
      armReplayStartTs: task.arm_replay_start_ts ? DateTime.fromISO(task.arm_replay_start_ts) : undefined,
      armReplayEndTs: task.arm_replay_end_ts ? DateTime.fromISO(task.arm_replay_end_ts) : undefined,
    };
  }
}
