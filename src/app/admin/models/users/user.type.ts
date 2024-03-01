import { SecurityGroup } from '@admin-types/users/security-group.type';
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
  securityGroupIds?: number[]; //to be removed
  securityGroups?: SecurityGroup[];
};
