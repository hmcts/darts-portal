import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent } from '@common/data-table/data-table.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { TableRowTemplateDirective } from '@directives/table-row-template.directive';
import { LuxonDatePipe } from '@pipes/luxon-date.pipe';
import { Annotations } from '@portal-types/index';

@Component({
  selector: 'app-case-annotations-table',
  standalone: true,
  imports: [DataTableComponent, TableRowTemplateDirective, RouterLink, GovukHeadingComponent, LuxonDatePipe, NgClass],
  templateUrl: './case-annotations-table.component.html',
  styleUrl: './case-annotations-table.component.scss',
})
export class CaseAnnotationsTableComponent {
  annotations = input<Annotations[]>([]);
  caseId = input<number>();
  deleteAnnotation = output<number>();
  downloadAnnotation = output<{ annotationId: number; annotationDocumentId: number; fileName: string }>();

  columns = [
    { name: 'Hearing date', prop: 'hearingDate', sortable: true },
    { name: 'File name', prop: 'fileName', sortable: true },
    { name: 'Format', prop: 'fileType', sortable: true },
    { name: 'Date created', prop: 'uploadedTs', sortable: true },
    { name: 'Comments', prop: 'annotationText', sortable: false },
    { name: '', prop: '' },
    { name: '', prop: '' },
  ];

  onDownloadClicked(annotationId: number, annotationDocumentId: number, fileName: string) {
    this.downloadAnnotation.emit({ annotationId, annotationDocumentId, fileName });
  }

  onDeleteClicked(annotationId: number) {
    this.deleteAnnotation.emit(annotationId);
  }
}
