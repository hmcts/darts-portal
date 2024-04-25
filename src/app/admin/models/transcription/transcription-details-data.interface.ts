import { TranscriptionDetailsData } from '@portal-types/index';
import { RequestorData } from './transcription-requestor';

export interface TranscriptionAdminDetailsData extends TranscriptionDetailsData {
  requestor?: RequestorData;
}
