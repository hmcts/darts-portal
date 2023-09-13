import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CaseService } from 'src/app/services/case/case.service';
import { HearingService } from 'src/app/services/hearing/hearing.service';
import { HearingAudioEventViewModel } from 'src/app/types/hearing-audio-event';
import { EventsAndAudioComponent } from './events-and-audio/events-and-audio.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { RequestPlaybackAudioComponent } from './request-playback-audio/request-playback-audio.component';

@Component({
  selector: 'app-hearing',
  standalone: true,
  imports: [CommonModule, HearingFileComponent, EventsAndAudioComponent, RequestPlaybackAudioComponent],
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
})
export class HearingComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  hearingService = inject(HearingService);
  requestAudioTimes: Map<string, Date> | undefined;

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  case$ = this.caseService.getCase(this.caseId);
  hearing$ = this.caseService.getHearingById(this.caseId, this.hearingId);
  audio$ = this.hearingService.getAudio(this.hearingId);
  events$ = this.hearingService.getEvents(this.hearingId);
  data$ = combineLatest({
    case: this.case$,
    hearing: this.hearing$,
    audios: this.audio$,
    events: this.events$,
  });

  onEventsSelected(audioAndEvents: HearingAudioEventViewModel[]) {
    const timestamps: number[] = [];
    const requestAudioTimes = new Map<string, Date>();

    if (audioAndEvents.length) {
      audioAndEvents.forEach((val: HearingAudioEventViewModel) => {
        if (val.timestamp) {
          timestamps.push(new Date(val.timestamp).getTime());
        }
        if (val.media_start_timestamp) {
          timestamps.push(new Date(val.media_start_timestamp).getTime());
        }
        if (val.media_end_timestamp) {
          timestamps.push(new Date(val.media_end_timestamp).getTime());
        }
      });
      const startDateTimeStamp = new Date(Math.min(...timestamps));
      const endDateTimeStamp = new Date(Math.max(...timestamps));
      requestAudioTimes.set('startDateTime', startDateTimeStamp);
      requestAudioTimes.set('endDateTime', endDateTimeStamp);
      this.requestAudioTimes = requestAudioTimes;
    } else {
      this.requestAudioTimes = undefined;
    }
  }
}
