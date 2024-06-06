export interface TransformedMediaAdminData {
  id: number;
  file_name: string;
  file_format: string;
  file_size_bytes: number;
  media_request: {
    id: number;
    requested_at: string;
    owner_user_id: number;
    requested_by_user_id: number;
  };
  case: {
    id: number;
    case_number: string;
  };
  courthouse: {
    id: number;
    display_name: string;
  };
  hearing: {
    id: number;
    hearing_date: string;
  };
  last_accessed_at: string;
}

export interface TransformedMediaByIdAdminData {
  id: number;
  file_name: string;
  file_format: string;
  file_size_bytes: number;
  case_id: number;
  media_request_id: number;
}
