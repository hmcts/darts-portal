import { DateTime } from 'luxon';

export type AdminEventSearchResult = {
  id: number;
  createdAt: DateTime;
  name: string;
  text: string;
  chronicleId: string;
  antecedentId: string;
  courthouse: string;
  courtroom: string;
};
