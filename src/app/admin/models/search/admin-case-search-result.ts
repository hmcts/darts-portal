import { LinkedCase } from '@core-types/linked-case/linked-case.interface';
import { DateTime } from 'luxon';

export type AdminCaseSearchResult = {
  id: number;
  number: string;
  linkedCases?: LinkedCase[];
  courthouse: string;
  courtrooms: string[];
  judges: string[];
  defendants: string[];
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};
