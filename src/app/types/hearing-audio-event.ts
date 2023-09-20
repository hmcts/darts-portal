import { HearingEventTypeEnum } from './enums';

export interface HearingAudio {
  id: number;
  media_start_timestamp: string;
  media_end_timestamp: string;
}

export interface HearingEvent {
  id: number;
  timestamp: string;
  name: string;
  text: string;
}

export interface HearingAudioEventViewModel {
  id: number;
  type?: HearingEventTypeEnum;

  //Audio
  media_start_timestamp?: string;
  media_end_timestamp?: string;

  //Event
  timestamp?: string;
  name?: string;
  text?: string;
}
