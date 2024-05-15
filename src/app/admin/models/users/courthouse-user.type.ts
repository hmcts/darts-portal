import { SecurityGroup } from '..';
import { SecurityRole } from './security-role.type';

export type CourthouseUser = {
  userName: string;
  email: string;
  roleType: string;
  role: SecurityRole;
  groups: SecurityGroup[];
  id: number;
};
