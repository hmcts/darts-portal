export type AudioRequestType = 'PLAYBACK' | 'DOWNLOAD';
export type AudioRequestStatus = 'OPEN' | 'PROCESSING' | 'FAILED' | 'COMPLETED' | 'EXPIRED';

export interface UserAudioRequest {
  case_id: number;
  media_request_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  media_request_start_ts: string;
  media_request_end_ts: string;
  media_request_expiry_ts?: string;
  media_request_status: AudioRequestStatus;
  request_type: AudioRequestType;
  last_accessed_ts?: string;
}
