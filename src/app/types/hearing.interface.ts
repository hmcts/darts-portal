import { DateTime } from 'luxon';

export type HearingData = {
  id: number;
  date: string;
  judges: string[];
  courtroom: string;
  transcript_count: number;
};

export type Hearing = {
  id: number;
  date: DateTime;
  judges: string[];
  courtroom: string;
  transcriptCount: number;
};
