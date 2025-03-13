import { DateTime } from 'luxon';

export type HearingAudio = {
  id: number;
  startAt: DateTime;
  endAt: DateTime;
  filename: string;
  channel: number;
  totalChannels: number;
};
