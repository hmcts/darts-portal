import { DateTime } from 'luxon';

export type TransformedMediaRequest = {
  id: number;
  startAt: DateTime;
  endAt: DateTime;
  requestedAt: DateTime;
  hearing: {
    id: number;
    hearingDate: DateTime;
  };
  courtroom: {
    id: number;
    name: string;
  };
  requestedById: number;
  ownerId: number;
};
