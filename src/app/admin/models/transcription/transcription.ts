import { Courthouse } from '@admin-types/courthouses/courthouse.type';

import { DateTime } from 'luxon';
import { TranscriptionStatus } from './transcription-status';

export type Transcription = {
  id: number;
  caseId: number;
  caseNumber: string;
  courthouse: Partial<Pick<Courthouse, 'id' | 'displayName' | 'courthouseName'>>;
  hearingDate: DateTime;
  hearingId?: number;
  requestedAt: DateTime;
  approvedAt?: DateTime;
  status: Partial<TranscriptionStatus>;
  isManual: boolean;
};
