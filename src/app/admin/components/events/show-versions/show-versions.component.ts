import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-show-versions',
  imports: [
    RouterLink,
    GovukHeadingComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    LuxonDatePipe,
    CommonModule,
  ],
  templateUrl: './show-versions.component.html',
  styleUrl: './show-versions.component.scss',
})
export class ShowVersionsComponent {
  eventsFacadeService = inject(EventsFacadeService);
  route = inject(ActivatedRoute);

  id = input(0, { transform: numberAttribute });

  columns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'id', sortable: true },
    { name: 'Timestamp', prop: 'timestamp', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom' },
    { name: 'Text', prop: 'text', sortable: true },
  ];

  versions = toSignal(toObservable(this.id).pipe(switchMap((id) => this.eventsFacadeService.getEventVersions(id))));
  currentVersion = computed(() => this.versions()?.currentVersion);
  previousVersions = computed(() => this.versions()?.previousVersions ?? []);
}
