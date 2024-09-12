import { TranscriptionDetails } from '@portal-types/index';
import { SecurityGroup } from '..';
import { AssignedTo } from './transcription-assignee';

export interface TranscriptionAdminDetails extends TranscriptionDetails {
  assignedTo?: AssignedTo;
  assignedGroups?: SecurityGroup[];
}
