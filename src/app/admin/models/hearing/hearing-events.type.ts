import { DateTime } from 'luxon';

export type AdminHearingEvent = {
  id: number;
  timestamp: DateTime;
  name: string;
};
