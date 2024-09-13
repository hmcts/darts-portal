export interface EventData {
  id: number;
  documentum_id: string;
  source_id: number;
  message_id: string;
  text: string;
  event_mapping: {
    id: number;
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
  version: string;
  chronicle_id: string;
  antecedent_id: string;
  is_data_anonymised: boolean;
  created_at: string;
  created_by: number;
  last_modified_at: string;
  last_modified_by: number;
  case_expired_at: string;
}
