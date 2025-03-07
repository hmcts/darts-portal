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
  is_retention_updated?: boolean;
  retention_retries?: number;
  retention_date_time_applied?: string;
  retention_policy_applied?: string;
  ret_conf_score?: number;
  ret_conf_reason?: string;
  ret_conf_updated_ts?: string;
  case_object_id: string;
  case_object_name?: string;
  case_type?: string;
  upload_priority?: number;
  case_status: string;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
  is_deleted: boolean;
  case_deleted_at?: string;
  case_deleted_by: number;
  is_data_anonymised: boolean;
  data_anonymised_at?: string;
  data_anonymised_by: number;
  is_interpreter_used: boolean;
}
