export interface TranscriptionRequest {
  hearing_id: number;
  case_id: number;
  transcription_urgency_id: number;
  transcription_type_id: number;
  comment: string;
  start_date_time: string;
  end_date_time: string;
}
