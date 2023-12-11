export type AudioRequestType = 'PLAYBACK' | 'DOWNLOAD';
export type AudioRequestStatus = 'OPEN' | 'PROCESSING' | 'FAILED' | 'COMPLETED' | 'EXPIRED';

export interface MediaRequest {
  case_id: number;
  media_request_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_id: number;
  hearing_date: string;
  start_ts: string;
  end_ts: string;
  transformed_media_expiry_ts: string;
  media_request_status: AudioRequestStatus;
  request_type: AudioRequestType;
  last_accessed_ts?: string;
  transformed_media_filename: string;
  transformed_media_format: string;
  transformed_media_id: number;
}

export interface MediaRequests {
  media_request_details: MediaRequest[];
  transformed_media_details: MediaRequest[];
}
