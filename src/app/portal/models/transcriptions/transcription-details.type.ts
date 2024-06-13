import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { DateTime } from 'luxon';
import { Urgency } from './transcription-urgency.interface';

export type TranscriptionDetails = {
  caseReportingRestrictions?: ReportingRestriction[];
  caseId: number;
  caseNumber: string;
  courthouse: string;
  courtroom: string;
  courthouseId?: number;
  status?: string;
  from?: string;
  received?: DateTime;
  requestorComments?: string;
  rejectionReason?: string;
  defendants: string[];
  judges: string[];
  transcriptFileName: string;
  hearingDate: DateTime;
  urgency: Urgency;
  requestType: string;
  transcriptionId: number;
  transcriptionStartTs: DateTime;
  transcriptionEndTs: DateTime;
  transcriptionObjectId: number;
  isManual: boolean;
  hearingId: number;
};
