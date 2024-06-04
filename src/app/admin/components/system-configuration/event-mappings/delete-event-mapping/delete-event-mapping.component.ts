import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { DeleteComponent } from '@common/delete/delete.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { EventMappingsService } from '@services/event-mappings/event-mappings.service';

@Component({
  selector: 'app-delete-event-mapping',
  standalone: true,
  templateUrl: './delete-event-mapping.component.html',
  styleUrl: './delete-event-mapping.component.scss',
  imports: [
    DeleteComponent,
    DataTableComponent,
    CommonModule,
    LuxonDatePipe,
    TableRowTemplateDirective,
    GovukHeadingComponent,
  ],
})
export class DeleteEventMappingComponent {
  eventMappingsService = inject(EventMappingsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  id = +this.route.snapshot.params.id;
  eventMappingsPath = 'admin/system-configuration/event-mappings';

  eventMapping$ = this.eventMappingsService.getEventMapping(this.id);

  deleteColumns: DatatableColumn[] = [
    { name: 'Type', prop: 'type', sortable: false },
    { name: 'Subtype', prop: 'subType', sortable: false },
    { name: 'Event name', prop: 'name', sortable: false },
    { name: 'Event handler', prop: 'handler', sortable: false },
    { name: 'Restrictions', prop: 'hasRestrictions', sortable: false },
    { name: 'Date created', prop: 'createdAt', sortable: false },
    { name: 'Status', prop: 'isActive', sortable: false },
  ];

  onDeleteConfirmed() {
    this.eventMappingsService.deleteEventMapping(this.id).subscribe(() => {
      this.router.navigate([this.eventMappingsPath], {
        queryParams: { deleteEventMapping: true },
      });
    });
  }

  onDeleteCancelled() {
    this.router.navigate([this.eventMappingsPath, this.id, 'edit']);
  }
}
