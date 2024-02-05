import { HearingEventTypeEnum } from '@portal-types/hearing/enums';

export interface AudioEventRow {
  id: number;
  type?: HearingEventTypeEnum;
  media_start_timestamp?: string;
  media_end_timestamp?: string;
  timestamp?: string;
  name?: string;
  text?: string;
}
