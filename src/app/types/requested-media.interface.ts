import { DateTime } from 'luxon';

export type AudioRequestType = 'PLAYBACK' | 'DOWNLOAD';
export type AudioRequestStatus =
  | 'OPEN'
  | 'PROCESSING'
  | 'FAILED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'IN PROGRESS'
  | 'REQUESTED';

export interface RequestedMediaData {
  media_request_details: MediaRequestData[];
  transformed_media_details: TransformedMediaData[];
}
export interface MediaRequestData {
  case_id: number;
  media_request_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_id: number;
  hearing_date: string;
  start_ts: string;
  end_ts: string;
  media_request_status: AudioRequestStatus;
  request_type: AudioRequestType;
}

export interface TransformedMediaData extends MediaRequestData {
  transformed_media_id: number;
  transformed_media_filename: string;
  transformed_media_format: string;
  transformed_media_expiry_ts: string;
  last_accessed_ts?: string;
}

//Mapped types
export type RequestedMedia = {
  mediaRequests: MediaRequest[];
  transformedMedia: TransformedMedia[];
};

export type MediaRequest = {
  caseId: number;
  mediaRequestId: number;
  caseNumber: string;
  courthouseName: string;
  hearingId: number;
  hearingDate: DateTime;
  startTime: DateTime;
  endTime: DateTime;
  status: AudioRequestStatus;
  requestType: AudioRequestType;
};

export type TransformedMedia = MediaRequest & {
  transformedMediaId: number;
  transformedMediaFilename: string;
  transformedMediaFormat: string;
  transformedMediaExpiryTs: DateTime;
  lastAccessedTs?: DateTime;
};
