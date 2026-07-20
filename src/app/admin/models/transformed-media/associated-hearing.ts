import { DateTime } from 'luxon';

export type AssociatedHearing = {
  caseId: number;
  hearingId: number;
  caseNumber: string;
  hearingDate: DateTime;
  isHearingAnonymised: boolean;
  courthouse?: string;
  courtroom?: string;
};
