export interface UserAudioRequest {
  media_request_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  media_request_start_ts: string;
  media_request_end_ts: string;
  media_request_expiry_ts?: string;
  media_request_status: 'OPEN' | 'PROCESSING' | 'FAILED' | 'COMPLETED';
}
