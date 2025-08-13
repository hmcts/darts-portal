import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { NodeRegistrationService } from '@services/node-registrations/node-registration.service';
import { tap } from 'rxjs';
import { NodeRegistrationFormComponent } from './node-registration-form/node-registration-form.component';

@Component({
  selector: 'app-node-registrations',
  imports: [
    GovukHeadingComponent,
    LoadingComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    LuxonDatePipe,
    NodeRegistrationFormComponent,
  ],
  templateUrl: './node-registrations.component.html',
  styleUrl: './node-registrations.component.scss',
})
export class NodeRegistrationsComponent {
  nodeRegistrationService = inject(NodeRegistrationService);

  isLoading = signal(true);
  courthouseValue = signal('');

  nodeRegistrations = toSignal(
    this.nodeRegistrationService.getNodeRegistrations().pipe(tap(() => this.isLoading.set(false))),
    { initialValue: [] }
  );

  columns: DatatableColumn[] = [
    { name: 'Node ID', prop: 'id', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'IP address', prop: 'ipAddress', sortable: true },
    { name: 'Hostname', prop: 'hostname', sortable: true },
    { name: 'MAC address', prop: 'macAddress', sortable: true },
    { name: 'Node type', prop: 'nodeType', sortable: true },
    { name: 'Created at', prop: 'createdAt', sortable: true },
    { name: 'Created by', prop: 'createdByName', sortable: true },
  ];

  onFormChange(value: string) {
    this.courthouseValue.set(value);
  }

  readonly filteredNodeRegistrations = computed(() =>
    this.nodeRegistrations().filter((r) => r.courthouse?.toLowerCase().includes(this.courthouseValue()))
  );
}
