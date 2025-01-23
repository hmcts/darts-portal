import { DateTime } from 'luxon';
import { Media } from './media.type';

export type AudioFileMarkedDeletion = {
  media?: Media[];
  mediaId?: number;
  startAt: DateTime;
  endAt: DateTime;
  courthouse: string;
  courtroom: string;
  hiddenById: number;
  markedById?: number;
  markedHiddenBy?: string;
  comments: string[];
  ticketReference: string;
  reasonId: number;
  reasonName?: string;
};
