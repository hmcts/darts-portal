import { HearingEventTypeEnum } from './enums';
export interface AudioEventRow {
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
