import { DateTime } from 'luxon';

export type AdminCaseSearchResult = {
  id: number;
  number: string;
  courthouse: string;
  courtrooms: string[];
  judges: string[];
  defendants: string[];
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};
