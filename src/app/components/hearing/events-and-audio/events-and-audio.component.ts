import { HearingService } from './../../../services/hearing/hearing.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-events-and-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-and-audio.component.html',
  styleUrls: ['./events-and-audio.component.scss'],
})
export class EventsAndAudioComponent {
  hearingService = inject(HearingService);
  route = inject(ActivatedRoute);

  // hearingId$ = this.route.params.pipe(map(params => params['hearingId']))
  // caseId$ = this.route.snapshot.params.caseId;
  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  audio$ = this.hearingService.getAudio(this.hearingId);
  events$ = this.hearingService.getEvents(this.hearingId);
}
