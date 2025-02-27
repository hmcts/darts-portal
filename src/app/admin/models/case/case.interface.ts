export interface AdminCaseData {
  id: number;
  case_number: string;
  courthouse: {
    id: number;
    display_name: string;
  };
  defendants?: string[];
  judges?: string[];
  prosecutors?: string[];
  defenders?: string[];
  reporting_restrictions?: {
    event_id: number;
    event_name: string;
    event_text: string;
    hearing_id: number;
    event_ts: string;
  }[];
  retain_until_date_time?: string;
  case_closed_date_time?: string;
  retention_date_time_applied?: string;
  retention_policy_applied?: string;
  case_object_id: string;
  case_status: string;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
  is_deleted: boolean;
  case_deleted_at?: string;
  is_data_anonymised: boolean;
  data_anonymised_at?: string;
  is_interpreter_used: boolean;
}
