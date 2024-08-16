import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TimelineComponent } from '@common/timeline/timeline.component';
import { BreadcrumbComponent } from '@components/common/breadcrumb/breadcrumb.component';
import { DetailsTableComponent } from '@components/common/details-table/details-table.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { BreadcrumbDirective } from '@directives/breadcrumb.directive';
import { TabDirective } from '@directives/tab.directive';
import { TranscriptFacadeService } from './../../../facades/transcript/transcript-facade.service';
import { TranscriptDetailsComponent } from './transcript-details/transcript-details.component';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  templateUrl: './view-transcript.component.html',
  styleUrl: './view-transcript.component.scss',
  imports: [
    CommonModule,
    BreadcrumbComponent,
    BreadcrumbDirective,
    TabsComponent,
    TabDirective,
    DetailsTableComponent,
    TranscriptDetailsComponent,
    TimelineComponent,
    GovukBannerComponent,
    RouterLink,
    LoadingComponent,
    GovukHeadingComponent,
  ],
})
export class ViewTranscriptComponent {
  transcriptFacade = inject(TranscriptFacadeService);
  route = inject(ActivatedRoute);

  transcriptionId = Number(this.route.snapshot.params.transcriptionId);
  updatedStatus = Boolean(this.route.snapshot.queryParams.updatedStatus);

  transcript = this.transcriptFacade.getTranscript(this.transcriptionId);
  history = this.transcriptFacade.getHistory(this.transcriptionId);
}
