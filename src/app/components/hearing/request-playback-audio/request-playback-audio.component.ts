import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTimeService } from 'src/app/services/datetime/datetime.service';
import { HearingData } from 'src/app/types/hearing';
import { requestPlaybackAudioDTO } from 'src/app/types/requestPlaybackAudioDTO';
import { TimeInputComponent } from './time-input/time-input.component';
import * as moment from 'moment';

@Component({
  selector: 'app-request-playback-audio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimeInputComponent],
  templateUrl: './request-playback-audio.component.html',
  styleUrls: ['./request-playback-audio.component.scss'],
})
export class RequestPlaybackAudioComponent implements OnChanges {
  @Input() hearing!: HearingData;
  @Input() requestAudioTimes!: Map<string, Date> | undefined;
  audioRequestForm: FormGroup;
  requestObj!: requestPlaybackAudioDTO;

  constructor(private fb: FormBuilder, public datetimeService: DateTimeService) {
    this.audioRequestForm = this.fb.group({
      startTime: this.fb.group({
        hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      }),
      endTime: this.fb.group({
        hours: [null, [Validators.required, Validators.min(0), Validators.max(23), Validators.pattern(/^\d{2}$/)]],
        minutes: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
        seconds: [null, [Validators.required, Validators.min(0), Validators.max(59), Validators.pattern(/^\d{2}$/)]],
      }),
      requestType: '',
    });
  }

  public setTimes(): void {
    this.audioRequestForm.patchValue({
      startTime: {
        hours: this.requestAudioTimes?.get('startDateTime')?.getHours().toString().padStart(2, '0'),
        minutes: this.requestAudioTimes?.get('startDateTime')?.getMinutes().toString().padStart(2, '0'),
        seconds: this.requestAudioTimes?.get('startDateTime')?.getSeconds().toString().padStart(2, '0'),
      },
      endTime: {
        hours: this.requestAudioTimes?.get('endDateTime')?.getHours().toString().padStart(2, '0'),
        minutes: this.requestAudioTimes?.get('endDateTime')?.getMinutes().toString().padStart(2, '0'),
        seconds: this.requestAudioTimes?.get('endDateTime')?.getSeconds().toString().padStart(2, '0'),
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.requestAudioTimes.currentValue !== undefined) {
      this.setTimes();
    } else {
      this.audioRequestForm.get('startTime')?.reset();
      this.audioRequestForm.get('endTime')?.reset();
    }
  }

  onSubmit() {
    const startTimeHours = this.audioRequestForm.get('startTime.hours')?.value;
    const startTimeMinutes = this.audioRequestForm.get('startTime.minutes')?.value;
    const startTimeSeconds = this.audioRequestForm.get('startTime.seconds')?.value;
    const endTimeHours = this.audioRequestForm.get('endTime.hours')?.value;
    const endTimeMinutes = this.audioRequestForm.get('endTime.minutes')?.value;
    const endTimeSeconds = this.audioRequestForm.get('endTime.seconds')?.value;

    const startDateTime = moment.utc(`${this.hearing.date}T${startTimeHours}:${startTimeMinutes}:${startTimeSeconds}`);
    const endDateTime = moment.utc(`${this.hearing.date}T${endTimeHours}:${endTimeMinutes}:${endTimeSeconds}`);

    this.requestObj = {
      hearing_id: this.hearing.id,
      // TO DO: Replace with user/Requestor ID when requesting audio
      requestor: 1,
      start_time: this.datetimeService.getIsoStringWithoutMilliseconds(startDateTime.toISOString()),
      end_time: this.datetimeService.getIsoStringWithoutMilliseconds(endDateTime.toISOString()),
      request_type: this.audioRequestForm.get('requestType')?.value,
    };
  }
}
