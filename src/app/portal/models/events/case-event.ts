import { DateTime } from 'luxon';

export type CaseEvent = {
  eventId: number;
  hearingId: number;
  hearingDate: DateTime;
  timestamp: DateTime;
  eventName: string;
  text: string;
  isDataAnonymised?: boolean;
  courtroom?: string;
};
