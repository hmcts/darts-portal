import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn } from '@darts-types/data-table-column.interface';
import { UserAudioRequestRow } from '@darts-types/user-audio-request-row.interface';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';

@Component({
  selector: 'app-audio-delete',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './audio-delete.component.html',
  styleUrls: ['./audio-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioDeleteComponent {
  @Input() rowsToDelete: UserAudioRequestRow[] = [];
  @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();

  columns: DatatableColumn[] = [
    { name: 'Case ID', prop: 'caseNumber' },
    { name: 'Court', prop: 'courthouse' },
    { name: 'Hearing date', prop: 'hearingDate' },
    { name: 'Start time', prop: 'startTime' },
    { name: 'End time', prop: 'endTime' },
    { name: 'Request ID', prop: 'requestId' },
    { name: 'Expiry date', prop: 'expiry' },
    { name: 'Status', prop: 'status' },
  ];
}
