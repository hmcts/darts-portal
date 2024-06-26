import { DateTime } from 'luxon';

export type AdminMediaSearchResult = {
  id: number;
  courthouse: string;
  courtroom: string;
  hearingDate: DateTime;
  startAt: DateTime;
  endAt: DateTime;
  channel: number;
  isHidden: boolean;
};
