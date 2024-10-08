import { DateTime } from 'luxon';

export type AudioFileMarkedDeletion = {
  mediaId: number;
  startAt: DateTime;
  endAt: DateTime;
  courthouse: string;
  courtroom: string;
  channel: number;
  hiddenById: number;
  markedById?: number;
  markedHiddenBy?: string;
  comments: string;
  ticketReference: string;
  reasonId: number;
  reasonName?: string;
};
