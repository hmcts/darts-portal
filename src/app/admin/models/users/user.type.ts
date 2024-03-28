import { SecurityGroup } from '@admin-types/index';
import { DateTime } from 'luxon';

export type User = {
  id: number;
  lastLoginAt: DateTime;
  lastModifiedAt: DateTime;
  createdAt: DateTime;
  fullName: string;
  emailAddress: string;
  description: string;
  active: boolean;
  securityGroupIds: number[];
  securityGroups?: SecurityGroup[];
};
