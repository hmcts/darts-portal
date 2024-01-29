import { DateTime } from 'luxon';
import { ReportingRestriction } from './reporting-restriction.interface';

export interface TranscriptionDetailsData {
  case_reporting_restrictions?: ReportingRestriction[];
  case_id: number;
  case_number: string;
  courthouse: string;
  status?: string;
  from?: string;
  received?: string;
  requestor_comments?: string;
  rejection_reason?: string;
  defendants: string[];
  judges: string[];
  transcript_file_name: string;
  hearing_date: string;
  urgency: string;
  request_type: string;
  transcription_id: number;
  transcription_start_ts: string;
  transcription_end_ts: string;
  is_manual: boolean;
  hearing_id: number;
}

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
