import { LinkedCase } from '@core-types/linked-case/linked-case.interface';
import { DateTime } from 'luxon';

export type AdminCaseSearchResult = {
  id: number;
  number: string;
  linked_cases?: LinkedCase[];
  courthouse: string;
  courtrooms: string[];
  judges: string[];
  defendants: string[];
  isDataAnonymised?: boolean;
  dataAnonymisedAt?: DateTime;
};
