import { SecurityGroup } from '@admin-types/users/security-group.type';
import { DateTime } from 'luxon';

export type Courthouse = {
  courthouseName: string;
  displayName: string;
  code: number;
  id: number;
  createdDateTime: DateTime;
  lastModifiedDateTime?: DateTime;
  regionName?: string;
  securityGroups?: SecurityGroup[];
};
