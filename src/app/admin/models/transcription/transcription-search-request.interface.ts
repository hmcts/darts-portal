export interface TranscriptionSearchRequest {
  transcription_id?: number | null;
  case_number: string | null;
  courthouse_display_name: string | null;
  hearing_date: string | null;
  owner: string | null;
  requested_by: string | null;
  requested_at_from: string | null;
  requested_at_to: string | null;
  is_manual_transcription: boolean | null;
}
