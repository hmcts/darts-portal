import { AdminActionAudioData } from '@admin-types/transformed-media/admin-action-data.interface';
import { MediaData } from './media.interface';

export interface AudioFileMarkedDeletionData {
  media: MediaData[];
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
  admin_action: AdminActionAudioData;
}
