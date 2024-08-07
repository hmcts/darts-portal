import { AdminActionData } from '@admin-types/transformed-media/admin-action-data.interface';

export interface AudioFileMarkedDeletionData {
  media_id: number;
  channel: number;
  start_at: string;
  end_at: string;
  courthouse: {
    id: number;
    display_name: string;
  };
  courtroom: {
    id: number;
    name: string;
  };
  admin_action: AdminActionData;
}
