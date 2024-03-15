import { SecurityRole } from './security-role.type';

export type SecurityGroup = {
  id: number;
  name: string;
  securityRoleId?: number;
  role?: SecurityRole;
  description?: string;
};
