import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CaseService } from 'src/app/services/case/case.service';
import { HearingService } from 'src/app/services/hearing/hearing.service';
import { HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { EventsAndAudioComponent } from './events-and-audio/events-and-audio.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent, EventsAndAudioComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  hearingService = inject(HearingService);

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  case$ = this.caseService.getCase(this.caseId);
  hearing$ = this.caseService.getHearingById(this.caseId, this.hearingId);
  audio$ = this.hearingService.getAudio(this.hearingId);
  events$ = this.hearingService.getEvents(this.hearingId);
  audioAndEvents$ = combineLatest({ audio: this.audio$, events: this.events$ });

  onEventsSelected(audioAndEvents: HearingAudioEventViewModel[]) {
    console.log(audioAndEvents);
  }
}
