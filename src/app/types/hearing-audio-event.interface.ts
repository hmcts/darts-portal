import { DatatableRow } from './data-table-row.interface';
import { HearingEventTypeEnum } from './enums';
export interface AudioEventRow extends DatatableRow {
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
