import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { DatatableColumn } from '@darts-types/data-table-column.interface';
import { UserTranscriptionRequest } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-delete-transcript',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './delete-transcript.component.html',
  styleUrl: './delete-transcript.component.scss',
})
export class DeleteTranscriptComponent implements OnInit, OnDestroy {
  @Input() rowsToDelete: UserTranscriptionRequest[] = [];
  @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();

  headerService = inject(HeaderService);
  transcriptStatusClassMap = transcriptStatusClassMap;

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'case_number' },
    { name: 'Court', prop: 'courthouse_name' },
    { name: 'Hearing date', prop: 'hearing_date' },
    { name: 'Type', prop: 'transcription_type' },
    { name: 'Requested on', prop: 'requested_ts' },
    { name: 'Status', prop: 'status' },
    { name: 'Urgency', prop: 'urgency' },
  ];

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => this.headerService.showNavigation(), 0);
  }
}
