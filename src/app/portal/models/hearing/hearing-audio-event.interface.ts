import { Observable } from 'rxjs';
import { HearingAudio } from './hearing-audio.interface';
import { HearingEvent } from './hearing-event.interface';

export type AudioEventRow = Partial<HearingEvent> &
  Partial<HearingAudio> & {
    id: number;
    type: 'event' | 'audio';
    audioIsReady$?: Observable<number>;
  };
