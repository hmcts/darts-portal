import { AdminActionData } from './admin-action-data.interface';

export interface AudioFileData {
  id: number;
  start_at: string;
  end_at: string;
  channel: number;
  total_channels: number;
  media_type: string;
  media_format: string;
  file_size_bytes: number;
  filename: string;
  media_object_id: string;
  content_object_id: string;
  clip_id: string;
  reference_id: string;
  checksum: string;
  media_status: string;
  is_hidden: boolean;
  is_deleted: boolean;
  admin_action: AdminActionData;
  version: string;
  chronicle_id: string;
  antecedent_id: string;
  retain_until: string;
  created_at: string;
  created_by_id: number;
  last_modified_at: string;
  last_modified_by_id: number;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  hearings: {
    id: number;
    hearing_date: string;
    case_id: number;
  }[];
}
