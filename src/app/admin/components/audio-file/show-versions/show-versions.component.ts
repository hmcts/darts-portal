import { AudioVersion } from '@admin-types/transformed-media/audio-version';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, numberAttribute, OnInit } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { DatatableColumn } from '@core-types/index';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { HeaderService } from '@services/header/header.service';
import { HistoryService } from '@services/history/history.service';
import { TransformedMediaService } from '@services/transformed-media/transformed-media.service';
import { map, switchMap } from 'rxjs';

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
    GovukBannerComponent,
    CommonModule,
  ],
  templateUrl: './show-versions.component.html',
  styleUrl: './show-versions.component.scss',
})
export class ShowVersionsComponent implements OnInit {
  headerService = inject(HeaderService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  transformedMediaService = inject(TransformedMediaService);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  id = input(0, { transform: numberAttribute });

  backUrl = computed(() => this.historyService.getBackUrl(this.url) ?? `/admin/audio-file/${this.id()}`);

  hasUpdatedVersion$ = this.route.queryParams.pipe(map((params) => params.versionSet));

  selectedVersion: AudioVersion[] = [];

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

  prevColumns = [{ name: 'Select a checkbox', prop: '', sortable: false, hidden: true }, ...this.columns];

  versions = toSignal(toObservable(this.id).pipe(switchMap((id) => this.transformedMediaService.getVersions(id))));
  currentVersion = computed(() => this.versions()?.currentVersion);
  previousVersions = computed(() => this.versions()?.previousVersions ?? []);

  isLoading = computed(() => !(this.currentVersion() && this.previousVersions()));

  ngOnInit(): void {
    this.headerService.hideNavigation();
  }

  onSelectedVersion(version: AudioVersion[]): void {
    this.selectedVersion = version.slice(0, 1);
  }

  onDelete(): void {
    if (this.selectedVersion.length === 0) {
      return;
    }

    const version = this.selectedVersion[0];
    this.router.navigate(['/admin/audio-file', this.id(), 'versions', 'set-current'], {
      state: { selectedAudioId: version.id },
    });
  }
}
