import { DateTime } from 'luxon';

export type CaseEvent = {
  id: number;
  hearingId: number;
  hearingDate: DateTime;
  timestamp: DateTime;
  name: string;
  text: string;
};
