export interface WorkRequest {
  transcription_id: number;
  case_id: number;
  case_number: string;
  courthouse_name: string;
  hearing_date: string;
  transcription_type: string;
  status: WorkStatus;
  urgency: string;
  requested_ts: string;
  state_change_ts: string;
  is_manual: boolean;
}

type WorkStatus = 'COMPLETED' | 'WITH TRANSCRIBER';

export interface WorkRequests extends Array<WorkRequest> {}
