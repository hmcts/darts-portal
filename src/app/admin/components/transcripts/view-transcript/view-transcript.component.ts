import { CommonModule, Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GovukBannerComponent } from '@common/govuk-banner/govuk-banner.component';
import { GovukHeadingComponent } from '@common/govuk-heading/govuk-heading.component';
import { LoadingComponent } from '@common/loading/loading.component';
import { TimelineComponent } from '@common/timeline/timeline.component';
import { TabsComponent } from '@components/common/tabs/tabs.component';
import { TabDirective } from '@directives/tab.directive';
import { TranscriptFacadeService } from '@facades/transcript/transcript-facade.service';
import { HistoryService } from '@services/history/history.service';
import { optionalStringToBooleanOrNull } from '@utils/transform.utils';
import { TranscriptDetailsComponent } from './transcript-details/transcript-details.component';

@Component({
  selector: 'app-view-transcript',
  standalone: true,
  templateUrl: './view-transcript.component.html',
  styleUrl: './view-transcript.component.scss',
  imports: [
    CommonModule,
    TabsComponent,
    TabDirective,
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
  location = inject(Location);
  historyService = inject(HistoryService);
  url = inject(Router).url;

  backUrl = this.historyService.getBackUrl(this.url) ?? '/admin/transcripts';

  transcriptionId = Number(this.route.snapshot.params.transcriptionId);
  updatedStatus = input(null, { transform: optionalStringToBooleanOrNull });

  transcript = toSignal(this.transcriptFacade.getTranscript(this.transcriptionId));
  history = toSignal(this.transcriptFacade.getHistory(this.transcriptionId), { initialValue: [] });
}
