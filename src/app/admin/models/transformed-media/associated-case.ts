import { DateTime } from 'luxon';

export type AssociatedCase = {
  caseId: number;
  hearingDate: DateTime;
  defendants?: string[];
  judges?: string[];
};
