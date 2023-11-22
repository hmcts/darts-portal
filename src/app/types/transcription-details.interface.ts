export interface TranscriptionDetails {
  case_id: number;
  case_number: string;
  courthouse: string;
  defendants: string[];
  judges: string[];
  transcript_file_name: string;
  hearing_date: string;
  urgency: string;
  request_type: string;
  transcription_start_ts: string;
  transcription_end_ts: string;
}
