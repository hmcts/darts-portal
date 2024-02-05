import { DateTime } from 'luxon';

export type Hearing = {
  id: number;
  date: DateTime;
  judges: string[];
  courtroom: string;
  transcriptCount: number;
};
