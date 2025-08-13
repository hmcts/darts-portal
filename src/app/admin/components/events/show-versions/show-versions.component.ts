import { EventVersionData } from '@admin-types/events';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { EventsFacadeService } from '@facades/events/events-facade.service';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-show-versions',
  imports: [
    RouterLink,
    GovukHeadingComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    LuxonDatePipe,
    NgTemplateOutlet,
    LoadingComponent,
    GovukBannerComponent,
    CommonModule,
  ],
  templateUrl: './show-versions.component.html',
  styleUrl: './show-versions.component.scss',
})
export class ShowVersionsComponent {
  eventsFacadeService = inject(EventsFacadeService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  id = input(0, { transform: numberAttribute });

  selectedVersion: EventVersionData[] = [];

  columns: DatatableColumn[] = [
    { name: 'Event ID', prop: 'id', sortable: true },
    { name: 'Timestamp', prop: 'timestamp', sortable: true },
    { name: 'Name', prop: 'name', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Text', prop: 'text', sortable: true },
  ];

  prevColumns = [{ name: 'Select a checkbox', prop: '', sortable: false, hidden: true }, ...this.columns];

  versions = toSignal(toObservable(this.id).pipe(switchMap((id) => this.eventsFacadeService.getEventVersions(id))));
  currentVersion = computed(() => this.versions()?.currentVersion);
  previousVersions = computed(() => this.versions()?.previousVersions ?? []);

  hasUpdatedVersion$ = this.route.queryParams.pipe(map((params) => params.versionSet));

  isLoading = computed(() => !(this.currentVersion() !== undefined && this.previousVersions()));

  onSelectedVersion(version: EventVersionData[]): void {
    this.selectedVersion = version.slice(0, 1);
  }

  onDelete(): void {
    if (this.selectedVersion.length === 0) {
      return;
    }

    const version = this.selectedVersion[0];
    this.router.navigate(['/admin/events', this.id(), 'versions', 'set-current'], {
      state: { selectedEventId: version.id },
    });
  }

  get sourceEventId() {
    if (this.currentVersion()) {
      return this.currentVersion()?.event_id ?? 'Not set';
    }
    return this.previousVersions().length > 0 ? this.previousVersions()[0].event_id : 'Not set';
  }
}
