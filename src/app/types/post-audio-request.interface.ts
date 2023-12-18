export interface PostAudioRequest {
  hearing_id: number;
  requestor: number;
  start_time: string;
  end_time: string;
  request_type: string;
}
