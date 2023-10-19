import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DatatableColumn, UserAudioRequestRow } from '@darts-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { HeaderService } from '@services/header/header.service';

@Component({
  selector: 'app-audio-delete',
  standalone: true,
  imports: [CommonModule, DataTableComponent, TableRowTemplateDirective],
  templateUrl: './audio-delete.component.html',
  styleUrls: ['./audio-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioDeleteComponent implements OnInit, OnDestroy {
  @Input() rowsToDelete: UserAudioRequestRow[] = [];
  @Output() confirm = new EventEmitter();
  @Output() cancel = new EventEmitter();

  headerService = inject(HeaderService);

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

  ngOnInit(): void {
    setTimeout(() => this.headerService.hideNavigation(), 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => this.headerService.showNavigation(), 0);
  }
}
