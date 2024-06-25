import { DateTime } from 'luxon';

export type AdminHearingSearchResult = {
  caseId: number;
  caseNumber: string;
  hearingId: number;
  hearingDate: DateTime;
  courthouse: string;
  courtroom: string;
};
