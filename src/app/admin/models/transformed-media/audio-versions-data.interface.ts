import { AudioVersionData } from './audio-version-data.interface';

export interface AudioVersionsData {
  media_object_id: string;
  current_version: AudioVersionData;
  previous_versions: AudioVersionData[];
}
