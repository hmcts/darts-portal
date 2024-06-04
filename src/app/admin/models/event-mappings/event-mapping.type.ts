import { DateTime } from 'luxon';

export type EventMapping = {
  id: number;
  type: string;
  subType: string;
  name: string;
  handler: string;
  isActive: boolean;
  hasRestrictions: boolean;
  createdAt: DateTime;
  hasEvents?: boolean;
};
