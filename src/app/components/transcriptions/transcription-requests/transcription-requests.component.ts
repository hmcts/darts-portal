import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@darts-types/index';
import { TranscriptionUrgency } from '@darts-types/transcription-urgency.interface';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { TranscriptionService } from '@services/transcription/transcription.service';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-transcription-requests',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective, RouterLink, LoadingComponent],
  templateUrl: './transcription-requests.component.html',
  styleUrl: './transcription-requests.component.scss',
})
export class TranscriptionRequestsComponent {
  transcriptionService = inject(TranscriptionService);

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number', sortable: true },
    { name: 'Court', prop: 'courthouse_name', sortable: true },
    { name: 'Hearing date', prop: 'hearing_date', sortable: true },
    { name: 'Type', prop: 'transcription_type', sortable: true },
    { name: 'Requested on', prop: 'requested_ts', sortable: true },
    { name: 'Method', prop: 'is_manual', sortable: true },
    {
      name: 'Urgency',
      prop: 'urgency',
      sortable: true,
      sortFn: this.sortByUrgencyPriorityOrder,
    },
    { name: '', prop: '' },
  ];

  sortByUrgencyPriorityOrder(a: any, b: any, direction?: 'asc' | 'desc') {
    if (direction === 'desc') {
      return a.urgency.priority_order - b.urgency.priority_order;
    } else if (direction === 'asc') {
      return b.urgency.priority_order - a.urgency.priority_order;
    } else {
      return 0;
    }
  }

  transcriptRequests$ = this.transcriptionService.unassignedRequests$.pipe(
    switchMap((requests) =>
      this.transcriptionService.getUrgencies().pipe(
        map((urgencies) =>
          requests.map((r) => ({ ...r, urgency: this.getUrgencyByDescription(urgencies, r.urgency) }))
        ),
        tap((request) => console.log(request))
      )
    )
  );

  getUrgencyByDescription(urgencies: TranscriptionUrgency[], description: string) {
    return urgencies.find((u) => u.description === description);
  }
}
