import { DateTime } from 'luxon';

export type AssociatedMedia = {
  id: number;
  channel: number;
  startAt: DateTime;
  endAt: DateTime;
  case: {
    id: number;
    caseNumber: string;
  };
  hearing: {
    id: number;
    hearingDate: DateTime;
  };
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
};
