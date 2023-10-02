import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import { AudioRequest, AudioResponse, HearingAudioEventViewModel, HearingPageState } from '@darts-types/index';
import { CaseService } from '@services/case/case.service';
import { HeaderService } from '@services/header/header.service';
import { HearingService } from '@services/hearing/hearing.service';
import { UserService } from '@services/user/user.service';
import { combineLatest } from 'rxjs';
import { EventsAndAudioComponent } from './events-and-audio/events-and-audio.component';
import { HearingFileComponent } from './hearing-file/hearing-file.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RequestPlaybackAudioComponent } from './request-playback-audio/request-playback-audio.component';
import { LoadingComponent } from '../common/loading/loading.component';

@Component({
  selector: 'app-hearing',
  standalone: true,
  templateUrl: './hearing.component.html',
  styleUrls: ['./hearing.component.scss'],
  imports: [
    CommonModule,
    HearingFileComponent,
    EventsAndAudioComponent,
    RequestPlaybackAudioComponent,
    OrderConfirmationComponent,
    ReportingRestrictionComponent,
    RouterLink,
    LoadingComponent,
  ],
})
export class HearingComponent {
  private route = inject(ActivatedRoute);
  private caseService = inject(CaseService);
  hearingService = inject(HearingService);
  headerService = inject(HeaderService);
  userService = inject(UserService);
  requestAudioTimes: Map<string, Date> | undefined;
  private _state: HearingPageState = 'Default';

  // getter for state variable
  public get state() {
    return this._state;
  }

  // overriding state setter to call show/hide navigation
  public set state(value: HearingPageState) {
    if (value === 'Default') {
      this.headerService.showPrimaryNavigation(true);
    } else {
      this.headerService.showPrimaryNavigation(false);
    }
    this._state = value;
  }

  requestId!: number;

  requestObject!: AudioRequest;

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;

  userProfile$ = this.userService.getUserProfile();

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

  onAudioRequest(requestObject: AudioRequest) {
    this.requestObject = requestObject;
    this.state = 'OrderSummary';
  }

  onStateChanged(state: HearingPageState) {
    this.state = state;
  }

  onBack(event: Event) {
    event.preventDefault();
    this.state = 'Default';
  }

  onOrderConfirm(requestObject: AudioRequest) {
    this.hearingService.requestAudio(requestObject).subscribe((response: AudioResponse) => {
      this.state = 'OrderConfirmation';
      this.requestId = response.request_id;
    });
  }
}
