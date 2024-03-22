import { CourthouseData } from '@core-types/index';
import { SecurityRole } from '../users/security-role.type';
import { User } from '../users/user.type';

export type SecurityGroup = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  displayState: boolean;
  globalAccess: boolean;

  securityRoleId: number;
  role?: SecurityRole;

  courthouseIds: number[];
  courthouses?: CourthouseData[];

  userIds: number[];
  users?: User[];
};
