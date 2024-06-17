import { DateTime } from 'luxon';

export type AssociatedCase = {
  caseId: number;
  hearingId: number;
  caseNumber: string;
  hearingDate: DateTime;
  defendants?: string[];
  judges?: string[];
};
