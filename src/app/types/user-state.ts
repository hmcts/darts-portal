export interface UserState {
  userId: number;
  userName: string;
  roles: Role[];
}

interface Role {
  roleId: number;
  roleName: string;
  permissions?: Permissions[];
}

interface Permissions {
  permissionId: number;
  permissionName: string;
}
