import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { DateTime } from 'luxon';

export type TranscriptionDetails = {
  caseReportingRestrictions?: ReportingRestriction[];
  caseId: number;
  caseNumber: string;
  courthouse: string;
  status?: string;
  from?: string;
  received?: DateTime;
  requestorComments?: string;
  rejectionReason?: string;
  defendants: string[];
  judges: string[];
  transcriptFileName: string;
  hearingDate: DateTime;
  urgency: string;
  requestType: string;
  transcriptionId: number;
  transcriptionStartTs: DateTime;
  transcriptionEndTs: DateTime;
  isManual: boolean;
  hearingId: number;
};
