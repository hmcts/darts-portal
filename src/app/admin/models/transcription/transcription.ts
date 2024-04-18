import { Courthouse } from '@admin-types/courthouses/courthouse.type';

import { DateTime } from 'luxon';
import { TranscriptionStatus } from './transcription-status';

export type Transcription = {
  id: number;
  caseNumber: string;
  courthouse: Partial<Pick<Courthouse, 'id' | 'displayName' | 'courthouseName'>>;
  hearingDate: DateTime;
  requestedAt: DateTime;
  status: Partial<TranscriptionStatus>;
  isManual: boolean;
};
