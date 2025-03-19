import { DateTime } from 'luxon';

export type AudioVersion = {
  id: number;
  courthouse: {
    id: number;
    displayName: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  startAt: DateTime;
  endAt: DateTime;
  channel: number;
  chronicleId: string;
  antecedentId: string;
  isCurrent: boolean;
  createdAt: DateTime;
};
