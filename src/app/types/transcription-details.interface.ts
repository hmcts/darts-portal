export interface TranscriptionDetails {
  reporting_restriction?: string;
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
