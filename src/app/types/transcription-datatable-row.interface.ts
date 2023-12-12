export interface TranscriptionDataTableRow {
  case_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  requested_ts: string;
  status: string;
  transcription_id: number;
  transcription_type: string;
  urgency: Urgency;
}

interface Urgency {
  transcription_urgency_id: number;
  description: string;
  priority_order: number;
}
