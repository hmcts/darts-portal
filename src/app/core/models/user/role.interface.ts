import { Permissions } from './permission.interface';
import { RoleName } from './role-name.type';

export interface Role {
  roleId: number;
  roleName: RoleName;
  permissions?: Permissions[];
}
