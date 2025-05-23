import { DateTime } from 'luxon';

export interface EventData {
  id: number;
  documentum_id: string;
  source_id: number;
  message_id: string;
  text: string;
  event_mapping: {
    id: number;
    name?: string;
  };
  is_log_entry: boolean;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  cases?: {
    id: number;
    courthouse: {
      id: number;
      display_name: string;
    };
    case_number: string;
  }[];
  hearings?: {
    id: number;
    case_id: number;
    case_number: string;
    hearing_date: string;
    courthouse: {
      id: number;
      display_name: string;
    };
    courtroom: {
      id: number;
      name: string;
    };
  }[];
  version: string;
  chronicle_id: string;
  antecedent_id: string;
  is_data_anonymised: boolean;
  event_status: number;
  event_ts: string;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
  case_expired_at: string;
  is_current: boolean;
}

export interface EventVersionData {
  id: number;
  event_id?: number;
  timestamp: DateTime;
  name?: string;
  courthouse: string;
  courtroom: string;
  text: string;
}
