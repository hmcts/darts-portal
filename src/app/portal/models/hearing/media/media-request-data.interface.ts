import { AudioRequestStatus } from '@portal-types/hearing/audio-request-status.type';
import { AudioRequestType } from '@portal-types/hearing/audio-request-type.type';

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
