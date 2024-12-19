import { DateTime } from 'luxon';

export type AssociatedHearing = {
  caseId: number;
  hearingId: number;
  caseNumber: string;
  hearingDate: DateTime;
  courthouse?: string;
  courtroom?: string;
};
