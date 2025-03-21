import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-show-versions',
  imports: [
    LoadingComponent,
    LuxonDatePipe,
    RouterLink,
    GovukHeadingComponent,
    DataTableComponent,
    TableRowTemplateDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './show-versions.component.html',
  styleUrl: './show-versions.component.scss',
})
export class ShowVersionsComponent {
  route = inject(ActivatedRoute);
  transformedMediaService = inject(TransformedMediaService);

  id = input(0, { transform: numberAttribute });

  columns: DatatableColumn[] = [
    { name: 'Audio ID', prop: 'id', sortable: true },
    { name: 'Courthouse', prop: 'courthouse', sortable: true },
    { name: 'Courtroom', prop: 'courtroom', sortable: true },
    { name: 'Start time', prop: 'startAt', sortable: true },
    { name: 'End time', prop: 'endAt', sortable: true },
    { name: 'Channel', prop: 'channel', sortable: true },
    { name: 'Antecedent ID', prop: 'antecedentId', sortable: true },
    { name: 'Chronicle ID', prop: 'chronicleId', sortable: true },
  ];

  versions = toSignal(toObservable(this.id).pipe(switchMap((id) => this.transformedMediaService.getVersions(id))));
  currentVersion = computed(() => this.versions()?.currentVersion);
  previousVersions = computed(() => this.versions()?.previousVersions ?? []);

  isLoading = computed(() => !(this.currentVersion() && this.previousVersions()));
}
