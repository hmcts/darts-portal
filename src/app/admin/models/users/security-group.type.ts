import { CourthouseData } from '@core-types/index';
import { SecurityRole } from './security-role.type';
import { User } from './user.type';

export type SecurityGroup = {
  id: number;
  name: string;
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
