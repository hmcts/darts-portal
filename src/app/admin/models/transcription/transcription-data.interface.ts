export interface TranscriptionData {
  transcription_id: number;
  case_id: number;
  case_number: string;
  courthouse_id: number;
  hearing_date: string;
  requested_at: string;
  approved_at?: string;
  transcription_status_id: number;
  is_manual_transcription: boolean;
}
