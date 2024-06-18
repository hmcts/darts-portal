import { DateTime } from 'luxon';

export type AdminAction = {
  id: number;
  reasonId: number;
  hiddenById: number;
  hiddenByName?: string;
  hiddenAt: DateTime;
  isMarkedForManualDeletion: boolean;
  markedForManualDeletionById: number;
  markedForManualDeletionBy?: string;
  markedForManualDeletionAt: DateTime;
  ticketReference: string;
  comments: string;
};
