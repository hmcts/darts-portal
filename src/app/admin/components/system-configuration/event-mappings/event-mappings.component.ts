import { EventMapping } from '@admin-types/event-mappings/event-mapping.type';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn, ErrorSummaryEntry } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EventMappingForm, EventMappingFormComponent } from './event-mapping-form/event-mapping-form.component';
import { HumanizeInitCapPipe } from '@pipes/humanizeInitCap';

@Component({
  selector: 'app-event-mapping',
  standalone: true,
  templateUrl: './event-mappings.component.html',
  styleUrl: './event-mappings.component.scss',
  imports: [
    GovukHeadingComponent,
    EventMappingFormComponent,
    DataTableComponent,
    CommonModule,
    LuxonDatePipe,
    TableRowTemplateDirective,
    LoadingComponent,
    HumanizeInitCapPipe,
  ],
})
export class EventMappingComponent {
  eventMappingService = inject(EventMappingsService);
  datePipe = inject(DatePipe);
  router = inject(Router);

  errors: ErrorSummaryEntry[] = [];

  columns: DatatableColumn[] = [
    { name: 'Type', prop: 'type', sortable: true },
    { name: 'Subtype', prop: 'subType', sortable: true },
    { name: 'Event name', prop: 'name', sortable: true },
    { name: 'Event handler', prop: 'handler', sortable: true },
    { name: 'Restrictions', prop: 'hasRestrictions', sortable: true },
    { name: 'Date created', prop: 'createdAt', sortable: true },
    { name: 'Status', prop: 'isActive', sortable: true },
    { name: '', prop: '', sortable: false },
  ];

  formValues = new BehaviorSubject<EventMappingForm>({
    searchText: '',
    eventHandler: '',
    statusFilter: 'active',
    withRestrictions: true,
    withoutRestrictions: true,
  });

  filteredEventMappings$ = combineLatest([
    this.eventMappingService.getEventMappings(),
    this.formValues.asObservable(),
  ]).pipe(map(([mappings, form]) => this.filterResults(mappings, form)));

  data$ = combineLatest({
    eventMappings: this.filteredEventMappings$,
    eventHandlers: this.eventMappingService.getEventHandlers(),
  });

  onFormValuesChange(values: EventMappingForm): void {
    this.formValues.next(values);
  }

  filterResults(mappings: EventMapping[], form: EventMappingForm): EventMapping[] {
    return mappings.filter((mapping) => {
      const matchesText =
        !form.searchText ||
        (mapping.name ?? '').toLowerCase().includes(form.searchText.toLowerCase()) ||
        (mapping.type ?? '').toLowerCase().includes(form.searchText.toLowerCase()) ||
        (mapping.subType ?? '').toLowerCase().includes(form.searchText.toLowerCase());
      const matchesHandler = !form.eventHandler || mapping.handler === form.eventHandler;
      const matchesStatus = form.statusFilter !== 'active' || mapping.isActive;
      const matchesRestrictions =
        (form.withRestrictions && mapping.hasRestrictions) ||
        (form.withoutRestrictions && !mapping.hasRestrictions) ||
        (!form.withRestrictions && !form.withoutRestrictions);

      return matchesText && matchesHandler && matchesStatus && matchesRestrictions;
    });
  }
}
