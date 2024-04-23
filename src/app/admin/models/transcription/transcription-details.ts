import { TranscriptionDetails } from '@portal-types/index';
import { SecurityGroup } from '..';
import { AssignedTo } from './transcription-assignee';
import { Requestor } from './transcription-requestor';

export interface TranscriptionAdminDetails extends TranscriptionDetails {
  requestor?: Requestor;
  assignedTo?: AssignedTo;
  assignedGroups?: SecurityGroup[];
}
