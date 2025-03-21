import { AudioVersion } from './audio-version';

export interface AudioVersions {
  mediaObjectId: string;
  currentVersion: AudioVersion;
  previousVersions: AudioVersion[];
}
