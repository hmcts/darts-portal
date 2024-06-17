import { DateTime } from 'luxon';

export type FileHide = {
  id: number;
  isHidden: boolean;
  adminAction?: {
    id: number;
    reasonId: number;
    hiddenById: number;
    hiddenAt: DateTime;
    isMarkedForManualDeletion: boolean;
    markedForManualDeletionById: number;
    markedForManualDeletionAt: DateTime;
    ticketReference: string;
    comments: string;
  };
};
