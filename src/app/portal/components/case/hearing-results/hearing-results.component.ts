import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { transcriptStatusClassMap } from '@constants/transcript-status-class-map';
import { DatatableColumn } from '@core-types/index';
import { TabDirective } from '@directives/tab.directive';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Annotations, Hearing, TranscriptsRow } from '@portal-types/index';
import { AnnotationService } from '@services/annotation/annotation.service';
import { FileDownloadService } from '@services/file-download/file-download.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-hearing-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataTableComponent,
    TabsComponent,
    TabDirective,
    TableRowTemplateDirective,
    LuxonDatePipe,
    GovukHeadingComponent,
  ],
  templateUrl: './hearing-results.component.html',
  styleUrls: ['./hearing-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HearingResultsComponent {
  userService = inject(UserService);
  AnnotationService = inject(AnnotationService);
  fileDownloadService = inject(FileDownloadService);
  @Input() hearings: Hearing[] = [];
  @Input() transcripts: TranscriptsRow[] = [];
  @Input() annotations: Annotations[] | null = [];
  caseId: number;
  hearingsColumns: DatatableColumn[] = [];
  transcriptColumns: DatatableColumn[] = [];
  annotationColumns: DatatableColumn[] = [];

  transcriptStatusClassMap = transcriptStatusClassMap;

  constructor(private route: ActivatedRoute) {
    this.caseId = this.route.snapshot.params.caseId;

    this.hearingsColumns = [
      { name: 'Hearing date', prop: 'date', sortable: true },
      { name: 'Judge', prop: 'judges', sortable: true },
      { name: 'Courtroom', prop: 'courtroom', sortable: true },
      { name: 'No. of transcripts', prop: 'transcriptCount', sortable: true },
    ];

    this.transcriptColumns = [
      { name: 'Hearing date', prop: 'hearingDate', sortable: true },
      { name: 'Type', prop: 'type', sortable: true },
      { name: 'Requested on', prop: 'requestedOn', sortable: true },
      { name: 'Requested by', prop: 'requestedBy', sortable: true },
      { name: 'Status', prop: 'status', sortable: true },
      { name: '', prop: '' },
    ];

    this.annotationColumns = [
      { name: 'Hearing date', prop: 'hearingDate', sortable: true },
      { name: 'File name', prop: 'fileName', sortable: true },
      { name: 'Format', prop: 'fileType', sortable: true },
      { name: 'Date created', prop: 'uploadedTs', sortable: true },
      { name: 'Comments', prop: 'annotationText', sortable: false },
      { name: '', prop: '' },
      { name: '', prop: '' },
    ];
  }

  downloadAnnotation(annotationId: number, annotationDocumentId: number, fileName: string) {
    this.AnnotationService.downloadAnnotationDocument(annotationId, annotationDocumentId).subscribe((blob: Blob) => {
      this.fileDownloadService.saveAs(blob, fileName);
    });
  }
}
