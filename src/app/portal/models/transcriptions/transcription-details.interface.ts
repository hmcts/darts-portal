import { ReportingRestriction } from '@core-types/reporting-restriction/reporting-restriction.interface';
import { Urgency } from './transcription-urgency.interface';

export interface TranscriptionDetailsData {
  case_reporting_restrictions?: ReportingRestriction[];
  case_id: number;
  case_number: string;
  courthouse: string;
  courtroom: string;
  courthouse_id: number;
  status?: string;
  from?: string;
  received?: string;
  requestor_comments?: string;
  rejection_reason?: string;
  defendants: string[];
  judges: string[];
  transcript_file_name: string;
  hearing_date: string;
  transcription_urgency: Urgency;
  request_type: string;
  transcription_id: number;
  transcription_start_ts: string;
  transcription_end_ts: string;
  transcription_object_id: number;
  is_manual: boolean;
  hearing_id: number;
  requestor?: {
    user_id: number;
    user_full_name: string;
  };
}
