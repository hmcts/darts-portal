import { DateTime } from 'luxon';

export type AdminEventSearchResult = {
  id: number;
  eventTs: DateTime;
  name: string;
  text: string;
  chronicleId: string;
  antecedentId: string;
  courthouse: string;
  courtroom: string;
  isEventAnonymised?: boolean;
  isCaseExpired?: boolean;
};
