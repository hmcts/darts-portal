import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReportingRestrictionComponent } from '@common/reporting-restriction/reporting-restriction.component';
import {
  AudioRequest,
  AudioResponse,
  ErrorSummaryEntry,
  HearingAudioEventViewModel,
  HearingPageState,
} from '@darts-types/index';
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
import { DateTime } from 'luxon';

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
  audioTimes: { startTime: DateTime; endTime: DateTime } | null = null;
  private _state: HearingPageState = 'Default';
  public errorSummary: ErrorSummaryEntry[] = [];

  requestId!: number;

  requestObject!: AudioRequest;

  hearingId = this.route.snapshot.params.hearing_id;
  caseId = this.route.snapshot.params.caseId;
  userState = this.route.snapshot.data.userState;

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

  onEventsSelected(audioAndEvents: HearingAudioEventViewModel[]) {
    const timestamps: number[] = [];

    if (audioAndEvents.length) {
      audioAndEvents.forEach((audioAndEvent: HearingAudioEventViewModel) => {
        if (audioAndEvent.timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.timestamp).toUTC().toUnixInteger());
        }
        if (audioAndEvent.media_start_timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.media_start_timestamp).toUTC().toUnixInteger());
        }
        if (audioAndEvent.media_end_timestamp) {
          timestamps.push(DateTime.fromISO(audioAndEvent.media_end_timestamp).toUTC().toUnixInteger());
        }
      });

      const startDateTime = DateTime.fromSeconds(Math.min(...timestamps)).toUTC();
      const endDateTime = DateTime.fromSeconds(Math.max(...timestamps)).toUTC();

      this.audioTimes = { startTime: startDateTime, endTime: endDateTime };
    } else {
      this.audioTimes = null;
    }
  }

  onAudioRequest(requestObject: AudioRequest) {
    this.requestObject = requestObject;
    this.state = 'OrderSummary';
  }

  onStateChanged(state: HearingPageState) {
    this.state = state;
  }

  onValidationError(errorSummary: ErrorSummaryEntry[]) {
    this.errorSummary = errorSummary;
    setTimeout(() => {
      document.getElementById('error-' + this.errorSummary[0].fieldId)?.focus();
    });
  }

  onBack(event: Event) {
    event.preventDefault();
    this.state = 'Default';
  }

  focus(id: string) {
    document.getElementById(id)?.focus();
  }

  onOrderConfirm(requestObject: AudioRequest) {
    this.hearingService.requestAudio(requestObject).subscribe((response: AudioResponse) => {
      this.state = 'OrderConfirmation';
      this.requestId = response.request_id;
    });
  }
}
