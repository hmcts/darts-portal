export interface PostAudioResponse {
  request_id: number;
  case_id: string;
  courthouse_name: string;
  defendants: string[];
  hearing_date: string;
  start_time: string;
  end_time: string;
}
